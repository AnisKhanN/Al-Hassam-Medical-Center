const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Doctor", "Receptionist", "Pharmacist"],
      default: "Doctor",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      default: () => new mongoose.Types.ObjectId(),
      index: true,
    },
    clinicName: {
      type: String,
      default: "SmartClinic",
      trim: true,
    },
    clinicLogo: {
      type: String,
      default: "",
    },
    clinicDomain: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true, // Allow null/undefined for backward compatibility
    },
    clinicStatus: {
      type: String,
      enum: ["active", "inactive", "suspended", "trial"],
      default: "active",
    },
    isClinicOwner: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
