// User controllers with profile picture uploads
const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const ALLOWED_ROLES = ["Admin", "Doctor", "Receptionist", "Pharmacist"];

// @desc    Admin creates a staff account
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return next(
      new AppError("Name, email, password, and role are required", 400),
    );
  }

  if (!ALLOWED_ROLES.includes(role)) {
    return next(
      new AppError(`Role must be one of: ${ALLOWED_ROLES.join(", ")}`, 400),
    );
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return next(new AppError("A user with this email already exists", 409));
  }

  const profilePic = req.file
    ? `/uploads/profile/${req.file.filename}`
    : undefined;

  // password hashing happens in User model's pre('save') hook
  const user = await User.create({
    name,
    email,
    password,
    role,
    ...(profilePic && { profilePic }),
  });

  res.status(201).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
      isActive: user.isActive,
    },
  });
});

// @desc    List all staff accounts (optionally filter by role)
// @route   GET /api/users?role=Doctor
// @access  Private/Admin
exports.getUsers = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;

  const users = await User.find(filter).select("-password").sort("-createdAt");
  res.status(200).json({ success: true, count: users.length, data: users });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return next(new AppError("User not found", 404));
  res.status(200).json({ success: true, data: user });
});

// @desc    Update a staff account (name, role, active status — not password)
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = catchAsync(async (req, res, next) => {
  const { name, role, isActive } = req.body;

  if (role && !ALLOWED_ROLES.includes(role)) {
    return next(
      new AppError(`Role must be one of: ${ALLOWED_ROLES.join(", ")}`, 400),
    );
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (role) updateData.role = role;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (req.file) updateData.profilePic = `/uploads/profile/${req.file.filename}`;

  const user = await User.findByIdAndUpdate(req.params.id, updateData, {
    returnDocument: "after",
    runValidators: true,
  }).select("-password");

  if (!user) return next(new AppError("User not found", 404));
  res.status(200).json({ success: true, data: user });
});

// @desc    Deactivate a staff account (soft delete — never hard-delete medical-adjacent audit trails)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deactivateUser = catchAsync(async (req, res, next) => {
  if (req.params.id === req.user.id) {
    return next(new AppError("You cannot deactivate your own account", 400));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { returnDocument: "after" },
  ).select("-password");
  if (!user) return next(new AppError("User not found", 404));

  res
    .status(200)
    .json({ success: true, message: "User deactivated", data: user });
});

// @desc    Lightweight doctor list for dropdowns (e.g. booking appointments)
// @route   GET /api/users/doctors
// @access  Private/Admin,Receptionist
exports.getDoctors = catchAsync(async (req, res) => {
  const doctors = await User.find({ role: "Doctor", isActive: true })
    .select("name email")
    .sort("name");
  res.status(200).json({ success: true, data: doctors });
});
