const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  login,
  registerClinic,
  getMe,
  getCurrentClinic,
  logout,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/register", registerClinic);
router.post("/register-clinic", registerClinic);
router.get("/me", protect, getMe);
router.get("/clinic", protect, getCurrentClinic);
router.post("/logout", protect, logout);

module.exports = router;
