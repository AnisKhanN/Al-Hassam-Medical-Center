const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  createSale,
  getSales,
  getSaleById,
  voidSale,
  getSalesSummary,
} = require("../controllers/saleController");

router.use(protect, authorize("Admin", "Pharmacist"));

// Declared before '/:id' so 'summary' is never mistaken for a sale ID
router.get("/summary", getSalesSummary);

router.route("/").get(getSales).post(createSale);
router.route("/:id").get(getSaleById);
router.patch("/:id/void", authorize("Admin"), voidSale);

module.exports = router;
