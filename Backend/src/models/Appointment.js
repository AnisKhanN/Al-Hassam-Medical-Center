const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: { type: String, required: true, index: true },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: [true, "Appointment date/time is required"],
    },
    duration: { type: Number, default: 30, min: 5, max: 240 }, // minutes
    reason: {
      type: String,
      required: [true, "Reason for visit is required"],
      trim: true,
    },
    specialty: {
      type: String,
      trim: true,
      default: "General Medicine",
      index: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled", "No-show"],
      default: "Scheduled",
    },
    notes: { type: String, trim: true }, // filled by the doctor when marking Completed
    cancelReason: { type: String, trim: true },
    isTelemedicine: { type: Boolean, default: false },
    meetingRoomId: { type: String, trim: true, index: true },
    meetingStatus: {
      type: String,
      enum: ["Scheduled", "Waiting", "Active", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // clinic context
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
      index: true,
    },
    clinicName: {
      type: String,
      default: "SmartClinic",
      trim: true,
    },
    clinicDomain: {
      type: String,
      lowercase: true,
      trim: true,
    },
    clinicStatus: {
      type: String,
      enum: ["active", "inactive", "suspended", "trial"],
      default: "active",
    },
    searchTokens: {
      type: [String],
      default: [],
      maxlength: 20,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    parentAppointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      index: true,
      sparse: true,
    },
  },

  { timestamps: true },
);

// Convenience for the frontend calendar — end of the booked window
appointmentSchema.virtual("endTime").get(function () {
  if (!this.appointmentDate) return null;
  return new Date(this.appointmentDate.getTime() + this.duration * 60000);
});
appointmentSchema.set("toJSON", { virtuals: true });
appointmentSchema.set("toObject", { virtuals: true });

appointmentSchema.index({ clinicId: 1, appointmentId: 1 }, { unique: true });
appointmentSchema.index({ clinicId: 1, doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ clinicId: 1, appointmentDate: 1 });
appointmentSchema.index({ clinicId: 1, patient: 1 });
appointmentSchema.index({ clinicId: 1, status: 1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ appointmentDate: 1 });
appointmentSchema.index({ patient: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ doctor: 1, status: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
