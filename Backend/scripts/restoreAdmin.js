const mongoose = require("mongoose");
const User = require("../src/models/User");
const config = require("../src/config/config");

mongoose.connect(config.MONGO_URI).then(async () => {
  await User.updateOne(
    { email: "admin@clinic.com" },
    { $set: { name: "Anis Khan Niazi", role: "Admin", isActive: true } }
  );
  console.log("✅ Restored admin@clinic.com to Admin (Anis Khan Niazi)");
  const admin = await User.findOne({ email: "admin@clinic.com" });
  console.log("Verified:", admin.name, admin.email, admin.role);
  process.exit(0);
});
