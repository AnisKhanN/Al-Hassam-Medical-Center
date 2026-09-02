const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
  {
    batchNumber: {
      type: String,
      required: [true, "Batch number is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    costPrice: {
      type: Number,
      required: [true, "Cost price is required"],
      min: 0,
    },
    expiryDate: { type: Date, required: [true, "Expiry date is required"] },
    receivedDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const medicineSchema = new mongoose.Schema(
  {
    medicineId: { type: String, unique: true, index: true },
    name: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
    },
    genericName: { type: String, trim: true },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    unit: {
      type: String,
      enum: [
        "Tablet",
        "Capsule",
        "Syrup",
        "Injection",
        "Ointment",
        "Drops",
        "Other",
      ],
      default: "Tablet",
    },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    unitPrice: {
      type: Number,
      required: [true, "Unit price is required"],
      min: 0,
    },
    reorderLevel: { type: Number, default: 20, min: 0 },
    batches: [batchSchema],
    isActive: { type: Boolean, default: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

medicineSchema.virtual("totalStock").get(function () {
  if (!this.batches || !Array.isArray(this.batches)) return 0;
  return this.batches.reduce((sum, b) => sum + (b.quantity || 0), 0);
});

medicineSchema.virtual("isLowStock").get(function () {
  return this.totalStock <= (this.reorderLevel || 0);
});

medicineSchema.virtual("nearestExpiry").get(function () {
  if (!this.batches || !Array.isArray(this.batches)) return null;
  const inStock = this.batches.filter((b) => b.quantity > 0);
  if (inStock.length === 0) return null;
  return inStock.reduce(
    (earliest, b) => (b.expiryDate < earliest ? b.expiryDate : earliest),
    inStock[0].expiryDate,
  );
});

medicineSchema.set("toJSON", { virtuals: true });
medicineSchema.set("toObject", { virtuals: true });

medicineSchema.index({ name: 1 });
medicineSchema.index({ category: 1 });
medicineSchema.index({ isActive: 1 });

module.exports = mongoose.model("Medicine", medicineSchema);
