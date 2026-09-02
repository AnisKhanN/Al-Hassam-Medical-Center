const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  addBatch,
  getCategories,
  getLowStock,
  getExpiringSoon,
} = require("../controllers/medicineController");

router.use(protect, authorize("Admin", "Pharmacist"));

router.get("/categories", getCategories);
router.get("/low-stock", getLowStock);
router.get("/expiring", getExpiringSoon);

router.route("/").get(getMedicines).post(createMedicine);
router
  .route("/:id")
  .get(getMedicineById)
  .put(updateMedicine)
  .delete(authorize("Admin"), deleteMedicine);
router.post("/:id/batches", addBatch);

module.exports = router;
