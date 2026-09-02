require("dotenv").config();
const mongoose = require("mongoose");
const Patient = require("../models/Patient");
const generatePatientId = require("../utils/generatePatientId");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const missing = await Patient.find({ patientId: { $exists: false } });
  for (const p of missing) {
    p.patientId = await generatePatientId();
    await p.save();
  }
  console.log(`Backfilled ${missing.length} patient(s)`);
  process.exit();
})();
