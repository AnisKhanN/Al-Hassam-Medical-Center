const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema(
  {
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },
    medicineName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    deductedFrom: [
      {
        batchId: { type: mongoose.Schema.Types.ObjectId, required: true },
        quantity: { type: Number, required: true, min: 1 },
        _id: false,
      },
    ],
  },
  { _id: false },
);

const saleSchema = new mongoose.Schema(
  {
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
      index: true,
    },
    saleId: { type: String, required: true, index: true },
    items: {
      type: [saleItemSchema],
      validate: [(arr) => arr.length > 0, "At least one sale item is required"],
    },
    totalAmount: { type: Number, default: 0 },
    customerName: { type: String, trim: true },
    customerPhone: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Completed", "Voided"],
      default: "Completed",
    },
    voidReason: { type: String, trim: true },
    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

saleSchema.methods.recalculate = function () {
  if (!this.items || !Array.isArray(this.items)) {
    this.totalAmount = 0;
    return;
  }
  this.totalAmount = this.items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0,
  );
};

saleSchema.index({ clinicId: 1, saleId: 1 }, { unique: true });
saleSchema.index({ clinicId: 1, createdAt: -1 });
saleSchema.index({ clinicId: 1, status: 1 });

module.exports = mongoose.model("Sale", saleSchema);
