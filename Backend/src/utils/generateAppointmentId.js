const Counter = require("../models/Counter");

// Same pattern as generatePatientId — a separate counter key, so
// patient and appointment sequences don't interfere with each other.
// Scoped per clinic when clinicId is supplied.
const generateAppointmentId = async (clinicId) => {
  const counterKey = clinicId ? `appointmentId_${clinicId}` : "appointmentId";
  const counter = await Counter.findByIdAndUpdate(
    counterKey,
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true },
  );
  return `APT-${String(counter.seq).padStart(6, "0")}`;
};

module.exports = generateAppointmentId;

