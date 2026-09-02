const Counter = require("../models/Counter");

const generateMedicineId = async () => {
  const counter = await Counter.findByIdAndUpdate(
    "medicineId",
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true },
  );
  return `MED-${String(counter.seq).padStart(6, "0")}`;
};

module.exports = generateMedicineId;

