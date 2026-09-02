const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { login, getMe, logout } = require("../controllers/authController");

router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

module.exports = router;
