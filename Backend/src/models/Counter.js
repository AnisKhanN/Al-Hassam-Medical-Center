const mongoose = require("mongoose");

// Generic auto-increment helper — MongoDB has no native auto-increment,
// so we track a running sequence per counter name (e.g. 'patientId').
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

module.exports = mongoose.model("Counter", counterSchema);
