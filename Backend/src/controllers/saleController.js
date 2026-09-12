const mongoose = require("mongoose");
const Sale = require("../models/Sale");
const Medicine = require("../models/Medicine");
const generateSaleId = require("../utils/generateSaleId");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const deductFEFO = (medicine, quantity) => {
  if (!medicine.batches || !Array.isArray(medicine.batches)) return null;
  const available = medicine.batches
    .filter((b) => b.quantity > 0)
    .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

  const totalAvailable = available.reduce((sum, b) => sum + b.quantity, 0);
  if (totalAvailable < quantity) return null;

  let remaining = quantity;
  const deductedFrom = [];
  for (const batch of available) {
    if (remaining <= 0) break;
    const take = Math.min(batch.quantity, remaining);
    batch.quantity -= take;
    remaining -= take;
    deductedFrom.push({ batchId: batch._id, quantity: take });
  }
  return deductedFrom;
};

exports.createSale = catchAsync(async (req, res, next) => {
  const { items, customerName, customerPhone } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return next(new AppError("At least one sale item is required", 400));
  }
  for (const item of items) {
    if (!item.medicine || !item.quantity || item.quantity <= 0) {
      return next(
        new AppError(
          "Each item needs a medicine and a quantity greater than zero",
          400,
        ),
      );
    }
  }

  let saleDoc;
  const performSale = async (sess) => {
    const saleItems = [];

    for (const item of items) {
      const query = Medicine.findOne({
        _id: item.medicine,
        clinicId: req.user.clinicId,
        isActive: true,
      });
      if (sess) query.session(sess);
      const medicine = await query;
      if (!medicine)
        throw new AppError(
          `Medicine ${item.medicine} not found or inactive`,
          404,
        );

      const deductedFrom = deductFEFO(medicine, item.quantity);
      if (!deductedFrom) {
        throw new AppError(
          `Insufficient stock for ${medicine.name} (requested ${item.quantity}, available ${medicine.totalStock})`,
          409,
        );
      }

      await medicine.save(sess ? { session: sess } : undefined);

      saleItems.push({
        medicine: medicine._id,
        medicineName: medicine.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice ?? medicine.unitPrice,
        deductedFrom,
      });
    }

    const saleId = await generateSaleId(req.user.clinicId);
    const sale = new Sale({
      clinicId: req.user.clinicId,
      saleId,
      items: saleItems,
      customerName,
      customerPhone,
      soldBy: req.user.id,
    });
    sale.recalculate();
    await sale.save(sess ? { session: sess } : undefined);
    saleDoc = sale;
  };

  const session = await mongoose.startSession().catch(() => null);
  try {
    if (session) {
      try {
        await session.withTransaction(async () => {
          await performSale(session);
        });
      } catch (txnErr) {
        if (/replica set/i.test(txnErr.message) || /transaction numbers/i.test(txnErr.message)) {
          await performSale(null);
        } else {
          throw txnErr;
        }
      }
    } else {
      await performSale(null);
    }
  } catch (err) {
    return next(
      err instanceof AppError
        ? err
        : new AppError(err.message || "Failed to record sale", 500),
    );
  } finally {
    if (session) session.endSession();
  }

  const populated = await Sale.findOne({ _id: saleDoc._id, clinicId: req.user.clinicId })
    .populate("items.medicine", "medicineId name")
    .populate("soldBy", "name");
  res.status(201).json({ success: true, data: populated });
});

exports.getSales = catchAsync(async (req, res) => {
  const { status, dateFrom, dateTo } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const skip = (page - 1) * limit;

  const filter = { clinicId: req.user.clinicId };
  if (status) filter.status = status;
  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
    if (dateTo) filter.createdAt.$lte = new Date(dateTo);
  }

  const [sales, total] = await Promise.all([
    Sale.find(filter)
      .populate("soldBy", "name")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit),
    Sale.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: sales.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: sales,
  });
});

exports.getSaleById = catchAsync(async (req, res, next) => {
  const sale = await Sale.findOne({ _id: req.params.id, clinicId: req.user.clinicId })
    .populate("items.medicine", "medicineId name")
    .populate("soldBy", "name");
  if (!sale) return next(new AppError("Sale not found", 404));
  res.status(200).json({ success: true, data: sale });
});

exports.voidSale = catchAsync(async (req, res, next) => {
  const { voidReason } = req.body;
  if (!voidReason) return next(new AppError("A void reason is required", 400));

  const sale = await Sale.findOne({ _id: req.params.id, clinicId: req.user.clinicId });
  if (!sale) return next(new AppError("Sale not found", 404));
  if (sale.status === "Voided")
    return next(new AppError("Sale is already voided", 400));

  const performVoid = async (sess) => {
    for (const item of sale.items) {
      const query = Medicine.findOne({
        _id: item.medicine,
        clinicId: req.user.clinicId,
      });
      if (sess) query.session(sess);
      const medicine = await query;
      if (!medicine) continue;

      item.deductedFrom.forEach(({ batchId, quantity }) => {
        const batch = medicine.batches.id(batchId);
        if (batch) batch.quantity += quantity;
      });
      await medicine.save(sess ? { session: sess } : undefined);
    }

    sale.status = "Voided";
    sale.voidReason = voidReason;
    await sale.save(sess ? { session: sess } : undefined);
  };

  const session = await mongoose.startSession().catch(() => null);
  try {
    if (session) {
      try {
        await session.withTransaction(async () => {
          await performVoid(session);
        });
      } catch (txnErr) {
        if (/replica set/i.test(txnErr.message) || /transaction numbers/i.test(txnErr.message)) {
          await performVoid(null);
        } else {
          throw txnErr;
        }
      }
    } else {
      await performVoid(null);
    }
  } catch (err) {
    return next(
      err instanceof AppError
        ? err
        : new AppError(err.message || "Failed to void sale", 500),
    );
  } finally {
    if (session) session.endSession();
  }

  const populated = await Sale.findOne({ _id: sale._id, clinicId: req.user.clinicId })
    .populate("items.medicine", "medicineId name")
    .populate("soldBy", "name");
  res.status(200).json({
    success: true,
    message: "Sale voided and stock restored",
    data: populated,
  });
});

// @desc    Daily sales trend + top medicines — powers the Pharmacy dashboard chart
// @route   GET /api/sales/summary?dateFrom=&dateTo=
// @access  Private/Admin,Pharmacist
exports.getSalesSummary = catchAsync(async (req, res) => {
  const dateTo = req.query.dateTo ? new Date(req.query.dateTo) : new Date();
  const dateFrom = req.query.dateFrom
    ? new Date(req.query.dateFrom)
    : new Date(dateTo.getFullYear(), dateTo.getMonth(), 1);

  const clinicObjectId = new mongoose.Types.ObjectId(req.user.clinicId);

  const [dailySales, topMedicines, totals] = await Promise.all([
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
          total: { $sum: "$totalAmount" },
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
      { $limit: 5 },
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
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          saleCount: { $sum: 1 },
        },
      },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      range: { from: dateFrom, to: dateTo },
      totalRevenue: totals[0]?.totalRevenue || 0,
      saleCount: totals[0]?.saleCount || 0,
      dailySales,
      topMedicines,
    },
  });
});
