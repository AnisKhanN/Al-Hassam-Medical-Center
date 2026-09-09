const Counter = require("../models/Counter");

// Scoped per clinic when clinicId is supplied.
const generateMedicineId = async (clinicId) => {
  const counterKey = clinicId ? `medicineId_${clinicId}` : "medicineId";
  const counter = await Counter.findByIdAndUpdate(
    counterKey,
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true },
  );
  return `MED-${String(counter.seq).padStart(6, "0")}`;
};

module.exports = generateMedicineId;

