const express = require("express");
const router = express.Router();
const { protect, authorize, optionalAuth } = require("../middlewares/authMiddleware");
const telemedicineController = require("../controllers/telemedicineController");

// Staff-only actions
router.post(
  "/create-room",
  protect,
  authorize("Admin", "Doctor", "Receptionist"),
  telemedicineController.createRoom,
);
router.post(
  "/room/:roomId/end",
  protect,
  authorize("Admin", "Doctor"),
  telemedicineController.endConsultation,
);

// Open to consultation participants (Doctor and Patient with room link)
router.get("/room/:roomId", optionalAuth, telemedicineController.getRoom);
router.get("/room/:roomId/events", optionalAuth, telemedicineController.roomEvents);
router.post("/room/:roomId/signal", optionalAuth, telemedicineController.sendSignal);

module.exports = router;
