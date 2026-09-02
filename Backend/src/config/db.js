const mongoose = require("mongoose");
const config = require("./config.js");

async function connectDB() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed");
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
