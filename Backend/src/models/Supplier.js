const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
    },
    contactPerson: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    isActive: { type: Boolean, default: true }, // soft delete, consistent with User/Patient
  },
  { timestamps: true },
);

supplierSchema.index({ clinicId: 1, name: 1 });
supplierSchema.index({ clinicId: 1, isActive: 1 });

module.exports = mongoose.model("Supplier", supplierSchema);
