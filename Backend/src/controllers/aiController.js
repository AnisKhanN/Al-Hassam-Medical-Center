const aiService = require("../services/aiService");
const AiAuditLog = require("../models/AiAuditLog");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

/**
 * @route   POST /api/ai/visit-summary
 * @access  Private (Admin, Doctor, Receptionist)
 */
exports.generateVisitSummary = catchAsync(async (req, res, next) => {
  const {
    patientId,
    appointmentId,
    clinicalNotes,
    vitals,
    medications,
    nextFollowUp,
    language,
  } = req.body;

  if (!patientId && !appointmentId) {
    return next(
      new AppError("Either patientId or appointmentId must be provided.", 400),
    );
  }

  const result = await aiService.generateVisitSummary({
    patientId,
    appointmentId,
    clinicalNotes,
    vitals,
    medications,
    nextFollowUp,
    language,
    user: req.user,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @route   GET /api/ai/daily-report
 * @access  Private (Admin, Doctor, Receptionist, Pharmacist)
 */
exports.generateDailyReport = catchAsync(async (req, res, next) => {
  const { date } = req.query;

  const result = await aiService.generateDailyReport({
    date: date ? new Date(date) : new Date(),
    user: req.user,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @route   GET /api/ai/inventory-insights
 * @access  Private (Admin, Pharmacist)
 */
exports.getInventoryInsights = catchAsync(async (req, res, next) => {
  const result = await aiService.getInventoryInsights({
    user: req.user,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @route   GET /api/ai/sales-analysis
 * @access  Private (Admin)
 */
exports.getSalesAnalysis = catchAsync(async (req, res, next) => {
  const { timeframe } = req.query;

  const result = await aiService.getSalesAnalysis({
    timeframe: timeframe || "30d",
    user: req.user,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @route   POST /api/ai/query
 * @access  Private (All Roles)
 */
exports.executeNaturalLanguageQuery = catchAsync(async (req, res, next) => {
  const { query } = req.body;

  if (!query || typeof query !== "string" || !query.trim()) {
    return next(new AppError("Please provide a valid query string.", 400));
  }

  const result = await aiService.executeNaturalLanguageQuery({
    query: query.trim(),
    user: req.user,
    userRole: req.user?.role || "Staff",
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @route   GET /api/ai/recommendations
 * @access  Private (Admin)
 */
exports.getAdministrativeRecommendations = catchAsync(
  async (req, res, next) => {
    const result = await aiService.getAdministrativeRecommendations({
      user: req.user,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  },
);

/**
 * @route   POST /api/ai/parse-text
 * @access  Private (Admin, Doctor, Pharmacist)
 */
exports.parsePrescriptionText = catchAsync(async (req, res, next) => {
  const { rawText } = req.body;

  if (!rawText || typeof rawText !== "string" || !rawText.trim()) {
    return next(new AppError("Please provide text to parse.", 400));
  }

  const result = await aiService.parsePrescriptionText({
    rawText: rawText.trim(),
    user: req.user,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @route   GET /api/ai/status
 * @access  Private (All Roles)
 */
exports.getStatus = catchAsync(async (req, res, next) => {
  const status = aiService.getStatus();
  res.status(200).json({
    success: true,
    data: status,
  });
});

/**
 * @route   GET /api/ai/audit-logs
 * @access  Private (Admin)
 */
exports.getAuditLogs = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = { clinicId: req.user.clinicId };

  const [logs, total] = await Promise.all([
    AiAuditLog.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    AiAuditLog.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: logs,
  });
});
