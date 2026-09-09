// scripts/dropLegacyGlobalUniqueIndexes.js
const mongoose = require("mongoose");
require("dotenv").config();

const dropLegacyIndexes = async () => {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to Atlas.\n");

  const legacyIndexesToDrop = [
    { collection: "patients", indexName: "patientId_1" },
    { collection: "bills", indexName: "billId_1" },
    { collection: "sales", indexName: "saleId_1" },
    { collection: "medicines", indexName: "medicineId_1" },
    { collection: "appointments", indexName: "appointmentId_1" },
  ];

  for (const item of legacyIndexesToDrop) {
    try {
      const coll = mongoose.connection.db.collection(item.collection);
      const indexes = await coll.indexes();
      const exists = indexes.some((idx) => idx.name === item.indexName);
      if (exists) {
        console.log(`Dropping legacy unique index '${item.indexName}' on collection '${item.collection}'...`);
        await coll.dropIndex(item.indexName);
        console.log(`  ✅ Successfully dropped ${item.indexName} on ${item.collection}`);
      } else {
        console.log(`  ℹ️ Index '${item.indexName}' on '${item.collection}' does not exist (already dropped).`);
      }
    } catch (err) {
      console.warn(`  ⚠️ Could not drop ${item.indexName} on ${item.collection}:`, err.message);
    }
  }

  // Ensure compound unique indexes exist for all multi-tenant collections
  console.log("\nEnsuring multi-tenant compound indexes exist...");
  try {
    const Patient = require("../src/models/Patient");
    const Appointment = require("../src/models/Appointment");
    const Bill = require("../src/models/Bill");
    const Sale = require("../src/models/Sale");
    const Medicine = require("../src/models/Medicine");

    await Patient.syncIndexes();
    console.log("  ✅ Patient indexes synchronized");
    await Appointment.syncIndexes();
    console.log("  ✅ Appointment indexes synchronized");
    await Bill.syncIndexes();
    console.log("  ✅ Bill indexes synchronized");
    await Sale.syncIndexes();
    console.log("  ✅ Sale indexes synchronized");
    await Medicine.syncIndexes();
    console.log("  ✅ Medicine indexes synchronized");
  } catch (err) {
    console.warn("  ⚠️ Warning syncing model indexes:", err.message);
  }

  console.log("\nIndex migration completed successfully.");
  await mongoose.disconnect();
};

dropLegacyIndexes().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
