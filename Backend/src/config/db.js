const mongoose = require("mongoose");
const config = require("./config.js");

const LOCAL_FALLBACK_URI = "mongodb://127.0.0.1:27017/smartclinic";

async function connectDB() {
  const primaryUri = config.MONGO_URI;

  try {
    // 1. Attempt primary database (MongoDB Atlas)
    await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 6000 });
    console.log("✅ Connected to Primary MongoDB (Atlas)");
    return;
  } catch (primaryErr) {
    console.warn(
      "⚠️  Primary MongoDB Connection Failed (Atlas IP Whitelist or Network):",
    );
    console.warn(`   ${primaryErr.message}`);

    // Cleanly close prior connection attempt before fallback
    try {
      await mongoose.disconnect();
    } catch (_) {}

    // 2. Automatically fallback to local MongoDB running on localhost:27017
    if (primaryUri !== LOCAL_FALLBACK_URI) {
      try {
        console.log("🔄 Attempting seamless fallback to local MongoDB...");
        await mongoose.connect(LOCAL_FALLBACK_URI, {
          serverSelectionTimeoutMS: 4000,
        });
        console.log("✅ Connected to Local MongoDB fallback successfully!");
        return;
      } catch (localErr) {
        console.error(
          "❌ Local MongoDB fallback also failed:",
          localErr.message,
        );
      }
    }

    console.error(
      "⚠️  Server will continue running in degraded mode so API documentation & endpoints stay online.",
    );
  }
}

module.exports = connectDB;
