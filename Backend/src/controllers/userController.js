// User controllers with profile picture uploads
const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const ALLOWED_ROLES = ["Admin", "Doctor", "Receptionist", "Pharmacist"];
const CREATABLE_ROLES = ["Doctor", "Receptionist", "Pharmacist"];

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

  // Prevent accidental creation of Admin accounts via staff creation endpoint
  if (!CREATABLE_ROLES.includes(role)) {
    return next(
      new AppError(
        `Staff role must be one of: ${CREATABLE_ROLES.join(", ")}`,
        400,
      ),
    );
  }

  const existing = await User.findOne({ email: String(email).trim().toLowerCase() });
  if (existing) {
    return next(new AppError("A user with this email already exists", 409));
  }

  const profilePic = req.file
    ? `/uploads/profile/${req.file.filename}`
    : undefined;

  if (!req.user?.clinicId) {
    return next(
      new AppError("Admin must be associated with an active clinic to create staff", 403),
    );
  }

  // Password hashing happens in User model pre('save') hook
  // Inherit clinic identity from the creating Admin
  const user = await User.create({
    name,
    email: String(email).trim().toLowerCase(),
    password,
    role,
    clinicId: req.user.clinicId,
    clinicName: req.user.clinicName || "SmartClinic",
    clinicDomain: req.user.clinicDomain || undefined,
    clinicStatus: req.user.clinicStatus || "active",
    ...(profilePic && { profilePic }),
  });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic || "",
      clinicId: user.clinicId,
      clinicName: user.clinicName,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  });
});

// @desc    List all staff accounts (optionally filter by role and paginate)
// @route   GET /api/users?role=Doctor&page=1&limit=20
// @access  Private/Admin
exports.getUsers = catchAsync(async (req, res) => {
  const filter = { clinicId: req.user.clinicId };
  if (req.query.role) filter.role = req.query.role;

  const hasPagination =
    req.query.page !== undefined || req.query.limit !== undefined;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const query = User.find(filter).select("-password").sort("-createdAt");

  if (hasPagination) {
    const [users, total] = await Promise.all([
      query.skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);
    return res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users,
    });
  }

  const users = await query;
  res.status(200).json({
    success: true,
    count: users.length,
    total: users.length,
    data: users,
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    _id: req.params.id,
    clinicId: req.user.clinicId,
  }).select("-password");
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

  const user = await User.findOneAndUpdate(
    { _id: req.params.id, clinicId: req.user.clinicId },
    updateData,
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).select("-password");

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

  const user = await User.findOneAndUpdate(
    { _id: req.params.id, clinicId: req.user.clinicId },
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
  const doctors = await User.find({
    clinicId: req.user.clinicId,
    role: "Doctor",
    isActive: true,
  })
    .select("name email")
    .sort("name");
  res.status(200).json({ success: true, data: doctors });
});
