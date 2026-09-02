const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deactivateSupplier,
} = require("../controllers/supplierController");

router.use(protect, authorize("Admin", "Pharmacist"));

router.route("/").get(getSuppliers).post(createSupplier);
router
  .route("/:id")
  .get(getSupplierById)
  .put(updateSupplier)
  .delete(authorize("Admin"), deactivateSupplier);

module.exports = router;
