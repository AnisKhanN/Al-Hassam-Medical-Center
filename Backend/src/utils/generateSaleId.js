const Counter = require("../models/Counter");

const generateSaleId = async () => {
  const counter = await Counter.findByIdAndUpdate(
    "saleId",
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true },
  );
  return `SALE-${String(counter.seq).padStart(6, "0")}`;
};

module.exports = generateSaleId;

