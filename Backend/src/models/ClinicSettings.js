const mongoose = require("mongoose");

// Deliberately no logo/file upload here — the project's upload middleware
// already has an unrelated dead-code issue (flagged separately, left alone
// per instructions), and a clinic name/address/contact form doesn't need it.
const clinicSettingsSchema = new mongoose.Schema(
  {
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
      unique: true,
      index: true,
    },
    clinicName: {
      type: String,
      required: [true, "Clinic name is required"],
      trim: true,
      default: "Smart Clinic",
    },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    clinicLogo: {
      type: String,
      trim: true,
    },
    coverPhoto: {
      type: String,
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
    },
    about: {
      type: String,
      trim: true,
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    defaultConsultationFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentMethods: {
      type: [String],
      default: [],
    },
    operatingHours: {
      type: Array,
      default: [],
    },
    emergencyContact: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
      lowercase: true,
    },
    socialLinks: {
      type: Object,
      default: {},
    },
    logoUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    coverPhotoUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ClinicSettings", clinicSettingsSchema);
