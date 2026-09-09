const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const notificationController = require("../controllers/notificationController");

router.use(protect, authorize("Admin", "Doctor", "Receptionist"));

router.post("/send-whatsapp", notificationController.sendWhatsAppNotification);
router.post("/send-sms", notificationController.sendSmsNotification);
router.get("/logs", notificationController.getNotificationLogs);

module.exports = router;

