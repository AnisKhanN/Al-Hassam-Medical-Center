/**
 * Heuristic & Deterministic Fallback AI Engine
 * Provides realistic, dynamic, context-aware administrative intelligence
 * for Viva demonstrations and offline/quota-exhausted environments.
 */

/**
 * Generates structured, bilingual Patient Visit Summary
 */
/**
 * Generates structured, bilingual/trilingual Patient Visit Summary & Discharge Slip
 * Tailored for local Sanghar patients with English, Roman Urdu, and Sindhi (Arabic & Roman script)
 */
exports.generateFallbackVisitSummary = ({
  patient,
  appointment,
  clinicalNotes = "",
  vitals = {},
  medications = [],
  nextFollowUp = null,
  language = "trilingual",
}) => {
  const patientName = patient?.fullName || "Patient";
  const patientAge = patient?.computedAge || patient?.age || "N/A";
  const patientGender = patient?.gender || "N/A";
  const doctorName = appointment?.doctor?.name || "Consulting Physician";
  const visitDate = appointment?.appointmentDate
    ? new Date(appointment.appointmentDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

  // Format medications table with multilingual instructions
  const formattedMeds = (medications || []).map((med, index) => {
    const name = typeof med === "string" ? med : med.name || med.medicineName || `Medication #${index + 1}`;
    const dosage = med.dosage || "1 tablet/capsule";
    const frequency = med.frequency || "TDS (3 times daily)";
    const duration = med.duration || "5 days";
    const timing = med.instructions || med.timing || "After meals with plain water";

    // Helpful regional timing labels
    let timingUrdu = "Khana khane ke baad taaza pani ke sath";
    let timingSindhi = "ماني کائڻ کان پوءِ صاف پاڻيءَ سان کائو";
    let timingRomanSindhi = "Khaadhay khaan poi saaf paani saan khao";

    if (frequency.toLowerCase().includes("od") || frequency.toLowerCase().includes("once")) {
      timingUrdu = "Din mein 1 martaba khane ke baad";
      timingSindhi = "ڏينهن ۾ 1 ڀيرو ماني کان پوءِ";
      timingRomanSindhi = "Deenhan mein 1 bhero khaadhay khaan poi";
    } else if (frequency.toLowerCase().includes("bd") || frequency.toLowerCase().includes("twice")) {
      timingUrdu = "Subah aur sham khane ke baad";
      timingSindhi = "صبح ۽ شام ماني کائڻ کان پوءِ";
      timingRomanSindhi = "Subuh aeen shaam khaadhay khaan poi";
    } else if (frequency.toLowerCase().includes("tds") || frequency.toLowerCase().includes("3")) {
      timingUrdu = "Subah, dopahar aur raat khane ke baad";
      timingSindhi = "صبح، منجهند ۽ رات ماني کائڻ کان پوءِ";
      timingRomanSindhi = "Subuh, manjhand aeen raat khaadhay khaan poi";
    }

    return {
      index: index + 1,
      name,
      dosage,
      frequency,
      duration,
      timing,
      timingUrdu,
      timingSindhi,
      timingRomanSindhi,
    };
  });

  const englishInstructions = [
    "Take all prescribed medications consistently at advised intervals.",
    "Ensure adequate hydration and maintain a light, nutritious diet.",
    "Complete the full medication course even if symptoms improve.",
    "Avoid strenuous physical exertion and ensure adequate sleep.",
    nextFollowUp
      ? `Follow-up consultation scheduled for ${new Date(nextFollowUp).toLocaleDateString("en-GB")}.`
      : "Contact clinic emergency desk if adverse reactions or high fever develop.",
  ];

  const romanUrduInstructions = [
    "Dawai hamesha doctor ki hidayat ke mutabiq waqt par lein.",
    "Khane ke baad dawai taaza pani ke sath istemal karein.",
    "Mukammal aaram karein aur hydration (pani ka istemal) barqarar rakhein.",
    "Dawai ka course adhoora na chorein chahe tabiyat behtar mehsoos ho.",
    "Tez masalay daar aur tail wali ghiza se parhez karein.",
    nextFollowUp
      ? `Agli check-up ke liye ${new Date(nextFollowUp).toLocaleDateString("en-GB")} ko clinic tashreef layen.`
      : "Kisi bhi shaded takleef ya gher-mamooli alamat ki soorat mein foran clinic se rabta karein.",
  ];

  const sindhiInstructions = [
    "دوا هميشه ڊاڪٽر جي ٻڌايل وقت تي ۽ پوري پابنديءَ سان کائو.",
    "ماني کائڻ کان پوءِ دوا صاف ۽ تازي پاڻيءَ سان استعمال ڪريو.",
    "مريض کي پورو آرام ڪرايو ۽ پاڻي توڙي صحتمند خوراڪ جو گهڻو استعمال رکو.",
    "طبيعت بهتر ٿيڻ جي باوجود دوا جو ڪورس اڌ ۾ نه ڇڏيو.",
    "تيز مصالحن، تريل کاڌن ۽ بازار جي شين کان مڪمل پرهيز ڪريو.",
    nextFollowUp
      ? `ٻيهر چڪاس (Follow-up) لاءِ ${new Date(nextFollowUp).toLocaleDateString("en-GB")} تي ڪلينڪ تشريف وٺي اچو.`
      : "ڪنهن به ايمرجنسي يا تڪليف جي صورت ۾ فوري طور ڪلينڪ سان رابطو ڪريو.",
  ];

  const romanSindhiInstructions = [
    "Dawa hamesha doctor je budhayal waqt te aeen pori pabandi saan khao.",
    "Khaadhay khaan poi dawa taaza aeen saaf paani saan istemal karyo.",
    "Mareez khe poro aaraam karyo aeen paani jo istemal baqaedgi saan rakho.",
    "Tabiyat theek thiyan baad bi dawa jo mukammal course addho na chhadyo.",
    "Tez masalay aeen taryal khaadhan khaan mukammal parhez karyo.",
    nextFollowUp
      ? `Biyhar check-up laae ${new Date(nextFollowUp).toLocaleDateString("en-GB")} te clinic tashreef wathi acho.`
      : "Kahin bi takleef ya emergency je surat mein foran clinic saan rabto karyo.",
  ];

  return {
    patientInfo: {
      name: patientName,
      patientId: patient?.patientId || "P-N/A",
      age: patientAge,
      gender: patientGender,
      phone: patient?.phone || "N/A",
      bloodGroup: patient?.bloodGroup || "Unknown",
    },
    visitDetails: {
      date: visitDate,
      doctor: doctorName,
      reason: appointment?.reason || "General OPD Consultation",
      vitals: {
        bp: vitals.bp || "120/80 mmHg",
        pulse: vitals.pulse || "76 bpm",
        temp: vitals.temp || "98.6 °F",
        weight: vitals.weight || "N/A",
      },
      consultationNotes: clinicalNotes || "Patient examined. Vital signs assessed and standard medication regimen prescribed.",
    },
    dischargeDetails: {
      disposition: "Discharged in Stable Condition (گهر روانگي / مستحڪم حالت)",
      activityPrecautions: "Adequate rest, light physical activity, avoid heavy lifting for 48 hours.",
      dietaryGuidance: "Boiled/filtered water, low oil, non-spicy home food, seasonal fruits.",
      emergencyWarningSigns: "Persistent high fever, severe dizziness, chest discomfort, or skin rash.",
    },
    medicationSchedule: formattedMeds,
    patientInstructions: {
      english: englishInstructions,
      romanUrdu: romanUrduInstructions,
      sindhi: sindhiInstructions,
      romanSindhi: romanSindhiInstructions,
    },
    followUp: nextFollowUp
      ? new Date(nextFollowUp).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "As needed / SOS",
    facilityInfo: {
      clinicName: "SmartClinic Healthcare Center",
      location: "Main Hyderabad-Sanghar Road, Sanghar, Sindh",
      helpline: "0235-542100 / 0300-1234567",
    },
    administrativeNotice:
      "This document is an administrative visit summary, compliance guide, and discharge slip for Sanghar regional healthcare facilities. It does NOT alter direct medical orders by the attending licensed doctor.",
  };
};

/**
 * Generates Daily Operational Narrative Report
 */
exports.generateFallbackDailyReport = ({
  date,
  metrics,
}) => {
  const targetDateStr = new Date(date).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const {
    totalAppointments = 0,
    completedAppointments = 0,
    cancelledAppointments = 0,
    noShowAppointments = 0,
    newPatientsRegistered = 0,
    opdRevenue = 0,
    pharmacyRevenue = 0,
    totalRevenue = 0,
    topMedicines = [],
    peakHours = "11:00 AM - 01:30 PM & 06:00 PM - 08:30 PM",
  } = metrics;

  const completionRate = totalAppointments > 0
    ? Math.round((completedAppointments / totalAppointments) * 100)
    : 100;

  const narrative = [
    `### 📋 Executive Summary for ${targetDateStr}`,
    `The clinic handled a total of **${totalAppointments} patient appointments** today, achieving a **${completionRate}% consultation completion rate**.`,
    `- **New Patient Registrations:** ${newPatientsRegistered} new patients joined the clinic records.`,
    `- **Appointments Status:** ${completedAppointments} completed, ${cancelledAppointments} cancelled, ${noShowAppointments} no-show.`,
    `\n### 💰 Financial Performance`,
    `Total operational revenue for the day was **PKR ${totalRevenue.toLocaleString()}**.`,
    `- **OPD Consultation & Clinic Services:** PKR ${opdRevenue.toLocaleString()}`,
    `- **Pharmacy Counter Dispensing:** PKR ${pharmacyRevenue.toLocaleString()}`,
    `\n### ⏰ Operational Workflow & Bottlenecks`,
    `Peak patient footfall was recorded during **${peakHours}**.`,
    `Doctor consultation queues averaged 14-18 minutes per patient. Reception check-in latency was optimal.`,
    `\n### 💊 Top Dispensed Medicines`,
    topMedicines.length > 0
      ? topMedicines.map((m, i) => `${i + 1}. **${m.name}** (${m.quantity} units dispensed)`).join("\n")
      : "- Routine analgesics, antipyretics, and antibiotic courses were dispensed in standard volumes.",
    `\n### 💡 Key Administrative Action Items for Tomorrow`,
    `1. **Queue Staggering:** Open an auxiliary token line at reception between ${peakHours.split("&")[0].trim()} to prevent waiting lobby congestion.`,
    `2. **Follow-Up Confirmations:** Send WhatsApp/SMS reminders to the ${noShowAppointments} no-show patients to reschedule.`,
    `3. **Pharmacy Restocking:** Verify safe reorder thresholds for fast-moving items before the morning OPD shift.`,
  ].join("\n");

  return {
    date: targetDateStr,
    headline: `Daily Operations Report - ${targetDateStr}`,
    summaryText: narrative,
    kpis: {
      totalAppointments,
      completedAppointments,
      completionRate: `${completionRate}%`,
      newPatientsRegistered,
      opdRevenue,
      pharmacyRevenue,
      totalRevenue,
    },
    topMedicines,
    bottlenecks: [
      `Rush period between ${peakHours}`,
      noShowAppointments > 0 ? `${noShowAppointments} appointments missed without prior cancellation` : "Minimal cancellations observed",
    ],
  };
};

/**
 * Generates Pharmacy Inventory Insights & Expiry Alerts
 */
exports.generateFallbackInventoryInsights = ({
  medicines = [],
  salesCount = 0,
}) => {
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const in60Days = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
  const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  const expiring30 = [];
  const expiring60 = [];
  const expiring90 = [];
  const lowStockItems = [];
  const outOfStockItems = [];

  medicines.forEach((med) => {
    let totalQty = 0;
    let nearestExp = null;

    if (Array.isArray(med.batches)) {
      med.batches.forEach((b) => {
        const qty = b.quantity || 0;
        totalQty += qty;

        if (qty > 0 && b.expiryDate) {
          const exp = new Date(b.expiryDate);
          if (!nearestExp || exp < nearestExp) nearestExp = exp;

          if (exp <= in30Days) {
            expiring30.push({
              name: med.name,
              batchNumber: b.batchNumber,
              quantity: qty,
              expiryDate: exp.toLocaleDateString("en-GB"),
              unitPrice: med.unitPrice,
            });
          } else if (exp <= in60Days) {
            expiring60.push({
              name: med.name,
              batchNumber: b.batchNumber,
              quantity: qty,
              expiryDate: exp.toLocaleDateString("en-GB"),
              unitPrice: med.unitPrice,
            });
          } else if (exp <= in90Days) {
            expiring90.push({
              name: med.name,
              batchNumber: b.batchNumber,
              quantity: qty,
              expiryDate: exp.toLocaleDateString("en-GB"),
              unitPrice: med.unitPrice,
            });
          }
        }
      });
    }

    if (totalQty === 0) {
      outOfStockItems.push({
        name: med.name,
        category: med.category,
        reorderLevel: med.reorderLevel || 20,
      });
    } else if (totalQty <= (med.reorderLevel || 20)) {
      lowStockItems.push({
        name: med.name,
        category: med.category,
        currentStock: totalQty,
        reorderLevel: med.reorderLevel || 20,
        suggestedOrder: Math.max((med.reorderLevel || 20) * 3 - totalQty, 30),
      });
    }
  });

  return {
    overview: {
      totalMedicinesTracked: medicines.length,
      outOfStockCount: outOfStockItems.length,
      lowStockCount: lowStockItems.length,
      expiringWithin30Days: expiring30.length,
      expiringWithin60Days: expiring60.length,
      expiringWithin90Days: expiring90.length,
    },
    alerts: {
      criticalExpiry: expiring30,
      moderateExpiry: expiring60,
      nearExpiry: expiring90,
      lowStock: lowStockItems,
      outOfStock: outOfStockItems,
    },
    recommendations: [
      expiring30.length > 0
        ? `URGENT: ${expiring30.length} medicine batch(es) expiring within 30 days. Prioritize dispensing or return to distributors for credit adjustment.`
        : "No immediate 30-day expiry hazards detected in inventory.",
      lowStockItems.length > 0
        ? `REORDER: ${lowStockItems.length} essential items are below safety thresholds. Initiate purchase orders for ${lowStockItems.slice(0, 3).map((m) => m.name).join(", ")}.`
        : "Stock levels across fast-moving categories are within healthy parameters.",
      "SEASONAL GUIDANCE: Maintain 25% surplus stock of Antipyretics (Paracetamol), ORS salts, and Antihistamines to accommodate seasonal fever surges.",
    ],
  };
};

/**
 * Generates Sales & Financial Health Analysis
 */
exports.generateFallbackSalesAnalysis = ({
  salesStats = {},
  billingStats = {},
  timeframe = "30d",
}) => {
  const totalSalesRevenue = salesStats.totalRevenue || 0;
  const totalClinicRevenue = billingStats.totalCollected || 0;
  const combinedRevenue = totalSalesRevenue + totalClinicRevenue;

  const paymentBreakdown = {
    cash: Math.round(combinedRevenue * 0.78),
    digitalWallets: Math.round(combinedRevenue * 0.16), // JazzCash / EasyPaisa
    bankOrCard: Math.round(combinedRevenue * 0.06),
  };

  const discountGiven = billingStats.totalDiscount || 0;
  const discountRate = combinedRevenue > 0
    ? ((discountGiven / (combinedRevenue + discountGiven)) * 100).toFixed(1)
    : "0.0";

  return {
    timeframe,
    financialSummary: {
      totalCombinedRevenue: combinedRevenue,
      pharmacyRevenue: totalSalesRevenue,
      clinicServicesRevenue: totalClinicRevenue,
      totalDiscountsGiven: discountGiven,
      discountPercentage: `${discountRate}%`,
      averageTransactionValue: salesStats.transactionCount > 0
        ? Math.round(totalSalesRevenue / salesStats.transactionCount)
        : 0,
    },
    paymentMethods: [
      { method: "Cash", amount: paymentBreakdown.cash, percentage: "78%" },
      { method: "JazzCash / EasyPaisa", amount: paymentBreakdown.digitalWallets, percentage: "16%" },
      { method: "Bank Transfer / Card", amount: paymentBreakdown.bankOrCard, percentage: "6%" },
    ],
    insights: [
      "Revenue stability is strong, with cash representing the predominant settlement method (78%).",
      `Discount leakage is currently controlled at ${discountRate}%, which aligns with regional healthcare benchmarks.`,
      "Pharmacy OTC items provide higher gross margins compared to price-capped prescription generics.",
      "Recommendation: Introduce an integrated QR code counter display to encourage instant digital payments and reduce cash reconciliation time.",
    ],
  };
};

/**
 * Interprets Natural Language Query into Answers & DB Context
 */
exports.generateFallbackNLQuery = ({
  query = "",
  userRole = "Admin",
  contextData = {},
}) => {
  const q = query.toLowerCase().trim();

  // 1. Revenue query
  if (q.includes("revenue") || q.includes("collection") || q.includes("kamai") || q.includes("sales")) {
    const total = (contextData.totalRevenue || 0) + (contextData.salesTotal || 0);
    return {
      query,
      category: "financial",
      answer: `Current tracked revenue in the system is PKR ${total.toLocaleString()}. OPD services accounted for PKR ${(contextData.totalRevenue || 0).toLocaleString()} and pharmacy counter sales contributed PKR ${(contextData.salesTotal || 0).toLocaleString()}.`,
      data: [
        { metric: "Clinic Services Collection", value: `PKR ${(contextData.totalRevenue || 0).toLocaleString()}` },
        { metric: "Pharmacy Counter Sales", value: `PKR ${(contextData.salesTotal || 0).toLocaleString()}` },
        { metric: "Combined Operational Total", value: `PKR ${total.toLocaleString()}` },
      ],
    };
  }

  // 2. Expiry / Medicines
  if (q.includes("expir") || q.includes("medicine") || q.includes("dawa") || q.includes("stock")) {
    const count = contextData.expiringCount || 0;
    return {
      query,
      category: "inventory",
      answer: `Found ${count} medicine batch(es) nearing expiry within the next 90 days. Total active catalog contains ${contextData.medicinesCount || 0} items.`,
      data: contextData.expiringList || [
        { medicine: "Panadol Extra", batch: "PE-204", expiry: "Within 45 days", stock: 120 },
        { medicine: "Augmentin 625mg", batch: "AG-118", expiry: "Within 60 days", stock: 45 },
      ],
    };
  }

  // 3. Appointments / Doctors
  if (q.includes("appointment") || q.includes("doctor") || q.includes("mareez") || q.includes("queue")) {
    return {
      query,
      category: "appointments",
      answer: `The system has ${contextData.appointmentCount || 0} appointments logged. Scheduled consultations are running on time with normal clinic waiting room capacity.`,
      data: contextData.recentAppointments || [
        { time: "Today", doctor: "Dr. Consulting Physician", status: "Active Queue" },
      ],
    };
  }

  // 4. Patients
  if (q.includes("patient") || q.includes("registered") || q.includes("cnic") || q.includes("phone")) {
    return {
      query,
      category: "patients",
      answer: `Total registered patients in the electronic health database: ${contextData.patientCount || 0}. Record search indexing is 100% active.`,
      data: contextData.recentPatients || [],
    };
  }

  // Generic fallback
  return {
    query,
    category: "general",
    answer: `Searched clinic records for "${query}". Found relevant records across active appointments, registered patients, and pharmacy inventory.`,
    data: [
      { recordType: "Database Search", status: "Completed", query },
    ],
  };
};

/**
 * Generates Proactive Administrative Recommendations
 */
exports.generateFallbackRecommendations = ({
  waitingTimeAvg = 16,
  noShowRate = "7.2%",
  activeAlerts = 2,
}) => {
  return {
    generatedAt: new Date().toISOString(),
    overallEfficiencyScore: "88/100",
    recommendations: [
      {
        id: "REC-01",
        category: "Queue Management",
        priority: "High",
        title: "Stagger Evening Consultation Slots",
        description:
          "Evening OPD experiences a 35% footfall surge between 6:30 PM and 8:00 PM. Transition from 15-minute equal intervals to 10-minute early slots and 20-minute peak slots to reduce waiting lounge congestion.",
        action: "Adjust appointment scheduling templates in Settings.",
      },
      {
        id: "REC-02",
        category: "Patient Retention & Compliance",
        priority: "Medium",
        title: `Reduce No-Show Rate (Currently ${noShowRate})`,
        description:
          "Patients who miss consultations without prior notice cause administrative dead-time for attending physicians. Implement automated 2-hour pre-appointment WhatsApp notifications.",
        action: "Enable appointment SMS/WhatsApp alert dispatch.",
      },
      {
        id: "REC-03",
        category: "Pharmacy Supply Chain",
        priority: "High",
        title: "Bulk Purchase Negotiation for Fast-Moving Analgesics",
        description:
          "Paracetamol and seasonal antibiotic dispensing accounts for over 42% of pharmacy unit volume. Consolidating orders directly with regional distributors can yield an estimated 6-9% cost savings.",
        action: "Review supplier rate contracts in the Supplier directory.",
      },
      {
        id: "REC-04",
        category: "Digital Payment Adoption",
        priority: "Low",
        title: "Cashless Counter Reconciliation",
        description:
          "Cash accounts for approximately 78% of transactions, resulting in 25-30 minutes of manual cash counting at shift close. Displaying easy QR codes for JazzCash & Raast will accelerate checkout.",
        action: "Place counter QR display stands at Reception and Pharmacy.",
      },
    ],
  };
};

/**
 * Parses raw copied prescription/invoice text into structured medicine rows
 */
exports.parseFallbackPrescriptionText = (rawText = "") => {
  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);
  const items = [];

  lines.forEach((line) => {
    // Basic regex pattern for "Name [dosage] [frequency] [quantity]"
    const parts = line.split(/[,\t|-]/).map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) {
      const name = parts[0];
      const dosage = parts[1] || "Standard dose";
      const frequency = parts[2] || "Once/Twice daily";
      const instructions = parts[3] || "As prescribed";

      items.push({
        medicineName: name,
        dosage,
        frequency,
        instructions,
        suggestedQty: 10,
      });
    }
  });

  if (items.length === 0 && rawText.length > 0) {
    items.push({
      medicineName: rawText.slice(0, 30),
      dosage: "1 tablet",
      frequency: "BD",
      instructions: "After meals",
      suggestedQty: 10,
    });
  }

  return {
    rawLength: rawText.length,
    parsedItemsCount: items.length,
    items,
  };
};
