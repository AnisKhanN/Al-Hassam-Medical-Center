const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Bill = require("../models/Bill");
const Medicine = require("../models/Medicine");

exports.getDashboardStats = async (req, res, next) => {
  try {
    const role = req.user?.role || "Admin";

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const canViewClinic = ["Admin", "Doctor", "Receptionist"].includes(role);
    const canViewBilling = ["Admin", "Receptionist"].includes(role);
    const canViewPharmacy = ["Admin", "Pharmacist"].includes(role);

    const clinicId = req.user?.clinicId;

    // Doctor is scoped to their own appointments, all roles scoped to their clinic
    const appointmentFilter = {
      ...(clinicId ? { clinicId } : {}),
      appointmentDate: { $gte: todayStart, $lte: todayEnd },
      ...(role === "Doctor" ? { doctor: req.user._id } : {}),
    };

    const queries = {};

    if (canViewClinic) {
      queries.totalPatients = Patient.countDocuments({
        ...(clinicId ? { clinicId } : {}),
        isActive: { $ne: false },
      });
      queries.todayAppointments = Appointment.countDocuments(appointmentFilter);
      queries.todayScheduled = Appointment.countDocuments({
        ...appointmentFilter,
        status: "Scheduled",
      });
      queries.todayCompleted = Appointment.countDocuments({
        ...appointmentFilter,
        status: "Completed",
      });
    }

    if (canViewBilling) {
      queries.unpaidBills = Bill.countDocuments({
        ...(clinicId ? { clinicId } : {}),
        status: { $in: ["Unpaid", "Partially Paid"] },
      });
    }

    if (canViewPharmacy) {
      queries.medicinesForPharmacy = Medicine.find({
        ...(clinicId ? { clinicId } : {}),
        isActive: true,
      });
    }

    const queryKeys = Object.keys(queries);
    const queryResults = await Promise.all(Object.values(queries));
    const resolved = {};
    queryKeys.forEach((key, idx) => {
      resolved[key] = queryResults[idx];
    });

    const expiringBatches = [];
    let lowStockList = [];
    if (resolved.medicinesForPharmacy) {
      lowStockList = resolved.medicinesForPharmacy
        .filter((m) => m.isLowStock)
        .map((m) => ({
          _id: m._id,
          name: m.name,
          totalStock: m.totalStock,
          reorderLevel: m.reorderLevel,
        }));

      resolved.medicinesForPharmacy.forEach((med) => {
        (med.batches || []).forEach((b) => {
          if (
            b.quantity > 0 &&
            b.expiryDate &&
            new Date(b.expiryDate) <= thirtyDaysFromNow
          ) {
            expiringBatches.push({
              batchId: b._id,
              medicineName: med.name,
              batchNumber: b.batchNumber,
              quantity: b.quantity,
              expiryDate: b.expiryDate,
            });
          }
        });
      });
    }

    const responseData = {};
    if (canViewClinic) {
      responseData.totalPatients = resolved.totalPatients ?? 0;
      responseData.todayAppointments = resolved.todayAppointments ?? 0;
      responseData.todayScheduled = resolved.todayScheduled ?? 0;
      responseData.todayCompleted = resolved.todayCompleted ?? 0;
    }
    if (canViewBilling) {
      responseData.unpaidBills = resolved.unpaidBills ?? 0;
    }
    if (canViewPharmacy) {
      responseData.lowStock = lowStockList;
      responseData.expiring = expiringBatches;
    }

    res.status(200).json({
      success: true,
      message: "Dashboard stats aggregated successfully",
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};
