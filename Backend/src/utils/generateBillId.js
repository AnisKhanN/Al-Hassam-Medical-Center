const Counter = require("../models/Counter");

// Same auto-increment pattern as patients/appointments — separate counter key.
// Scoped per clinic when clinicId is supplied.
const generateBillId = async (clinicId) => {
  const counterKey = clinicId ? `billId_${clinicId}` : "billId";
  const counter = await Counter.findByIdAndUpdate(
    counterKey,
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true },
  );
  return `BIL-${String(counter.seq).padStart(6, "0")}`;
};

module.exports = generateBillId;

