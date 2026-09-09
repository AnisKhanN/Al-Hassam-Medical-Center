const Bill = require("../models/Bill");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const generateBillId = require("../utils/generateBillId");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const withRefs = (query) =>
  query
    .populate("patient", "fullName patientId phone")
    .populate("appointment", "appointmentId appointmentDate");

// @desc    Generate a new bill
// @route   POST /api/bills
// @access  Private/Admin,Receptionist
exports.createBill = catchAsync(async (req, res, next) => {
  const { patient, appointment, items, discount, notes } = req.body;

  if (!patient) return next(new AppError("Patient is required", 400));
  if (!Array.isArray(items) || items.length === 0) {
    return next(new AppError("At least one bill item is required", 400));
  }
  for (const item of items) {
    if (
      !item.description ||
      item.unitPrice === undefined ||
      item.unitPrice < 0
    ) {
      return next(
        new AppError(
          "Each item needs a description and a valid unit price",
          400,
        ),
      );
    }
  }

  const patientDoc = await Patient.findOne({ _id: patient, clinicId: req.user.clinicId, isActive: true });
  if (!patientDoc)
    return next(new AppError("Patient not found or inactive", 404));

  if (appointment) {
    const apptDoc = await Appointment.findOne({ _id: appointment, clinicId: req.user.clinicId });
    if (!apptDoc) return next(new AppError("Appointment not found", 404));
    if (String(apptDoc.patient) !== patient) {
      return next(
        new AppError("Appointment does not belong to this patient", 400),
      );
    }
  }

  const billId = await generateBillId(req.user.clinicId);
  const bill = new Bill({
    clinicId: req.user.clinicId,
    billId,
    patient,
    appointment: appointment || undefined,
    items,
    discount: discount || 0,
    notes,
    createdBy: req.user.id,
  });
  bill.recalculate();
  await bill.save();

  const populated = await withRefs(Bill.findOne({ _id: bill._id, clinicId: req.user.clinicId }));
  res.status(201).json({ success: true, data: populated });
});

// @desc    List bills — filter by patient, status, date range, or billId search
// @route   GET /api/bills?patient=&status=&search=&dateFrom=&dateTo=&page=&limit=
// @access  Private/Admin,Receptionist
exports.getBills = catchAsync(async (req, res) => {
  const { patient, status, search, dateFrom, dateTo } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const filter = { clinicId: req.user.clinicId };
  if (patient) filter.patient = patient;
  if (status) filter.status = status;
  if (search) filter.billId = new RegExp(search.trim(), "i");
  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
    if (dateTo) filter.createdAt.$lte = new Date(dateTo);
  }

  const [bills, total] = await Promise.all([
    withRefs(Bill.find(filter)).sort("-createdAt").skip(skip).limit(limit),
    Bill.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: bills.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: bills,
  });
});

// @desc    Get a single bill with full payment history
// @route   GET /api/bills/:id
// @access  Private/Admin,Receptionist
exports.getBillById = catchAsync(async (req, res, next) => {
  const bill = await Bill.findOne({ _id: req.params.id, clinicId: req.user.clinicId })
    .populate("patient", "fullName patientId phone address")
    .populate("appointment", "appointmentId appointmentDate reason")
    .populate("createdBy", "name")
    .populate("payments.receivedBy", "name");

  if (!bill) return next(new AppError("Bill not found", 404));
  res.status(200).json({ success: true, data: bill });
});

// @desc    Record a payment against a bill
// @route   POST /api/bills/:id/payments
// @access  Private/Admin,Receptionist
exports.recordPayment = catchAsync(async (req, res, next) => {
  const { amount, method, reference } = req.body;
  if (!amount || amount <= 0)
    return next(new AppError("A valid payment amount is required", 400));

  const bill = await Bill.findOne({ _id: req.params.id, clinicId: req.user.clinicId });
  if (!bill) return next(new AppError("Bill not found", 404));
  if (bill.status === "Cancelled")
    return next(new AppError("Cannot record payment on a cancelled bill", 400));
  if (bill.balanceDue <= 0)
    return next(new AppError("This bill is already fully paid", 400));
  if (amount > bill.balanceDue) {
    return next(
      new AppError(`Payment exceeds balance due (Rs. ${bill.balanceDue})`, 400),
    );
  }

  bill.payments.push({
    amount,
    method: method || "Cash",
    reference,
    receivedBy: req.user.id,
  });
  bill.recalculate();
  await bill.save();

  const populated = await Bill.findOne({ _id: bill._id, clinicId: req.user.clinicId })
    .populate("patient", "fullName patientId")
    .populate("payments.receivedBy", "name");
  res.status(201).json({ success: true, data: populated });
});

// @desc    Cancel a bill (only if no payments have been recorded yet)
// @route   PATCH /api/bills/:id/cancel
// @access  Private/Admin
exports.cancelBill = catchAsync(async (req, res, next) => {
  const bill = await Bill.findOne({ _id: req.params.id, clinicId: req.user.clinicId });
  if (!bill) return next(new AppError("Bill not found", 404));
  if (bill.status === "Cancelled")
    return next(new AppError("Bill is already cancelled", 400));
  if (bill.amountPaid > 0) {
    return next(
      new AppError(
        "Cannot cancel a bill with recorded payments — this needs a refund process instead",
        400,
      ),
    );
  }

  bill.status = "Cancelled";
  await bill.save();
  res
    .status(200)
    .json({ success: true, message: "Bill cancelled", data: bill });
});

// @desc    Revenue dashboard — collected revenue by day, breakdown by method, outstanding balance
// @route   GET /api/bills/revenue?dateFrom=&dateTo=
// @access  Private/Admin,Receptionist
exports.getRevenueSummary = catchAsync(async (req, res) => {
  const dateTo = req.query.dateTo ? new Date(req.query.dateTo) : new Date();
  const dateFrom = req.query.dateFrom
    ? new Date(req.query.dateFrom)
    : new Date(dateTo.getFullYear(), dateTo.getMonth(), 1); // defaults to start of current month

  const [dailyRevenue, byMethod, outstanding] = await Promise.all([
    // Revenue is what was actually collected (payments), not what was billed —
    // billed-but-unpaid isn't revenue yet.
    Bill.aggregate([
      { $match: { clinicId: req.user.clinicId, status: { $ne: "Cancelled" } } },
      { $unwind: "$payments" },
      { $match: { "payments.date": { $gte: dateFrom, $lte: dateTo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$payments.date" },
          },
          total: { $sum: "$payments.amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Bill.aggregate([
      { $match: { clinicId: req.user.clinicId, status: { $ne: "Cancelled" } } },
      { $unwind: "$payments" },
      { $match: { "payments.date": { $gte: dateFrom, $lte: dateTo } } },
      {
        $group: {
          _id: "$payments.method",
          total: { $sum: "$payments.amount" },
        },
      },
    ]),
    Bill.aggregate([
      { $match: { clinicId: req.user.clinicId, status: { $in: ["Unpaid", "Partially Paid"] } } },
      {
        $group: {
          _id: null,
          totalOutstanding: { $sum: "$balanceDue" },
          billCount: { $sum: 1 },
        },
      },
    ]),
  ]);

  const totalCollected = dailyRevenue.reduce((sum, d) => sum + d.total, 0);

  res.status(200).json({
    success: true,
    data: {
      range: { from: dateFrom, to: dateTo },
      totalCollected,
      dailyRevenue, // [{ _id: '2026-08-20', total: 4500 }, ...] — feed directly into a chart
      byMethod, // [{ _id: 'Cash', total: 3000 }, { _id: 'Card', total: 1500 }]
      outstanding: outstanding[0] || { totalOutstanding: 0, billCount: 0 },
    },
  });
});
