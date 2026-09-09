const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.protect = catchAsync(async (req, res, next) => {
  // Explicit Bearer header first (API clients/Postman/mobile), fall back to cookie (browser SPA session)
  const token =
    (req.headers.authorization?.startsWith("Bearer") &&
      req.headers.authorization.split(" ")[1]) ||
    req.cookies?.token;

  if (!token)
    return next(new AppError("Not authenticated. Please log in.", 401));

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(
      new AppError("Invalid or expired session. Please log in again.", 401),
    );
  }

  const user = await User.findById(decoded.id).select("-password");
  if (!user)
    return next(
      new AppError("User belonging to this token no longer exists.", 401),
    );
  if (!user.isActive)
    return next(new AppError("This account has been deactivated.", 403));

  if (user.clinicStatus === "suspended" || user.clinicStatus === "inactive") {
    return next(
      new AppError(
        "Your clinic account has been suspended or deactivated. Please contact platform support.",
        403,
      ),
    );
  }

  req.user = user;
  req.clinicId = user.clinicId;
  next();
});

exports.authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Role '${req.user.role}' is not permitted to perform this action.`,
          403,
        ),
      );
    }
    next();
  };

exports.optionalAuth = catchAsync(async (req, res, next) => {
  const token =
    (req.headers.authorization?.startsWith("Bearer") &&
      req.headers.authorization.split(" ")[1]) ||
    req.cookies?.token;

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (user && user.isActive && user.clinicStatus !== "suspended") {
      req.user = user;
      req.clinicId = user.clinicId;
    }
  } catch (err) {
    // Invalid/expired token — proceed as unauthenticated participant
  }
  next();
});
