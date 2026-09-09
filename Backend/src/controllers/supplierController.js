const Supplier = require("../models/Supplier");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// @desc    Add a supplier
// @route   POST /api/suppliers
// @access  Private/Admin,Pharmacist
exports.createSupplier = catchAsync(async (req, res, next) => {
  const { name, contactPerson, phone, address } = req.body;
  if (!name) return next(new AppError("Supplier name is required", 400));

  const supplier = await Supplier.create({
    clinicId: req.user.clinicId,
    name,
    contactPerson,
    phone,
    address,
  });
  res.status(201).json({ success: true, data: supplier });
});

// @desc    List suppliers
// @route   GET /api/suppliers?search=&isActive=
// @access  Private/Admin,Pharmacist
exports.getSuppliers = catchAsync(async (req, res) => {
  const filter = {
    clinicId: req.user.clinicId,
    isActive: req.query.isActive === "false" ? false : true,
  };
  if (req.query.search) {
    filter.name = new RegExp(req.query.search.trim(), "i");
  }
  const suppliers = await Supplier.find(filter).sort("name");
  res
    .status(200)
    .json({ success: true, count: suppliers.length, data: suppliers });
});

// @desc    Get a single supplier
// @route   GET /api/suppliers/:id
// @access  Private/Admin,Pharmacist
exports.getSupplierById = catchAsync(async (req, res, next) => {
  const supplier = await Supplier.findOne({
    _id: req.params.id,
    clinicId: req.user.clinicId,
  });
  if (!supplier) return next(new AppError("Supplier not found", 404));
  res.status(200).json({ success: true, data: supplier });
});

// @desc    Update a supplier
// @route   PUT /api/suppliers/:id
// @access  Private/Admin,Pharmacist
exports.updateSupplier = catchAsync(async (req, res, next) => {
  const { name, contactPerson, phone, address } = req.body;

  const supplier = await Supplier.findOneAndUpdate(
    { _id: req.params.id, clinicId: req.user.clinicId },
    { name, contactPerson, phone, address },
    { returnDocument: "after", runValidators: true, omitUndefined: true },
  );
  if (!supplier) return next(new AppError("Supplier not found", 404));
  res.status(200).json({ success: true, data: supplier });
});

// @desc    Deactivate a supplier (soft delete)
// @route   DELETE /api/suppliers/:id
// @access  Private/Admin
exports.deactivateSupplier = catchAsync(async (req, res, next) => {
  const supplier = await Supplier.findOneAndUpdate(
    { _id: req.params.id, clinicId: req.user.clinicId },
    { isActive: false },
    { returnDocument: "after" },
  );
  if (!supplier) return next(new AppError("Supplier not found", 404));
  res
    .status(200)
    .json({ success: true, message: "Supplier deactivated", data: supplier });
});
