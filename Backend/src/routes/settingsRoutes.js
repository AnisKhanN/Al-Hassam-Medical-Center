const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  getClinicSettings,
  updateClinicSettings,
  changePassword,
} = require("../controllers/settingsController");

router.use(protect);

router.get("/clinic", getClinicSettings);
router.put("/clinic", authorize("Admin"), updateClinicSettings);
router.put("/change-password", changePassword);

module.exports = router;
