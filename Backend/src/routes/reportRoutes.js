const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  getRevenueReport,
  getAppointmentReport,
  getPatientReport,
  getPharmacyReport,
  getInventoryReport,
  getDocumentationReport,
} = require("../controllers/reportController");

// Public documentation & report download endpoint (accessible to all devices & visitors)
router.get("/docs/:type", getDocumentationReport);

router.use(protect);

router.get("/revenue", authorize("Admin", "Receptionist"), getRevenueReport);
router.get(
  "/appointments",
  authorize("Admin", "Doctor", "Receptionist"),
  getAppointmentReport,
);
router.get(
  "/patients",
  authorize("Admin", "Doctor", "Receptionist"),
  getPatientReport,
);
router.get("/pharmacy", authorize("Admin", "Pharmacist"), getPharmacyReport);
router.get("/inventory", authorize("Admin", "Pharmacist"), getInventoryReport);

module.exports = router;
