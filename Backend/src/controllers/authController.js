const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "1d",
  });

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000, // 1 day, keep in sync with JWT_EXPIRE
};

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Email and password are required", 400));

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError("Invalid email or password", 401));
  }
  if (!user.isActive)
    return next(new AppError("This account has been deactivated.", 403));

  const token = signToken(user._id);
  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    token,
    data: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// @desc    Get currently logged-in user (used by frontend on app load)
// @route   GET /api/auth/me
// @access  Private
exports.getMe = catchAsync(async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private
exports.logout = catchAsync(async (req, res) => {
  res.cookie("token", "loggedout", { ...cookieOptions, maxAge: 1000 });
  res.status(200).json({ success: true, message: "Logged out" });
});

/**
Flow of /auth/me
   ↓
protect middleware
   ↓
read token from cookie
   ↓
jwt.verify()
   ↓
find User
   ↓
check isActive
   ↓
req.user (attached) by protect middleware
   ↓
getMe() returns req.user
That's exactly how your authentication architecture is designed. 
 */
