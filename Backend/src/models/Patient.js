const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    visitType: {
      type: String,
      enum: ["OPD", "Follow-up", "Emergency", "Routine Checkup"],
      default: "OPD",
    },
    reason: { type: String, required: [true, "Visit reason is required"] },
    notes: { type: String, trim: true }, // clinical notes entered by the doctor — not AI-generated
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const patientSchema = new mongoose.Schema(
  {
    patientId: { type: String, unique: true, index: true },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    guardianName: { type: String, trim: true }, // father's/husband's name — standard on local clinic forms
    cnic: {
      type: String,
      trim: true,
      sparse: true, // many patients won't have one on file yet — still unique when present
      unique: true,
      match: [/^\d{5}-\d{7}-\d{1}$/, "CNIC must be in format 12345-1234567-1"],
    },
    dateOfBirth: { type: Date },
    age: { type: Number, min: 0, max: 130 }, // fallback when DOB is unknown, which is common
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    alternatePhone: { type: String, trim: true },
    address: { type: String, trim: true },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"],
      default: "Unknown",
    },
    allergies: [{ type: String, trim: true }],
    emergencyContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      relation: { type: String, trim: true },
    },
    medicalHistory: [medicalHistorySchema],
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: { type: Boolean, default: true }, // soft delete, consistent with the User model pattern
  },
  { timestamps: true },
);

// Computed age when DOB is known; falls back to the manually entered `age` otherwise.
patientSchema.virtual("computedAge").get(function () {
  if (!this.dateOfBirth) return this.age ?? null;
  const diffMs = Date.now() - this.dateOfBirth.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
});

patientSchema.set("toJSON", { virtuals: true });
patientSchema.set("toObject", { virtuals: true });

patientSchema.index({ phone: 1 });
patientSchema.index({ isActive: 1 });

module.exports = mongoose.model("Patient", patientSchema);
