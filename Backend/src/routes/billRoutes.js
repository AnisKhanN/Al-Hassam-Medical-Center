const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  createBill,
  getBills,
  getBillById,
  recordPayment,
  cancelBill,
  getRevenueSummary,
} = require("../controllers/billController");

router.use(protect, authorize("Admin", "Receptionist")); // billing is front-desk/finance territory, not clinical

// Declared before '/:id' so 'revenue' is never mistaken for a bill ID
router.get("/revenue", getRevenueSummary);

router.route("/").get(getBills).post(createBill);
router.route("/:id").get(getBillById);
router.post("/:id/payments", recordPayment);
router.patch("/:id/cancel", authorize("Admin"), cancelBill); // narrows the router-level Admin+Receptionist gate to Admin only

module.exports = router;
