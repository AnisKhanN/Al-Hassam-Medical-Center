const Medicine = require("../models/Medicine");
const Supplier = require("../models/Supplier");
const generateMedicineId = require("../utils/generateMedicineId");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const validateBatchInput = (batch) => {
  if (
    !batch.batchNumber ||
    batch.quantity === undefined ||
    batch.costPrice === undefined ||
    !batch.expiryDate
  ) {
    return "Each batch needs a batch number, quantity, cost price, and expiry date";
  }
  if (batch.quantity < 0) return "Batch quantity cannot be negative";
  if (batch.costPrice < 0) return "Batch cost price cannot be negative";
  if (new Date(batch.expiryDate) < new Date())
    return "Cannot add a batch that is already expired";
  return null;
};

exports.createMedicine = catchAsync(async (req, res, next) => {
  const {
    name,
    genericName,
    category,
    unit,
    supplier,
    unitPrice,
    reorderLevel,
    batches,
    barcode,
  } = req.body;

  if (!name || !category || unitPrice === undefined) {
    return next(
      new AppError("Name, category, and unit price are required", 400),
    );
  }
  if (unitPrice < 0)
    return next(new AppError("Unit price cannot be negative", 400));

  if (supplier) {
    const supplierDoc = await Supplier.findOne({
      _id: supplier,
      clinicId: req.user.clinicId,
      isActive: true,
    });
    if (!supplierDoc)
      return next(new AppError("Supplier not found or inactive", 404));
  }

  let initialBatches = [];
  if (batches && batches.length > 0) {
    for (const b of batches) {
      const err = validateBatchInput(b);
      if (err) return next(new AppError(err, 400));
    }
    initialBatches = batches;
  }

  const medicineId = await generateMedicineId(req.user.clinicId);
  const medicine = await Medicine.create({
    clinicId: req.user.clinicId,
    medicineId,
    barcode: barcode ? barcode.trim() : undefined,
    name,
    genericName,
    category,
    unit,
    supplier: supplier || undefined,
    unitPrice,
    reorderLevel,
    batches: initialBatches,
    createdBy: req.user.id,
  });

  const populated = await Medicine.findOne({ _id: medicine._id, clinicId: req.user.clinicId }).populate(
    "supplier",
    "name phone",
  );
  res.status(201).json({ success: true, data: populated });
});

exports.getMedicines = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const skip = (page - 1) * limit;

  const filter = {
    clinicId: req.user.clinicId,
    isActive: req.query.isActive === "false" ? false : true,
  };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.barcode) {
    filter.$or = [
      { barcode: req.query.barcode.trim() },
      { "batches.batchBarcode": req.query.barcode.trim() },
      { medicineId: req.query.barcode.trim() },
    ];
  } else if (req.query.search) {
    const regex = new RegExp(req.query.search.trim(), "i");
    filter.$or = [
      { name: regex },
      { genericName: regex },
      { medicineId: regex },
      { barcode: regex },
    ];
  }

  const [medicines, total] = await Promise.all([
    Medicine.find(filter)
      .populate("supplier", "name phone")
      .sort("name")
      .skip(skip)
      .limit(limit),
    Medicine.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: medicines.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: medicines,
  });
});

exports.getMedicineByBarcode = catchAsync(async (req, res, next) => {
  const { barcode } = req.params;
  if (!barcode) {
    return next(new AppError("Barcode is required", 400));
  }

  const cleanBarcode = barcode.trim();
  const medicine = await Medicine.findOne({
    clinicId: req.user.clinicId,
    isActive: true,
    $or: [
      { barcode: cleanBarcode },
      { "batches.batchBarcode": cleanBarcode },
      { medicineId: cleanBarcode },
    ],
  }).populate("supplier", "name phone");

  if (!medicine) {
    return next(
      new AppError(`No active medicine found with barcode or ID "${cleanBarcode}"`, 404),
    );
  }

  res.status(200).json({ success: true, data: medicine });
});

exports.getMedicineById = catchAsync(async (req, res, next) => {
  const medicine = await Medicine.findOne({
    _id: req.params.id,
    clinicId: req.user.clinicId,
  }).populate("supplier", "name phone address");
  if (!medicine) return next(new AppError("Medicine not found", 404));
  res.status(200).json({ success: true, data: medicine });
});

exports.updateMedicine = catchAsync(async (req, res, next) => {
  const {
    name,
    genericName,
    category,
    unit,
    supplier,
    unitPrice,
    reorderLevel,
    barcode,
  } = req.body;

  if (supplier) {
    const supplierDoc = await Supplier.findOne({
      _id: supplier,
      clinicId: req.user.clinicId,
      isActive: true,
    });
    if (!supplierDoc)
      return next(new AppError("Supplier not found or inactive", 404));
  }

  const medicine = await Medicine.findOneAndUpdate(
    { _id: req.params.id, clinicId: req.user.clinicId },
    { name, genericName, category, unit, supplier, unitPrice, reorderLevel, barcode },
    { returnDocument: "after", runValidators: true, omitUndefined: true },
  ).populate("supplier", "name phone");

  if (!medicine) return next(new AppError("Medicine not found", 404));
  res.status(200).json({ success: true, data: medicine });
});

exports.deleteMedicine = catchAsync(async (req, res, next) => {
  const medicine = await Medicine.findOneAndUpdate(
    { _id: req.params.id, clinicId: req.user.clinicId },
    { isActive: false },
    { returnDocument: "after" },
  );
  if (!medicine) return next(new AppError("Medicine not found", 404));
  res
    .status(200)
    .json({ success: true, message: "Medicine archived", data: medicine });
});

exports.addBatch = catchAsync(async (req, res, next) => {
  const err = validateBatchInput(req.body);
  if (err) return next(new AppError(err, 400));

  const medicine = await Medicine.findOne({
    _id: req.params.id,
    clinicId: req.user.clinicId,
  });
  if (!medicine) return next(new AppError("Medicine not found", 404));
  if (!medicine.isActive)
    return next(new AppError("Cannot restock an archived medicine", 400));

  const { batchNumber, quantity, costPrice, expiryDate, receivedDate } =
    req.body;
  medicine.batches.push({
    batchNumber,
    quantity,
    costPrice,
    expiryDate,
    receivedDate,
  });
  await medicine.save();

  const populated = await Medicine.findOne({
    _id: medicine._id,
    clinicId: req.user.clinicId,
  }).populate("supplier", "name phone");
  res.status(201).json({ success: true, data: populated });
});

exports.getCategories = catchAsync(async (req, res) => {
  const categories = await Medicine.distinct("category", {
    clinicId: req.user.clinicId,
    isActive: true,
  });
  res.status(200).json({ success: true, data: categories.sort() });
});

exports.getLowStock = catchAsync(async (req, res) => {
  const medicines = await Medicine.find({
    clinicId: req.user.clinicId,
    isActive: true,
  }).populate("supplier", "name phone");
  const lowStock = medicines.filter((m) => m.isLowStock);
  res
    .status(200)
    .json({ success: true, count: lowStock.length, data: lowStock });
});

exports.getExpiringSoon = catchAsync(async (req, res) => {
  const days = Math.max(parseInt(req.query.days, 10) || 30, 1);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + days);

  const medicines = await Medicine.find({
    clinicId: req.user.clinicId,
    isActive: true,
    "batches.quantity": { $gt: 0 },
    "batches.expiryDate": { $lte: cutoff },
  }).lean();

  const expiringBatches = [];
  medicines.forEach((m) => {
    m.batches.forEach((b) => {
      if (b.quantity > 0 && b.expiryDate <= cutoff) {
        expiringBatches.push({
          medicineId: m.medicineId,
          medicineName: m.name,
          batchId: b._id,
          batchNumber: b.batchNumber,
          quantity: b.quantity,
          expiryDate: b.expiryDate,
        });
      }
    });
  });
  expiringBatches.sort(
    (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate),
  );

  res
    .status(200)
    .json({
      success: true,
      count: expiringBatches.length,
      data: expiringBatches,
    });
});
