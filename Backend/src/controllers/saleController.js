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

  const session = await mongoose.startSession();
  let saleDoc;
  try {
    await session.withTransaction(async () => {
      const saleItems = [];

      for (const item of items) {
        const medicine = await Medicine.findOne({
          _id: item.medicine,
          isActive: true,
        }).session(session);
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

        await medicine.save({ session });

        saleItems.push({
          medicine: medicine._id,
          medicineName: medicine.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice ?? medicine.unitPrice,
          deductedFrom,
        });
      }

      const saleId = await generateSaleId();
      const sale = new Sale({
        saleId,
        items: saleItems,
        customerName,
        customerPhone,
        soldBy: req.user.id,
      });
      sale.recalculate();
      await sale.save({ session });
      saleDoc = sale;
    });
  } catch (err) {
    return next(
      err instanceof AppError
        ? err
        : new AppError(err.message || "Failed to record sale", 500),
    );
  } finally {
    session.endSession();
  }

  const populated = await Sale.findById(saleDoc._id)
    .populate("items.medicine", "medicineId name")
    .populate("soldBy", "name");
  res.status(201).json({ success: true, data: populated });
});

exports.getSales = catchAsync(async (req, res) => {
  const { status, dateFrom, dateTo } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const filter = {};
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
  const sale = await Sale.findById(req.params.id)
    .populate("items.medicine", "medicineId name")
    .populate("soldBy", "name");
  if (!sale) return next(new AppError("Sale not found", 404));
  res.status(200).json({ success: true, data: sale });
});

exports.voidSale = catchAsync(async (req, res, next) => {
  const { voidReason } = req.body;
  if (!voidReason) return next(new AppError("A void reason is required", 400));

  const sale = await Sale.findById(req.params.id);
  if (!sale) return next(new AppError("Sale not found", 404));
  if (sale.status === "Voided")
    return next(new AppError("Sale is already voided", 400));

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      for (const item of sale.items) {
        const medicine = await Medicine.findById(item.medicine).session(
          session,
        );
        if (!medicine) continue;

        item.deductedFrom.forEach(({ batchId, quantity }) => {
          const batch = medicine.batches.id(batchId);
          if (batch) batch.quantity += quantity;
        });
        await medicine.save({ session });
      }

      sale.status = "Voided";
      sale.voidReason = voidReason;
      await sale.save({ session });
    });
  } catch (err) {
    return next(
      err instanceof AppError
        ? err
        : new AppError(err.message || "Failed to void sale", 500),
    );
  } finally {
    session.endSession();
  }

  const populated = await Sale.findById(sale._id)
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

  const [dailySales, topMedicines, totals] = await Promise.all([
    Sale.aggregate([
      {
        $match: {
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
