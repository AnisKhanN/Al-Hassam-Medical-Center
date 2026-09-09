const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboardController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// All dashboard endpoints require authentication
router.use(protect);

// GET /api/dashboard/stats
router.get(
  "/stats",
  authorize("Admin", "Doctor", "Receptionist", "Pharmacist"),
  getDashboardStats,
);

module.exports = router;
