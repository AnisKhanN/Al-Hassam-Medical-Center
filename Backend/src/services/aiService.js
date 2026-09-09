const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Medicine = require("../models/Medicine");
const Bill = require("../models/Bill");
const Sale = require("../models/Sale");
const AiAuditLog = require("../models/AiAuditLog");
const aiProvider = require("./aiProvider");
const aiFallbackService = require("./aiFallbackService");

/**
 * Safe JSON parse helper with markdown fence stripping
 */
const safeJsonParse = (str) => {
  try {
    const cleaned = aiProvider.cleanJsonOutput(str || "");
    return JSON.parse(cleaned);
  } catch (err) {
    const match = (str || "").match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw err;
  }
};

/**
 * Audit Log Helper
 */
const logAiInteraction = async ({
  userId,
  userRole,
  feature,
  promptSummary,
  tokensUsed = 0,
  latencyMs = 0,
  provider = "fallback",
  isFallback = false,
  status = "success",
  errorMessage = null,
  clinicId = null,
}) => {
  try {
    const rawUserId = userId?._id || userId?.id || userId;
    const effectiveClinicId =
      clinicId ||
      (typeof userId === "object" ? userId?.clinicId : null) ||
      null;

    await AiAuditLog.create({
      user: rawUserId,
      userRole: userRole || "Unknown",
      feature,
      promptSummary: (promptSummary || "").slice(0, 300),
      tokensUsed,
      latencyMs,
      provider,
      isFallback,
      status,
      errorMessage,
      ...(effectiveClinicId && { clinicId: effectiveClinicId }),
    });
  } catch (err) {
    console.error("Failed to write AI audit log:", err.message);
  }
};

/**
 * 1. PATIENT VISIT SUMMARY & DISCHARGE SLIP (Bilingual & Trilingual)
 */
exports.generateVisitSummary = async ({
  patientId,
  appointmentId,
  clinicalNotes = "",
  vitals = {},
  medications = [],
  nextFollowUp = null,
  language = "trilingual",
  user,
}) => {
  const startTime = Date.now();
  let patient = null;
  let appointment = null;

  const clinicFilter = user?.clinicId ? { clinicId: user.clinicId } : {};

  if (patientId) {
    patient = await Patient.findOne({ _id: patientId, ...clinicFilter });
  }
  if (appointmentId) {
    appointment = await Appointment.findOne({ _id: appointmentId, ...clinicFilter }).populate("doctor", "name email");
    if (!patient && appointment?.patient) {
      patient = await Patient.findOne({ _id: appointment.patient, ...clinicFilter });
    }
  }

  // System prompt enforcing administrative boundaries and multilingual instructions
  const systemPrompt = `You are an Administrative AI Assistant for SmartClinic SaaS in Sanghar, Sindh, Pakistan.
CRITICAL SAFETY BOUNDARY:
- Strictly administrative, compliance, and patient communication support.
- Do NOT make medical diagnoses, change doses, or prescribe new drugs.
- Provide multilingual patient discharge guidance:
  1. Standard English instructions
  2. Roman Urdu instructions (e.g. "Dawai hamesha doctor ki hidayat ke mutabiq waqt par lein")
  3. Sindhi in Arabic script سنڌي (e.g. "دوا هميشه ڊاڪٽر جي ٻڌايل وقت تي ۽ پابنديءَ سان پاڻيءَ سان کائو")
  4. Roman Sindhi instructions (e.g. "Dawa hamesha doctor je budhayal waqt te khao")
- Output MUST be valid JSON matching this exact structure:
{
  "patientInfo": { "name": string, "patientId": string, "age": string|number, "gender": string, "bloodGroup": string, "phone": string },
  "visitDetails": { "date": string, "doctor": string, "reason": string, "vitals": object, "consultationNotes": string },
  "dischargeDetails": {
    "disposition": string,
    "activityPrecautions": string,
    "dietaryGuidance": string,
    "emergencyWarningSigns": string
  },
  "medicationSchedule": [
    {
      "name": string,
      "dosage": string,
      "frequency": string,
      "duration": string,
      "timing": string,
      "timingUrdu": string,
      "timingSindhi": string,
      "timingRomanSindhi": string
    }
  ],
  "patientInstructions": {
    "english": [string],
    "romanUrdu": [string],
    "sindhi": [string],
    "romanSindhi": [string]
  },
  "followUp": string,
  "administrativeNotice": string
}`;

  const userPrompt = JSON.stringify({
    patient: patient ? { name: patient.fullName, patientId: patient.patientId, age: patient.computedAge || patient.age, gender: patient.gender, bloodGroup: patient.bloodGroup, phone: patient.phone } : null,
    appointment: appointment ? { date: appointment.appointmentDate, doctor: appointment.doctor?.name, reason: appointment.reason } : null,
    clinicalNotes,
    vitals,
    medications,
    nextFollowUp,
    language,
  });

  try {
    const aiResult = await aiProvider.generateAICompletion({
      systemPrompt,
      userPrompt,
      jsonMode: true,
      maxTokens: 1500,
    });

    const parsed = safeJsonParse(aiResult.content);
    const latencyMs = Date.now() - startTime;

    await logAiInteraction({
      userId: user?._id || user?.id,
      userRole: user?.role,
      clinicId: user?.clinicId,
      feature: "visit_summary",
      promptSummary: `Visit Summary for Patient: ${patient?.fullName || patientId}`,
      tokensUsed: aiResult.tokensUsed,
      latencyMs,
      provider: aiResult.provider,
      isFallback: false,
    });

    return { ...parsed, isFallback: false, provider: aiResult.provider };
  } catch (err) {
    // Graceful fallback to deterministic engine
    const fallbackResult = aiFallbackService.generateFallbackVisitSummary({
      patient,
      appointment,
      clinicalNotes,
      vitals,
      medications,
      nextFollowUp,
      language,
    });

    const latencyMs = Date.now() - startTime;
    await logAiInteraction({
      userId: user?._id || user?.id,
      userRole: user?.role,
      clinicId: user?.clinicId,
      feature: "visit_summary",
      promptSummary: `Visit Summary (Fallback) for Patient: ${patient?.fullName || patientId}`,
      tokensUsed: 0,
      latencyMs,
      provider: "fallback",
      isFallback: true,
    });

    return { ...fallbackResult, isFallback: true, provider: "fallback" };
  }
};

/**
 * 2. DAILY OPERATIONAL REPORT GENERATOR
 */
exports.generateDailyReport = async ({ date = new Date(), user }) => {
  const startTime = Date.now();
  const targetDate = new Date(date);
  const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0);
  const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999);

  const clinicFilter = user?.clinicId ? { clinicId: user.clinicId } : {};

  // Aggregate day metrics
  const [appointments, newPatients, bills, sales] = await Promise.all([
    Appointment.find({ ...clinicFilter, appointmentDate: { $gte: startOfDay, $lte: endOfDay } }),
    Patient.countDocuments({ ...clinicFilter, createdAt: { $gte: startOfDay, $lte: endOfDay } }),
    Bill.find({ ...clinicFilter, createdAt: { $gte: startOfDay, $lte: endOfDay } }),
    Sale.find({ ...clinicFilter, createdAt: { $gte: startOfDay, $lte: endOfDay }, status: "Completed" }),
  ]);

  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter((a) => a.status === "Completed").length;
  const cancelledAppointments = appointments.filter((a) => a.status === "Cancelled").length;
  const noShowAppointments = appointments.filter((a) => a.status === "No-show").length;

  const opdRevenue = bills.reduce((acc, b) => acc + (b.amountPaid || 0), 0);
  const pharmacyRevenue = sales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
  const totalRevenue = opdRevenue + pharmacyRevenue;

  // Medicine frequency in sales
  const medCounts = {};
  sales.forEach((s) => {
    (s.items || []).forEach((item) => {
      const name = item.medicineName || "Unknown Medicine";
      medCounts[name] = (medCounts[name] || 0) + (item.quantity || 1);
    });
  });

  const topMedicines = Object.entries(medCounts)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const metrics = {
    totalAppointments,
    completedAppointments,
    cancelledAppointments,
    noShowAppointments,
    newPatientsRegistered: newPatients,
    opdRevenue,
    pharmacyRevenue,
    totalRevenue,
    topMedicines,
    peakHours: "11:00 AM - 01:30 PM & 06:00 PM - 08:30 PM",
  };

  const systemPrompt = `You are an Executive Clinic Operations Analyst for a medical SaaS in Sanghar, Pakistan.
Generate a professional daily operational report in clean JSON:
{
  "date": string,
  "headline": string,
  "summaryText": string (Markdown formatted with sections: Executive Summary, Financial Performance, Bottlenecks, and Action Items for tomorrow),
  "kpis": object,
  "topMedicines": array,
  "bottlenecks": [string]
}`;

  try {
    const aiResult = await aiProvider.generateAICompletion({
      systemPrompt,
      userPrompt: JSON.stringify({ date: targetDate.toISOString(), metrics }),
      jsonMode: true,
      maxTokens: 1400,
    });

    const parsed = safeJsonParse(aiResult.content);
    const latencyMs = Date.now() - startTime;

    await logAiInteraction({
      userId: user?._id || user?.id,
      userRole: user?.role,
      clinicId: user?.clinicId,
      feature: "daily_report",
      promptSummary: `Daily Report for ${startOfDay.toDateString()}`,
      tokensUsed: aiResult.tokensUsed,
      latencyMs,
      provider: aiResult.provider,
      isFallback: false,
    });

    return { ...parsed, isFallback: false, provider: aiResult.provider };
  } catch (err) {
    const fallbackResult = aiFallbackService.generateFallbackDailyReport({
      date: targetDate,
      metrics,
    });

    const latencyMs = Date.now() - startTime;
    await logAiInteraction({
      userId: user?._id || user?.id,
      userRole: user?.role,
      clinicId: user?.clinicId,
      feature: "daily_report",
      promptSummary: `Daily Report (Fallback) for ${startOfDay.toDateString()}`,
      tokensUsed: 0,
      latencyMs,
      provider: "fallback",
      isFallback: true,
    });

    return { ...fallbackResult, isFallback: true, provider: "fallback" };
  }
};

/**
 * 3. PHARMACY INVENTORY INSIGHTS & EXPIRY ALERTS
 */
exports.getInventoryInsights = async ({ user }) => {
  const startTime = Date.now();
  const clinicFilter = user?.clinicId ? { clinicId: user.clinicId } : {};
  const medicines = await Medicine.find({ ...clinicFilter, isActive: true }).select("name category unitPrice reorderLevel batches");
  const salesCount = await Sale.countDocuments(clinicFilter);

  const fallbackResult = aiFallbackService.generateFallbackInventoryInsights({
    medicines,
    salesCount,
  });

  // Check if cloud AI can enhance recommendations
  const systemPrompt = `You are an expert Pharmacy Inventory Strategist for local healthcare in Pakistan.
Review these inventory statistics and provide high-value, actionable recommendations for stock management, supplier negotiations, and regional disease trends (e.g. monsoon/flu).
Return JSON:
{
  "recommendations": [string],
  "seasonalGuidance": string,
  "deadStockAnalysis": string
}`;

  try {
    const aiResult = await aiProvider.generateAICompletion({
      systemPrompt,
      userPrompt: JSON.stringify(fallbackResult.overview),
      jsonMode: true,
      maxTokens: 800,
    });

    const parsed = safeJsonParse(aiResult.content);
    const latencyMs = Date.now() - startTime;

    await logAiInteraction({
      userId: user?._id || user?.id,
      userRole: user?.role,
      clinicId: user?.clinicId,
      feature: "inventory_insights",
      promptSummary: "Pharmacy Inventory Analysis",
      tokensUsed: aiResult.tokensUsed,
      latencyMs,
      provider: aiResult.provider,
      isFallback: false,
    });

    return {
      ...fallbackResult,
      recommendations: parsed.recommendations || fallbackResult.recommendations,
      seasonalGuidance: parsed.seasonalGuidance,
      deadStockAnalysis: parsed.deadStockAnalysis,
      isFallback: false,
      provider: aiResult.provider,
    };
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    await logAiInteraction({
      userId: user?._id || user?.id,
      userRole: user?.role,
      clinicId: user?.clinicId,
      feature: "inventory_insights",
      promptSummary: "Pharmacy Inventory Analysis (Fallback)",
      tokensUsed: 0,
      latencyMs,
      provider: "fallback",
      isFallback: true,
    });

    return { ...fallbackResult, isFallback: true, provider: "fallback" };
  }
};

/**
 * 4. SALES & FINANCIAL ANALYSIS
 */
exports.getSalesAnalysis = async ({ timeframe = "30d", user }) => {
  const startTime = Date.now();

  const days = timeframe === "7d" ? 7 : timeframe === "90d" ? 90 : 30;
  const dateFrom = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const clinicFilter = user?.clinicId ? { clinicId: user.clinicId } : {};

  const [salesAgg, billsAgg] = await Promise.all([
    Sale.aggregate([
      { $match: { ...clinicFilter, createdAt: { $gte: dateFrom }, status: "Completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          transactionCount: { $sum: 1 },
        },
      },
    ]),
    Bill.aggregate([
      { $match: { ...clinicFilter, createdAt: { $gte: dateFrom } } },
      {
        $group: {
          _id: null,
          totalCollected: { $sum: "$amountPaid" },
          totalDiscount: { $sum: "$discount" },
          billCount: { $sum: 1 },
        },
      },
    ]),
  ]);

  const salesStats = salesAgg[0] || { totalRevenue: 0, transactionCount: 0 };
  const billingStats = billsAgg[0] || { totalCollected: 0, totalDiscount: 0, billCount: 0 };

  const fallbackResult = aiFallbackService.generateFallbackSalesAnalysis({
    salesStats,
    billingStats,
    timeframe,
  });

  const latencyMs = Date.now() - startTime;
  await logAiInteraction({
    userId: user?._id || user?.id,
    userRole: user?.role,
    clinicId: user?.clinicId,
    feature: "sales_analysis",
    promptSummary: `Sales Analysis for ${timeframe}`,
    tokensUsed: 0,
    latencyMs,
    provider: "fallback",
    isFallback: true,
  });

  return { ...fallbackResult, isFallback: true, provider: "fallback" };
};

/**
 * 5. NATURAL LANGUAGE SEARCH (Semantic Query Assistant)
 */
exports.executeNaturalLanguageQuery = async ({ query, user, userRole }) => {
  const startTime = Date.now();

  const clinicFilter = user?.clinicId ? { clinicId: user.clinicId } : {};

  // Gather light context
  const [totalRevenueAgg, salesTotalAgg, patientCount, appointmentCount, medicines] = await Promise.all([
    Bill.aggregate([{ $match: clinicFilter }, { $group: { _id: null, total: { $sum: "$amountPaid" } } }]),
    Sale.aggregate([{ $match: { ...clinicFilter, status: "Completed" } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
    Patient.countDocuments({ ...clinicFilter, isActive: true }),
    Appointment.countDocuments(clinicFilter),
    Medicine.find({ ...clinicFilter, isActive: true }).select("name batches reorderLevel unitPrice").limit(50),
  ]);

  const totalRevenue = totalRevenueAgg[0]?.total || 0;
  const salesTotal = salesTotalAgg[0]?.total || 0;

  // Find expiring medicines
  const in90Days = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  const expiringList = [];
  medicines.forEach((m) => {
    (m.batches || []).forEach((b) => {
      if (b.quantity > 0 && b.expiryDate && new Date(b.expiryDate) <= in90Days) {
        expiringList.push({
          medicine: m.name,
          batch: b.batchNumber,
          expiry: new Date(b.expiryDate).toLocaleDateString("en-GB"),
          stock: b.quantity,
          unitPrice: `PKR ${m.unitPrice}`,
        });
      }
    });
  });

  const contextData = {
    totalRevenue,
    salesTotal,
    patientCount,
    appointmentCount,
    medicinesCount: medicines.length,
    expiringCount: expiringList.length,
    expiringList: expiringList.slice(0, 8),
  };

  const systemPrompt = `You are an Intelligent Natural Language Search Assistant for a clinic & pharmacy management SaaS.
Translate the user's natural language question into a concise, direct answer and a structured tabular list of matching data.
Strictly adhere to the user's role: "${userRole}".
Do not reveal clinical notes or medical diagnoses.
Output JSON:
{
  "query": string,
  "category": string ("financial" | "inventory" | "appointments" | "patients" | "general"),
  "answer": string,
  "data": [object]
}`;

  try {
    const aiResult = await aiProvider.generateAICompletion({
      systemPrompt,
      userPrompt: JSON.stringify({ query, userRole, contextData }),
      jsonMode: true,
      maxTokens: 800,
    });

    const parsed = safeJsonParse(aiResult.content);
    const latencyMs = Date.now() - startTime;

    await logAiInteraction({
      userId: user?._id || user?.id,
      userRole,
      clinicId: user?.clinicId,
      feature: "nl_search",
      promptSummary: `Search: ${query}`,
      tokensUsed: aiResult.tokensUsed,
      latencyMs,
      provider: aiResult.provider,
      isFallback: false,
    });

    return { ...parsed, isFallback: false, provider: aiResult.provider };
  } catch (err) {
    const fallbackResult = aiFallbackService.generateFallbackNLQuery({
      query,
      userRole,
      contextData,
    });

    const latencyMs = Date.now() - startTime;
    await logAiInteraction({
      userId: user?._id || user?.id,
      userRole,
      clinicId: user?.clinicId,
      feature: "nl_search",
      promptSummary: `Search (Fallback): ${query}`,
      tokensUsed: 0,
      latencyMs,
      provider: "fallback",
      isFallback: true,
    });

    return { ...fallbackResult, isFallback: true, provider: "fallback" };
  }
};

/**
 * 6. ADMINISTRATIVE & OPERATIONAL RECOMMENDATIONS
 */
exports.getAdministrativeRecommendations = async ({ user }) => {
  const startTime = Date.now();

  const clinicFilter = user?.clinicId ? { clinicId: user.clinicId } : {};

  const [totalAppointments, noShowAppointments] = await Promise.all([
    Appointment.countDocuments(clinicFilter),
    Appointment.countDocuments({ ...clinicFilter, status: "No-show" }),
  ]);

  const noShowRate = totalAppointments > 0
    ? `${((noShowAppointments / totalAppointments) * 100).toFixed(1)}%`
    : "5.4%";

  const fallbackResult = aiFallbackService.generateFallbackRecommendations({
    waitingTimeAvg: 16,
    noShowRate,
  });

  const latencyMs = Date.now() - startTime;
  await logAiInteraction({
    userId: user?._id || user?.id,
    userRole: user?.role,
    clinicId: user?.clinicId,
    feature: "recommendations",
    promptSummary: "Administrative Operational Recommendations",
    tokensUsed: 0,
    latencyMs,
    provider: "fallback",
    isFallback: true,
  });

  return { ...fallbackResult, isFallback: true, provider: "fallback" };
};

/**
 * 7. PRESCRIPTION / INVOICE TEXT PARSER
 */
exports.parsePrescriptionText = async ({ rawText, user }) => {
  const startTime = Date.now();

  const systemPrompt = `You are an OCR and Prescription Text Parsing Assistant for SmartClinic Pharmacy.
Extract all medicine items from the raw text into structured JSON.
Return JSON:
{
  "rawLength": number,
  "parsedItemsCount": number,
  "items": [
    {
      "medicineName": string,
      "dosage": string,
      "frequency": string,
      "instructions": string,
      "suggestedQty": number
    }
  ]
}`;

  try {
    const aiResult = await aiProvider.generateAICompletion({
      systemPrompt,
      userPrompt: rawText,
      jsonMode: true,
      maxTokens: 1000,
    });

    const parsed = safeJsonParse(aiResult.content);
    const latencyMs = Date.now() - startTime;

    await logAiInteraction({
      userId: user?._id || user?.id,
      userRole: user?.role,
      clinicId: user?.clinicId,
      feature: "parse_text",
      promptSummary: "Prescription / Invoice Text Parsing",
      tokensUsed: aiResult.tokensUsed,
      latencyMs,
      provider: aiResult.provider,
      isFallback: false,
    });

    return { ...parsed, isFallback: false, provider: aiResult.provider };
  } catch (err) {
    const fallbackResult = aiFallbackService.parseFallbackPrescriptionText(rawText);
    const latencyMs = Date.now() - startTime;

    await logAiInteraction({
      userId: user?._id || user?.id,
      userRole: user?.role,
      clinicId: user?.clinicId,
      feature: "parse_text",
      promptSummary: "Prescription / Invoice Text Parsing (Fallback)",
      tokensUsed: 0,
      latencyMs,
      provider: "fallback",
      isFallback: true,
    });

    return { ...fallbackResult, isFallback: true, provider: "fallback" };
  }
};

/**
 * AI Provider Status Check
 */
exports.getStatus = () => {
  return aiProvider.getProviderStatus();
};
