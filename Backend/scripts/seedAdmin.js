// scripts/seedAdmin.js — run: node scripts/seedAdmin.js
require("dotenv").config();
const connectDB = require("../src/config/db");
const User = require("../src/models/User");
const Clinic = require("../src/models/Clinic");

(async () => {
  const clinicId = "69091f6b27791105df71e260";
  const clinicName = "SmartClinic";
  try {
    await connectDB();
    console.log("Connected to MongoDB.");

    const staffAccounts = [
      {
        name: "Anis Khan Niazi",
        email: "admin@clinic.com",
        password: "ChangeMe123",
        role: "Admin",
      },
      {
        name: "Anis Khan",
        email: "aniskhanadmin@gmail.com",
        password: "ChangeMe123",
        role: "Admin",
      },
      {
        name: "Dr. Amina",
        email: "amina@clinic.com",
        password: "Doctor123",
        role: "Doctor",
      },
      {
        name: "Reception Desk",
        email: "receptionist@clinic.com",
        password: "Recep123",
        role: "Receptionist",
      },
      {
        name: "Pharmacy Store",
        email: "pharmacist@clinic.com",
        password: "Pharmacist123",
        role: "Pharmacist",
      },
    ];

    const mongoose = require("mongoose");

    // Establish shared clinic identity for the clinic facility
    let primaryAdmin = await User.findOne({ email: "admin@clinic.com" });
    const sharedClinicId =
      primaryAdmin?.clinicId ||
      (mongoose.Types.ObjectId.isValid(clinicId)
        ? new mongoose.Types.ObjectId(clinicId)
        : new mongoose.Types.ObjectId());
    const sharedClinicName =
      primaryAdmin?.clinicName || clinicName || "SmartClinic";

    // Ensure Clinic document exists
    let clinicDoc = await Clinic.findById(sharedClinicId);
    if (!clinicDoc) {
      clinicDoc = await Clinic.create({
        _id: sharedClinicId,
        name: sharedClinicName,
        slug: "smartclinic",
        email: "admin@clinic.com",
        phone: "0300-1234567",
        address: "Sanghar, Sindh, Pakistan",
        status: "active",
        subscriptionPlan: "premium",
      });
      console.log(
        `✔ Clinic document ensured: ${clinicDoc.name} (${clinicDoc._id})`,
      );
    }

    for (const data of staffAccounts) {
      let user = await User.findOne({ email: data.email }).select("+password");
      if (user) {
        user.name = data.name;
        user.role = data.role;
        user.isActive = true;
        user.password = data.password;
        user.clinicId = sharedClinicId;
        user.clinicName = sharedClinicName;
        await user.save();
        console.log(
          `✔ User verified & updated: ${data.email} (${data.name} - ${data.role})`,
        );
      } else {
        await User.create({
          ...data,
          clinicId: sharedClinicId,
          clinicName: sharedClinicName,
        });
        console.log(
          `✔ User created: ${data.email} (${data.name} - ${data.role})`,
        );
      }
    }

    console.log("\n🎉 All Staff accounts ready.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding admin accounts:", err);
    process.exit(1);
  }
})();
