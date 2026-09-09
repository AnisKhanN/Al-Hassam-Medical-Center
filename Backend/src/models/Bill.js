const mongoose = require("mongoose");

const billItemSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Item description is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["Consultation", "Medicine", "Lab Test", "Procedure", "Other"],
      default: "Other",
    },
    quantity: { type: Number, default: 1, min: 1 },
    unitPrice: {
      type: Number,
      required: [true, "Unit price is required"],
      min: 0,
    },
  },
  { _id: false },
);

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0.01 },
    method: {
      type: String,
      enum: ["Cash", "Card", "Bank Transfer", "Other"],
      default: "Cash",
    },
    date: { type: Date, default: Date.now },
    reference: { type: String, trim: true }, // e.g. transaction/slip number for Card or Bank Transfer
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { _id: false },
);

const billSchema = new mongoose.Schema(
  {
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
      index: true,
    },
    billId: { type: String, required: true, index: true },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }, // optional — a bill doesn't have to originate from an appointment
    items: {
      type: [billItemSchema],
      validate: [(arr) => arr.length > 0, "At least one bill item is required"],
    },
    discount: { type: Number, default: 0, min: 0 },
    subtotal: { type: Number, default: 0 }, // derived, kept in sync by recalculate()
    totalAmount: { type: Number, default: 0 }, // subtotal - discount
    amountPaid: { type: Number, default: 0 }, // sum of payments
    balanceDue: { type: Number, default: 0 }, // totalAmount - amountPaid
    status: {
      type: String,
      enum: ["Unpaid", "Partially Paid", "Paid", "Cancelled"],
      default: "Unpaid",
    },
    payments: [paymentSchema],
    notes: { type: String, trim: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Single source of truth for all derived money fields — called after items
// or payments change, so subtotal/total/balance/status can never drift out
// of sync with each other (the classic billing-bug source).
billSchema.methods.recalculate = function () {
  this.subtotal = this.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  this.totalAmount = Math.max(this.subtotal - this.discount, 0);
  this.amountPaid = this.payments.reduce((sum, p) => sum + p.amount, 0);
  this.balanceDue = Math.max(this.totalAmount - this.amountPaid, 0);

  if (this.status !== "Cancelled") {
    if (this.amountPaid <= 0) this.status = "Unpaid";
    else if (this.balanceDue > 0) this.status = "Partially Paid";
    else this.status = "Paid";
  }
};

billSchema.index({ clinicId: 1, billId: 1 }, { unique: true });
billSchema.index({ clinicId: 1, patient: 1 });
billSchema.index({ clinicId: 1, status: 1 });
billSchema.index({ clinicId: 1, createdAt: -1 });

module.exports = mongoose.model("Bill", billSchema);
