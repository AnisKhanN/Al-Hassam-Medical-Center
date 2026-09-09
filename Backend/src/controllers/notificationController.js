const notificationService = require("../services/notificationService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

/**
 * @route   POST /api/notifications/send-whatsapp
 * @access  Private (All Roles)
 */
exports.sendWhatsAppNotification = catchAsync(async (req, res, next) => {
  const { phone, type, data, customMessage } = req.body;

  if (!phone && (!data || !data.phone)) {
    return next(new AppError("Recipient phone number is required.", 400));
  }

  const result = await notificationService.sendWhatsApp({
    phone,
    type,
    data,
    customMessage,
    user: req.user,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @route   POST /api/notifications/send-sms
 * @access  Private (All Roles)
 */
exports.sendSmsNotification = catchAsync(async (req, res, next) => {
  const { phone, message, type } = req.body;

  if (!phone || !message) {
    return next(
      new AppError("Phone number and message text are required.", 400),
    );
  }

  const result = await notificationService.sendSms({
    phone,
    message,
    type,
    user: req.user,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @route   GET /api/notifications/logs
 * @access  Private (Admin, Doctor, Receptionist)
 */
exports.getNotificationLogs = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const logs = notificationService.getLogs(limit);

  res.status(200).json({
    success: true,
    count: logs.length,
    data: logs,
  });
});
