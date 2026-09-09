require("dotenv").config();
const connectDB = require("../src/config/db");
const User = require("../src/models/User");
const Patient = require("../src/models/Patient");
const Appointment = require("../src/models/Appointment");
const Bill = require("../src/models/Bill");
const Medicine = require("../src/models/Medicine");
const Sale = require("../src/models/Sale");
const Supplier = require("../src/models/Supplier");
const Clinic = require("../src/models/Clinic");
const ClinicSettings = require("../src/models/ClinicSettings");
const AiAuditLog = require("../src/models/AiAuditLog");

(async () => {
  try {
    await connectDB();
    console.log("\n======================================================");
    console.log("🏥 SMARTCLINIC LIVE MONGODB DATABASE INSPECTION REPORT");
    console.log("======================================================\n");

    // 0. Clinics
    const clinics = await Clinic.find();
    console.log(`🏥 CLINICS COLLECTION (${clinics.length} registered clinics):`);
    clinics.forEach((c) => {
      console.log(
        `   - [${c.status.toUpperCase()}] ${c.name} (Slug: "${c.slug}" | ID: ${c._id})`,
      );
    });

    // 1. Users
    const users = await User.find(
      {},
      "username name email role isActive clinicId clinicName isClinicOwner createdAt",
    );
    console.log(`\n👥 USERS COLLECTION (${users.length} total staff members):`);
    users.forEach((u) => {
      console.log(
        `   - [${String(u.role || "Unknown").padEnd(12)}] ${String(u.username || u.name || "Staff").padEnd(22)} <${u.email}> (Clinic: ${u.clinicId})`,
      );
    });

    // 2. Patients
    const patientCount = await Patient.countDocuments();
    const recentPatients = await Patient.find()
      .sort({ createdAt: -1 })
      .limit(3);
    console.log(`\n🧑‍⚕️ PATIENTS COLLECTION (${patientCount} total patients):`);
    recentPatients.forEach((p) => {
      console.log(
        `   - ID: ${p.patientId} | Name: ${p.fullName} | Age: ${p.age} | Phone: ${p.phone} | History Entries: ${p.medicalHistory?.length || 0}`,
      );
    });

    // 3. Appointments
    const apptCount = await Appointment.countDocuments();
    const recentAppts = await Appointment.find()
      .populate("doctor", "name")
      .populate("patient", "fullName")
      .sort({ createdAt: -1 })
      .limit(3);
    console.log(
      `\n📅 APPOINTMENTS COLLECTION (${apptCount} total appointments):`,
    );
    recentAppts.forEach((a) => {
      console.log(
        `   - ID: ${a.appointmentId} | Date: ${a.appointmentDate?.toISOString().slice(0, 16)} | Patient: ${a.patient?.fullName} | Doctor: ${a.doctor?.name} | Status: ${a.status}`,
      );
    });

    // 4. Bills & Revenue
    const billCount = await Bill.countDocuments();
    const recentBills = await Bill.find()
      .populate("patient", "fullName")
      .sort({ createdAt: -1 })
      .limit(3);
    const revenueAgg = await Bill.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
          totalPaid: { $sum: "$amountPaid" },
          totalDue: { $sum: "$balanceDue" },
        },
      },
    ]);
    console.log(`\n💳 BILLS COLLECTION (${billCount} total bills):`);
    if (revenueAgg[0]) {
      console.log(
        `   - Financial Totals: Total Billed: PKR ${revenueAgg[0].totalAmount} | Collected: PKR ${revenueAgg[0].totalPaid} | Outstanding: PKR ${revenueAgg[0].totalDue}`,
      );
    }
    recentBills.forEach((b) => {
      console.log(
        `   - Bill: ${b.billId} | Patient: ${b.patient?.name} | Total: PKR ${b.totalAmount} | Paid: PKR ${b.amountPaid} | Status: ${b.status}`,
      );
    });

    // 5. Medicines & Inventory
    const medCount = await Medicine.countDocuments();
    const recentMeds = await Medicine.find().sort({ createdAt: -1 }).limit(3);
    console.log(`\n💊 MEDICINES COLLECTION (${medCount} total medicines):`);
    recentMeds.forEach((m) => {
      const totalStock = (m.batches || []).reduce(
        (acc, b) => acc + b.quantity,
        0,
      );
      console.log(
        `   - ${m.name} (${m.category}) | Unit Price: PKR ${m.unitPrice} | Batches: ${m.batches?.length || 0} | Total Stock: ${totalStock}`,
      );
    });

    // 6. POS Sales
    const saleCount = await Sale.countDocuments();
    const recentSales = await Sale.find().sort({ createdAt: -1 }).limit(3);
    console.log(`\n🧾 SALES COLLECTION (${saleCount} total pharmacy sales):`);
    recentSales.forEach((s) => {
      console.log(
        `   - Sale ID: ${s.saleId} | Total: PKR ${s.totalAmount} | Status: ${s.status} | Items: ${s.items?.length || 0}`,
      );
    });

    // 7. Suppliers
    const supplierCount = await Supplier.countDocuments();
    const suppliers = await Supplier.find().limit(3);
    console.log(
      `\n🚚 SUPPLIERS COLLECTION (${supplierCount} total suppliers):`,
    );
    suppliers.forEach((s) => {
      console.log(
        `   - ${s.name} | Contact: ${s.contactPerson || "N/A"} | Phone: ${s.phone || "N/A"}`,
      );
    });

    // 8. Clinic Settings
    const settings = await ClinicSettings.findOne();
    console.log(`\n⚙️ CLINIC SETTINGS:`);
    if (settings) {
      console.log(
        `   - Clinic Name: ${settings.clinicName} | Phone: ${settings.phone} | Email: ${settings.email}`,
      );
    }

    // 9. AI Audit Logs
    const aiLogCount = await AiAuditLog.countDocuments();
    console.log(
      `\n🤖 AI AUDIT LOGS (${aiLogCount} total AI interactions recorded):`,
    );
    const recentAiLogs = await AiAuditLog.find()
      .sort({ createdAt: -1 })
      .limit(3);
    recentAiLogs.forEach((l) => {
      console.log(
        `   - Feature: ${l.feature} | Provider: ${l.provider} | Latency: ${l.latencyMs}ms | Status: ${l.status}`,
      );
    });

    console.log("\n======================================================\n");
    process.exit(0);
  } catch (err) {
    console.error("Inspection error:", err);
    process.exit(1);
  }
})();
