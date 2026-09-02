const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: { type: String, unique: true, index: true },
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
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled", "No-show"],
      default: "Scheduled",
    },
    notes: { type: String, trim: true }, // filled by the doctor when marking Completed
    cancelReason: { type: String, trim: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ patient: 1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
