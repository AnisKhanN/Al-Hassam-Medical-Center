const mongoose = require("mongoose");

// Deliberately no logo/file upload here — the project's upload middleware
// already has an unrelated dead-code issue (flagged separately, left alone
// per instructions), and a clinic name/address/contact form doesn't need it.
const clinicSettingsSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true },
);

module.exports = mongoose.model("ClinicSettings", clinicSettingsSchema);
