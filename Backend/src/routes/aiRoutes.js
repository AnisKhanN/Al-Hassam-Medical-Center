const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const aiController = require("../controllers/aiController");

// All AI routes require authentication
router.use(protect);

// Status check (all authenticated users)
router.get("/status", aiController.getStatus);

// 1. Patient Visit Summary (Admin, Doctor, Receptionist)
router.post(
  "/visit-summary",
  authorize("Admin", "Doctor", "Receptionist"),
  aiController.generateVisitSummary,
);

// 2. Daily Report Generator (Admin, Doctor, Receptionist, Pharmacist)
router.get(
  "/daily-report",
  authorize("Admin", "Doctor", "Receptionist", "Pharmacist"),
  aiController.generateDailyReport,
);

// 3. Inventory Insights (Admin, Pharmacist)
router.get(
  "/inventory-insights",
  authorize("Admin", "Pharmacist"),
  aiController.getInventoryInsights,
);

// 4. Sales & Financial Analysis (Admin only)
router.get(
  "/sales-analysis",
  authorize("Admin"),
  aiController.getSalesAnalysis,
);

// 5. Natural Language Query (All authenticated staff, scoped internally by role)
router.post("/query", aiController.executeNaturalLanguageQuery);

// 6. Administrative Recommendations (Admin only)
router.get(
  "/recommendations",
  authorize("Admin"),
  aiController.getAdministrativeRecommendations,
);

// 7. Prescription / Invoice Text Parser (Admin, Doctor, Pharmacist)
router.post(
  "/parse-text",
  authorize("Admin", "Doctor", "Pharmacist"),
  aiController.parsePrescriptionText,
);

// 8. AI Audit Logs (Admin only)
router.get("/audit-logs", authorize("Admin"), aiController.getAuditLogs);

module.exports = router;
