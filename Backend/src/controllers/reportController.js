const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Bill = require("../models/Bill");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Medicine = require("../models/Medicine");
const Sale = require("../models/Sale");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// Helper to parse date bounds (defaults to current month)
const parseDateRange = (query) => {
  const dateTo = query.dateTo ? new Date(query.dateTo) : new Date();
  dateTo.setHours(23, 59, 59, 999);

  const dateFrom = query.dateFrom
    ? new Date(query.dateFrom)
    : new Date(dateTo.getFullYear(), dateTo.getMonth(), 1);
  dateFrom.setHours(0, 0, 0, 0);

  return { dateFrom, dateTo };
};

// ==========================================
// 1. REVENUE REPORT
// ==========================================
// @route   GET /api/reports/revenue?dateFrom=&dateTo=
// @access  Private/Admin,Receptionist
exports.getRevenueReport = catchAsync(async (req, res) => {
  const { dateFrom, dateTo } = parseDateRange(req.query);
  const clinicObjectId = new mongoose.Types.ObjectId(req.user.clinicId);

  const [totals, dailyTrend, byMethod, bills] = await Promise.all([
    Bill.aggregate([
      { $match: { clinicId: clinicObjectId, createdAt: { $gte: dateFrom, $lte: dateTo } } },
      {
        $group: {
          _id: null,
          totalBilled: { $sum: "$totalAmount" },
          totalCollected: { $sum: "$amountPaid" },
          totalOutstanding: { $sum: "$balanceDue" },
          totalDiscount: { $sum: "$discount" },
          billCount: { $sum: 1 },
          paidBillsCount: {
            $sum: { $cond: [{ $eq: ["$status", "Paid"] }, 1, 0] },
          },
          unpaidBillsCount: {
            $sum: { $cond: [{ $eq: ["$status", "Unpaid"] }, 1, 0] },
          },
          partiallyPaidCount: {
            $sum: { $cond: [{ $eq: ["$status", "Partially Paid"] }, 1, 0] },
          },
        },
      },
    ]),
    Bill.aggregate([
      { $match: { clinicId: clinicObjectId, createdAt: { $gte: dateFrom, $lte: dateTo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          billed: { $sum: "$totalAmount" },
          collected: { $sum: "$amountPaid" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Bill.aggregate([
      { $match: { clinicId: clinicObjectId, "payments.date": { $gte: dateFrom, $lte: dateTo } } },
      { $unwind: "$payments" },
      {
        $match: { "payments.date": { $gte: dateFrom, $lte: dateTo } },
      },
      {
        $group: {
          _id: "$payments.method",
          total: { $sum: "$payments.amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]),
    Bill.find({ clinicId: req.user.clinicId, createdAt: { $gte: dateFrom, $lte: dateTo } })
      .populate("patient", "fullName patientId phone")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean(),
  ]);

  const summary = totals[0] || {
    totalBilled: 0,
    totalCollected: 0,
    totalOutstanding: 0,
    totalDiscount: 0,
    billCount: 0,
    paidBillsCount: 0,
    unpaidBillsCount: 0,
    partiallyPaidCount: 0,
  };

  res.status(200).json({
    success: true,
    data: {
      range: { from: dateFrom, to: dateTo },
      summary,
      dailyTrend,
      byMethod,
      records: bills,
    },
  });
});

// ==========================================
// 2. APPOINTMENT REPORT
// ==========================================
// @route   GET /api/reports/appointments?dateFrom=&dateTo=&doctor=
// @access  Private/Admin,Doctor,Receptionist
exports.getAppointmentReport = catchAsync(async (req, res) => {
  const { dateFrom, dateTo } = parseDateRange(req.query);
  const clinicObjectId = new mongoose.Types.ObjectId(req.user.clinicId);

  const matchFilter = {
    clinicId: clinicObjectId,
    appointmentDate: { $gte: dateFrom, $lte: dateTo },
  };

  // If doctor, force scope to their appointments
  if (req.user.role === "Doctor") {
    matchFilter.doctor = new mongoose.Types.ObjectId(req.user._id);
  } else if (req.query.doctor) {
    if (mongoose.Types.ObjectId.isValid(req.query.doctor)) {
      matchFilter.doctor = new mongoose.Types.ObjectId(req.query.doctor);
    }
  }

  const [statusBreakdown, doctorBreakdown, dailyTrend, appointments] =
    await Promise.all([
      Appointment.aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      Appointment.aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: "$doctor",
            total: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
            },
            cancelled: {
              $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] },
            },
            scheduled: {
              $sum: { $cond: [{ $eq: ["$status", "Scheduled"] }, 1, 0] },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "doctorInfo",
          },
        },
        { $unwind: "$doctorInfo" },
        {
          $project: {
            doctorId: "$_id",
            doctorName: "$doctorInfo.name",
            specialization: "$doctorInfo.specialization",
            total: 1,
            completed: 1,
            cancelled: 1,
            scheduled: 1,
          },
        },
      ]),
      Appointment.aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$appointmentDate" },
            },
            total: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Appointment.find(matchFilter)
        .populate("patient", "fullName patientId phone")
        .populate("doctor", "name specialization")
        .sort({ appointmentDate: -1 })
        .limit(200)
        .lean(),
    ]);

  const total = statusBreakdown.reduce((acc, curr) => acc + curr.count, 0);
  const completedCount =
    statusBreakdown.find((s) => s._id === "Completed")?.count || 0;
  const cancelledCount =
    statusBreakdown.find((s) => s._id === "Cancelled")?.count || 0;
  const scheduledCount =
    statusBreakdown.find((s) => s._id === "Scheduled")?.count || 0;

  const completionRate =
    total > 0 ? ((completedCount / total) * 100).toFixed(1) : 0;
  const cancellationRate =
    total > 0 ? ((cancelledCount / total) * 100).toFixed(1) : 0;

  res.status(200).json({
    success: true,
    data: {
      range: { from: dateFrom, to: dateTo },
      summary: {
        total,
        completedCount,
        cancelledCount,
        scheduledCount,
        completionRate: Number(completionRate),
        cancellationRate: Number(cancellationRate),
      },
      statusBreakdown,
      doctorBreakdown,
      dailyTrend,
      records: appointments,
    },
  });
});

// ==========================================
// 3. PATIENT REPORT
// ==========================================
// @route   GET /api/reports/patients?dateFrom=&dateTo=
// @access  Private/Admin,Doctor,Receptionist
exports.getPatientReport = catchAsync(async (req, res) => {
  const { dateFrom, dateTo } = parseDateRange(req.query);
  const clinicObjectId = new mongoose.Types.ObjectId(req.user.clinicId);

  const [
    newRegisteredInRange,
    allTimeTotal,
    genderDist,
    bloodGroupDist,
    registrationTrend,
    patientRecords,
  ] = await Promise.all([
    Patient.countDocuments({
      clinicId: req.user.clinicId,
      createdAt: { $gte: dateFrom, $lte: dateTo },
      isActive: true,
    }),
    Patient.countDocuments({ clinicId: req.user.clinicId, isActive: true }),
    Patient.aggregate([
      { $match: { clinicId: clinicObjectId, isActive: true } },
      { $group: { _id: "$gender", count: { $sum: 1 } } },
    ]),
    Patient.aggregate([
      { $match: { clinicId: clinicObjectId, isActive: true, bloodGroup: { $ne: null } } },
      { $group: { _id: "$bloodGroup", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Patient.aggregate([
      {
        $match: { clinicId: clinicObjectId, createdAt: { $gte: dateFrom, $lte: dateTo }, isActive: true },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Patient.find({
      clinicId: req.user.clinicId,
      createdAt: { $gte: dateFrom, $lte: dateTo },
      isActive: true,
    })
      .select(
        "patientId fullName phone gender age bloodGroup createdAt medicalHistory",
      )
      .sort({ createdAt: -1 })
      .limit(200)
      .lean(),
  ]);

  // Age group buckets from all active patients (optimized lean fetch)
  const allPatients = await Patient.find({ clinicId: req.user.clinicId, isActive: true })
    .select("dateOfBirth age")
    .lean();
  const ageGroups = {
    "0-18 (Children)": 0,
    "19-35 (Young Adult)": 0,
    "36-50 (Adult)": 0,
    "51-65 (Middle Age)": 0,
    "65+ (Senior)": 0,
  };

  allPatients.forEach((p) => {
    const age = p.age || 0;
    if (age <= 18) ageGroups["0-18 (Children)"]++;
    else if (age <= 35) ageGroups["19-35 (Young Adult)"]++;
    else if (age <= 50) ageGroups["36-50 (Adult)"]++;
    else if (age <= 65) ageGroups["51-65 (Middle Age)"]++;
    else ageGroups["65+ (Senior)"]++;
  });

  const ageDistribution = Object.entries(ageGroups).map(([group, count]) => ({
    _id: group,
    count,
  }));

  res.status(200).json({
    success: true,
    data: {
      range: { from: dateFrom, to: dateTo },
      summary: {
        newRegisteredInRange,
        allTimeTotal,
      },
      genderDistribution: genderDist,
      bloodGroupDistribution: bloodGroupDist,
      ageDistribution,
      registrationTrend,
      records: patientRecords,
    },
  });
});

// ==========================================
// 4. PHARMACY SALES REPORT
// ==========================================
// @route   GET /api/reports/pharmacy?dateFrom=&dateTo=
// @access  Private/Admin,Pharmacist
exports.getPharmacyReport = catchAsync(async (req, res) => {
  const { dateFrom, dateTo } = parseDateRange(req.query);
  const clinicObjectId = new mongoose.Types.ObjectId(req.user.clinicId);

  const [totals, dailyTrend, topMedicines, records] = await Promise.all([
    Sale.aggregate([
      { $match: { clinicId: clinicObjectId, createdAt: { $gte: dateFrom, $lte: dateTo } } },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ["$status", "Completed"] }, "$totalAmount", 0],
            },
          },
          completedCount: {
            $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
          },
          voidedCount: {
            $sum: { $cond: [{ $eq: ["$status", "Voided"] }, 1, 0] },
          },
          totalTransactions: { $sum: 1 },
        },
      },
    ]),
    Sale.aggregate([
      {
        $match: {
          clinicId: clinicObjectId,
          status: "Completed",
          createdAt: { $gte: dateFrom, $lte: dateTo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          salesCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Sale.aggregate([
      {
        $match: {
          clinicId: clinicObjectId,
          status: "Completed",
          createdAt: { $gte: dateFrom, $lte: dateTo },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.medicineName",
          quantitySold: { $sum: "$items.quantity" },
          revenue: {
            $sum: { $multiply: ["$items.quantity", "$items.unitPrice"] },
          },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
    ]),
    Sale.find({ clinicId: req.user.clinicId, createdAt: { $gte: dateFrom, $lte: dateTo } })
      .populate("soldBy", "name")
      .populate("items.medicine", "medicineId name")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean(),
  ]);

  const summary = totals[0] || {
    totalRevenue: 0,
    completedCount: 0,
    voidedCount: 0,
    totalTransactions: 0,
  };

  res.status(200).json({
    success: true,
    data: {
      range: { from: dateFrom, to: dateTo },
      summary,
      dailyTrend,
      topMedicines,
      records,
    },
  });
});

// ==========================================
// 5. INVENTORY VALUATION & EXPIRY REPORT
// ==========================================
// @route   GET /api/reports/inventory
// @access  Private/Admin,Pharmacist
exports.getInventoryReport = catchAsync(async (req, res) => {
  const medicines = await Medicine.find({ clinicId: req.user.clinicId, isActive: true })
    .populate("supplier", "name phone")
    .lean();

  let totalCostValuation = 0;
  let totalRetailValuation = 0;
  let totalStockUnits = 0;
  let inStockCount = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  const now = new Date();
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const sixtyDays = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
  const ninetyDays = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  const categoryMap = {};
  const expiringBatches30 = [];
  const expiringBatches60 = [];
  const expiringBatches90 = [];
  const reorderList = [];

  medicines.forEach((med) => {
    const stock = Array.isArray(med.batches)
      ? med.batches.reduce((sum, b) => sum + (b.quantity || 0), 0)
      : 0;
    const isLowStock = stock <= (med.reorderLevel || 0);
    const unitPrice = med.unitPrice || 0;
    totalStockUnits += stock;
    totalRetailValuation += stock * unitPrice;

    if (stock === 0) outOfStockCount++;
    else if (isLowStock) {
      lowStockCount++;
      reorderList.push({
        _id: med._id,
        medicineId: med.medicineId,
        name: med.name,
        category: med.category,
        totalStock: stock,
        reorderLevel: med.reorderLevel,
        unit: med.unit,
        unitPrice: med.unitPrice,
        supplierName: med.supplier?.name || "N/A",
      });
    } else inStockCount++;

    // Category aggregation
    if (!categoryMap[med.category]) {
      categoryMap[med.category] = {
        category: med.category,
        count: 0,
        totalStock: 0,
        valuation: 0,
      };
    }
    categoryMap[med.category].count++;
    categoryMap[med.category].totalStock += stock;
    categoryMap[med.category].valuation += stock * unitPrice;

    // Batches calculation
    if (Array.isArray(med.batches)) {
      med.batches.forEach((batch) => {
        if (batch.quantity > 0) {
          totalCostValuation += batch.quantity * (batch.costPrice || 0);

          const exp = new Date(batch.expiryDate);
          const batchInfo = {
            medicineId: med.medicineId,
            medicineName: med.name,
            batchNumber: batch.batchNumber,
            quantity: batch.quantity,
            expiryDate: batch.expiryDate,
            daysLeft: Math.ceil((exp - now) / (1000 * 60 * 60 * 24)),
          };

          if (exp <= thirtyDays) expiringBatches30.push(batchInfo);
          else if (exp <= sixtyDays) expiringBatches60.push(batchInfo);
          else if (exp <= ninetyDays) expiringBatches90.push(batchInfo);
        }
      });
    }
  });

  const categoryDistribution = Object.values(categoryMap).sort(
    (a, b) => b.valuation - a.valuation,
  );

  res.status(200).json({
    success: true,
    data: {
      summary: {
        totalMedicines: medicines.length,
        totalStockUnits,
        totalCostValuation: Math.round(totalCostValuation),
        totalRetailValuation: Math.round(totalRetailValuation),
        inStockCount,
        lowStockCount,
        outOfStockCount,
        expiringCount30: expiringBatches30.length,
        expiringCount60: expiringBatches60.length,
        expiringCount90: expiringBatches90.length,
      },
      categoryDistribution,
      expiringBatches30,
      expiringBatches60,
      expiringBatches90,
      reorderList,
      records: medicines,
    },
  });
});

// @desc    Download or fetch FYP project and RBAC audit markdown reports
// @route   GET /api/reports/docs/:type
// @access  Public / All Devices
exports.getDocumentationReport = catchAsync(async (req, res, next) => {
  const type = req.params.type?.toLowerCase();

  let targetFilename = "PROJECT_REPORT.md";
  if (
    type === "rbac" ||
    type === "rbac-audit" ||
    type === "rbac_audit" ||
    type === "rbac-audit-report"
  ) {
    targetFilename = "RBAC_AUDIT_REPORT.md";
  }

  // Look in root directory or Frontend public directory
  const rootPath = path.resolve(__dirname, "../../..", targetFilename);
  const fallbackPath = path.resolve(
    __dirname,
    "../../../Frontend/public",
    targetFilename,
  );

  let filePath = fs.existsSync(rootPath) ? rootPath : fallbackPath;

  if (!fs.existsSync(filePath)) {
    return next(
      new AppError(
        `Documentation file ${targetFilename} not found on server`,
        404,
      ),
    );
  }

  const content = fs.readFileSync(filePath, "utf8");
  const stats = fs.statSync(filePath);

  if (req.query.download === "true") {
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${targetFilename}"`,
    );
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    return res.send(content);
  }

  res.status(200).json({
    success: true,
    data: {
      filename: targetFilename,
      sizeBytes: stats.size,
      updatedAt: stats.mtime,
      content,
    },
  });
});
