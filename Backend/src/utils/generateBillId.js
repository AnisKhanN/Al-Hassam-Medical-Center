const Counter = require("../models/Counter");

// Same auto-increment pattern as patients/appointments — separate counter key.
const generateBillId = async () => {
  const counter = await Counter.findByIdAndUpdate(
    "billId",
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true },
  );
  return `BIL-${String(counter.seq).padStart(6, "0")}`;
};

module.exports = generateBillId;

