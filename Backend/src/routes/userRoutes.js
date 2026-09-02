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
} = require("../controllers/userController");

router.use(protect);

// Needed by Receptionists to populate the doctor dropdown when booking
// appointments — intentionally placed before the Admin-only gate below.
router.get("/doctors", authorize("Admin", "Receptionist"), getDoctors);

router.use(authorize("Admin"));

router.route("/").post(uploadProfilePic, createUser).get(getUsers);

router
  .route("/:id")
  .get(getUserById)
  .put(uploadProfilePic, updateUser)
  .delete(deactivateUser);

module.exports = router;
