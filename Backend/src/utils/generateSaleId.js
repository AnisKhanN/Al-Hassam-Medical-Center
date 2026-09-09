const Counter = require("../models/Counter");

// Scoped per clinic when clinicId is supplied.
const generateSaleId = async (clinicId) => {
  const counterKey = clinicId ? `saleId_${clinicId}` : "saleId";
  const counter = await Counter.findByIdAndUpdate(
    counterKey,
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true },
  );
  return `SALE-${String(counter.seq).padStart(6, "0")}`;
};

module.exports = generateSaleId;

