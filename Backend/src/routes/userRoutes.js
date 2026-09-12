const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const { uploadProfilePic } = require("../middlewares/uploadMiddleware");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deactivateUser,
  getDoctors,
  toggleDoctorDuty,
} = require("../controllers/userController");

router.use(protect);

// Needed by Admin, Receptionists, and Doctors for roster & dropdowns
router.get("/doctors", authorize("Admin", "Receptionist", "Doctor"), getDoctors);
router.patch("/:id/duty", authorize("Admin", "Doctor"), toggleDoctorDuty);

router.use(authorize("Admin"));

router.route("/").post(uploadProfilePic, createUser).get(getUsers);

router
  .route("/:id")
  .get(getUserById)
  .put(uploadProfilePic, updateUser)
  .delete(deactivateUser);

module.exports = router;
