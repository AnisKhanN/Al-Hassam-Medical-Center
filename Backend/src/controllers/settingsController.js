const ClinicSettings = require("../models/ClinicSettings");
const User = require("../models/User");
const Clinic = require("../models/Clinic");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const getOrCreateSettings = async (clinicId, userId) => {
  let settings = await ClinicSettings.findOne({ clinicId });
  if (!settings) {
    settings = await ClinicSettings.create({
      clinicId,
      clinicName: "SmartClinic",
      updatedBy: userId,
    });
  }
  return settings;
};

exports.getClinicSettings = catchAsync(async (req, res) => {
  const settings = await getOrCreateSettings(req.user.clinicId, req.user.id);
  res.status(200).json({ success: true, data: settings });
});

exports.updateClinicSettings = catchAsync(async (req, res, next) => {
  const {
    clinicName,
    address,
    phone,
    email,
    tagline,
    emergencyContact,
    website,
    defaultConsultationFee,
  } = req.body;
  if (!clinicName) return next(new AppError("Clinic name is required", 400));

  const settings = await getOrCreateSettings(req.user.clinicId, req.user.id);
  settings.clinicName = clinicName.trim();
  if (address !== undefined) settings.address = address;
  if (phone !== undefined) settings.phone = phone;
  if (email !== undefined) settings.email = email;
  if (tagline !== undefined) settings.tagline = tagline;
  if (emergencyContact !== undefined) settings.emergencyContact = emergencyContact;
  if (website !== undefined) settings.website = website;
  if (defaultConsultationFee !== undefined) {
    settings.defaultConsultationFee = Number(defaultConsultationFee) || 0;
  }
  settings.updatedBy = req.user.id;
  await settings.save();

  // Synchronize with primary Clinic record and User clinic tenancy names
  if (req.user.clinicId) {
    await Clinic.findByIdAndUpdate(req.user.clinicId, {
      name: settings.clinicName,
      phone: settings.phone,
      address: settings.address,
      email: settings.email,
    });
    await User.updateMany(
      { clinicId: req.user.clinicId },
      { clinicName: settings.clinicName }
    );
  }

  res.status(200).json({ success: true, data: settings });
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return next(
      new AppError("Current password and new password are required", 400),
    );
  }
  if (newPassword.length < 6) {
    return next(
      new AppError("New password must be at least 6 characters", 400),
    );
  }
  if (currentPassword === newPassword) {
    return next(
      new AppError(
        "New password must be different from the current password",
        400,
      ),
    );
  }

  const user = await User.findById(req.user.id).select("+password");
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) return next(new AppError("Current password is incorrect", 401));

  user.password = newPassword; // pre('save') hook re-hashes since isModified('password') is true
  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Password updated successfully" });
});
