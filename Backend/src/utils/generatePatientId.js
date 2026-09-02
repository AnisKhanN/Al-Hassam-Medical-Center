const Counter = require("../models/Counter");

// Produces PT-000001, PT-000002, ... — human-readable IDs receptionists
// can read over the phone or write on a physical file, unlike a Mongo ObjectId.
const generatePatientId = async () => {
  const counter = await Counter.findByIdAndUpdate(
    "patientId",
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true },
  );
  return `PT-${String(counter.seq).padStart(6, "0")}`;
};

module.exports = generatePatientId;

