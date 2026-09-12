// scripts/seedAdmin.js — run: node scripts/seedAdmin.js
require("dotenv").config();
const connectDB = require("../src/config/db");
const User = require("../src/models/User");
const Clinic = require("../src/models/Clinic");

(async () => {
  const clinicId = "69091f6b27791105df71e260";
  const clinicName = "Al-Hassam Medical Center";
  try {
    await connectDB();
    console.log("Connected to MongoDB.");

    const staffAccounts = [
      {
        name: "Anis Khan Niazi",
        email: "admin@clinic.com",
        password: "admin123",
        role: "Admin",
      },
      // 7 Medical Specialties Faculty
      {
        name: "Dr. Zainab Tariq",
        email: "dr.pediatrics@clinic.com",
        password: "doctor123",
        role: "Doctor",
        specialty: "Child Care & Pediatrics",
        roomNumber: "Room 102 (Pediatric Suite)",
        visitingDays: "Monday - Saturday (10 AM - 2 PM)",
        consultationFee: 1500,
        phone: "+92 332 5136733",
        onDuty: true,
      },
      {
        name: "Dr. Amina Khan",
        email: "doctor@clinic.com",
        password: "doctor123",
        role: "Doctor",
        specialty: "General Medicine",
        roomNumber: "Room 101 (OPD Executive)",
        visitingDays: "Monday - Sunday (24/7 Daily OPD)",
        consultationFee: 1200,
        phone: "+92 332 5136733",
        onDuty: true,
      },
      {
        name: "Dr. Tariq Mehmood",
        email: "dr.cardio@clinic.com",
        password: "doctor123",
        role: "Doctor",
        specialty: "Cardiology",
        roomNumber: "Room 103 (Cardiology & ECG Suite)",
        visitingDays: "Mon / Wed / Fri (4 PM - 8 PM)",
        consultationFee: 2000,
        phone: "+92 332 5136733",
        onDuty: true,
      },
      {
        name: "Dr. Farhan Ali",
        email: "dr.gastro@clinic.com",
        password: "doctor123",
        role: "Doctor",
        specialty: "Gastroenterology",
        roomNumber: "Room 104 (Digestive & Liver Care)",
        visitingDays: "Tue / Thu / Sat (3 PM - 7 PM)",
        consultationFee: 1800,
        phone: "+92 332 5136733",
        onDuty: true,
      },
      {
        name: "Dr. Bilal Ahmed",
        email: "dr.surgery@clinic.com",
        password: "doctor123",
        role: "Doctor",
        specialty: "General Surgery",
        roomNumber: "Room 105 (Surgical & Minor Procedure)",
        visitingDays: "Monday - Saturday (11 AM - 3 PM)",
        consultationFee: 2000,
        phone: "+92 332 5136733",
        onDuty: true,
      },
      {
        name: "Dr. Sadia Rehman",
        email: "dr.gynae@clinic.com",
        password: "doctor123",
        role: "Doctor",
        specialty: "Gynecology & Obstetrics",
        roomNumber: "Room 106 (Maternal Health Suite)",
        visitingDays: "Monday - Saturday (9 AM - 2 PM)",
        consultationFee: 1800,
        phone: "+92 332 5136733",
        onDuty: true,
      },
      {
        name: "Dr. Imran Qureshi",
        email: "dr.eye@clinic.com",
        password: "doctor123",
        role: "Doctor",
        specialty: "Ophthalmology",
        roomNumber: "Room 107 (Vision & Eye Care)",
        visitingDays: "Wed / Sat / Sun (2 PM - 6 PM)",
        consultationFee: 1500,
        phone: "+92 332 5136733",
        onDuty: true,
      },
      // Front Desk & Pharmacy
      {
        name: "Reception Desk",
        email: "reception@clinic.com",
        password: "reception123",
        role: "Receptionist",
      },
      {
        name: "Pharmacy Store",
        email: "pharmacy@clinic.com",
        password: "pharmacy123",
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
    const sharedClinicName = clinicName;

    // Ensure Clinic document exists
    let clinicDoc = await Clinic.findById(sharedClinicId);
    if (!clinicDoc) {
      clinicDoc = await Clinic.create({
        _id: sharedClinicId,
        name: sharedClinicName,
        slug: "al-hassam-medical-center",
        email: "admin@clinic.com",
        phone: "+92 332 5136733",
        address: "Nawabshah Road, City Sanghar, Sindh",
        status: "active",
        subscriptionPlan: "premium",
      });
      console.log(
        `✔ Clinic document ensured: ${clinicDoc.name} (${clinicDoc._id})`,
      );
    } else {
      clinicDoc.name = sharedClinicName;
      await clinicDoc.save();
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
        if (data.specialty) user.specialty = data.specialty;
        if (data.roomNumber) user.roomNumber = data.roomNumber;
        if (data.visitingDays) user.visitingDays = data.visitingDays;
        if (data.consultationFee) user.consultationFee = data.consultationFee;
        if (data.phone) user.phone = data.phone;
        if (data.onDuty !== undefined) user.onDuty = data.onDuty;
        await user.save();
        console.log(
          `✔ User verified & updated: ${data.email} (${data.name} - ${data.specialty || data.role})`,
        );
      } else {
        await User.create({
          ...data,
          clinicId: sharedClinicId,
          clinicName: sharedClinicName,
        });
        console.log(
          `✔ User created: ${data.email} (${data.name} - ${data.specialty || data.role})`,
        );
      }
    }

    console.log("\n🎉 All Staff accounts & 7 Specialist Doctors ready for Al-Hassam Medical Center.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding admin accounts:", err);
    process.exit(1);
  }
})();
