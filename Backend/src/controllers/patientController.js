const Patient = require("../models/Patient");
const generatePatientId = require("../utils/generatePatientId");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// @desc    Register a new patient
// @route   POST /api/patients
// @access  Private/Admin,Receptionist
exports.createPatient = catchAsync(async (req, res, next) => {
  const {
    fullName: rawFullName,
    name,
    guardianName,
    cnic,
    dateOfBirth,
    age,
    gender,
    phone,
    alternatePhone,
    address,
    bloodGroup,
    allergies,
    emergencyContact,
  } = req.body;

  const fullName = rawFullName || name;

  if (!fullName || !gender || !phone) {
    return next(new AppError("Full name, gender, and phone are required", 400));
  }
  if (!dateOfBirth && age === undefined) {
    return next(new AppError("Provide either date of birth or age", 400));
  }

  // Normalize gender casing (e.g. "male" -> "Male")
  let normalizedGender = gender;
  if (gender && typeof gender === "string") {
    const trimmed = gender.trim().toLowerCase();
    if (trimmed === "male") normalizedGender = "Male";
    else if (trimmed === "female") normalizedGender = "Female";
    else if (trimmed === "other") normalizedGender = "Other";
  }

  const patientId = await generatePatientId(req.user.clinicId);

  const patient = await Patient.create({
    clinicId: req.user.clinicId,
    patientId,
    fullName,
    guardianName,
    cnic,
    dateOfBirth,
    age,
    gender: normalizedGender,
    phone,
    alternatePhone,
    address,
    bloodGroup,
    allergies,
    emergencyContact,
    registeredBy: req.user.id,
  });

  res.status(201).json({ success: true, data: patient });
});

// @desc    List patients — paginated, with optional search and filters
// @route   GET /api/patients?search=&page=&limit=&gender=&isActive=
// @access  Private/Admin,Doctor,Receptionist
exports.getPatients = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100); // cap prevents accidental huge payloads
  const skip = (page - 1) * limit;

  const filter = {
    clinicId: req.user.clinicId,
    isActive: req.query.isActive === "false" ? false : true,
  };
  if (req.query.gender) filter.gender = req.query.gender;

  if (req.query.search) {
    // Regex (not $text) so partial matches work — e.g. typing "0300" should
    // find a phone number containing it, which $text's word-tokenizing won't do.
    const regex = new RegExp(req.query.search.trim(), "i");
    filter.$or = [
      { fullName: regex },
      { phone: regex },
      { patientId: regex },
      { cnic: regex },
    ];
  }

  const [patients, total] = await Promise.all([
    Patient.find(filter).sort("-createdAt").skip(skip).limit(limit).lean(),
    Patient.countDocuments(filter),
  ]);

  const sanitizedPatients = patients.map((p) => ({
    ...p,
    computedAge: p.dateOfBirth
      ? Math.floor(
          (Date.now() - new Date(p.dateOfBirth).getTime()) /
            (1000 * 60 * 60 * 24 * 365.25),
        )
      : p.age,
  }));

  res.status(200).json({
    success: true,
    count: sanitizedPatients.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: sanitizedPatients,
  });
});

// @desc    Get one patient with full medical history
// @route   GET /api/patients/:id
// @access  Private/Admin,Doctor,Receptionist
exports.getPatientById = catchAsync(async (req, res, next) => {
  const patient = await Patient.findOne({
    _id: req.params.id,
    clinicId: req.user.clinicId,
  }).populate("medicalHistory.recordedBy", "name role");
  if (!patient) return next(new AppError("Patient not found", 404));
  res.status(200).json({ success: true, data: patient });
});

// @desc    Update demographic/contact info
// @route   PUT /api/patients/:id
// @access  Private/Admin,Receptionist
exports.updatePatient = catchAsync(async (req, res, next) => {
  // medicalHistory is deliberately excluded — it's only appended via addMedicalHistoryEntry,
  // never bulk-overwritten here, so the visit record stays trustworthy.
  const {
    fullName,
    guardianName,
    cnic,
    dateOfBirth,
    age,
    gender,
    phone,
    alternatePhone,
    address,
    bloodGroup,
    allergies,
    emergencyContact,
  } = req.body;

  const patient = await Patient.findOneAndUpdate(
    { _id: req.params.id, clinicId: req.user.clinicId },
    {
      fullName,
      guardianName,
      cnic,
      dateOfBirth,
      age,
      gender,
      phone,
      alternatePhone,
      address,
      bloodGroup,
      allergies,
      emergencyContact,
    },
    { returnDocument: "after", runValidators: true, omitUndefined: true },
  );

  if (!patient) return next(new AppError("Patient not found", 404));
  res.status(200).json({ success: true, data: patient });
});

// @desc    Archive (soft-delete) a patient
// @route   DELETE /api/patients/:id
// @access  Private/Admin
exports.deletePatient = catchAsync(async (req, res, next) => {
  const patient = await Patient.findOneAndUpdate(
    { _id: req.params.id, clinicId: req.user.clinicId },
    { isActive: false },
    { returnDocument: "after" },
  );
  if (!patient) return next(new AppError("Patient not found", 404));
  res
    .status(200)
    .json({ success: true, message: "Patient archived", data: patient });
});

// @desc    Add a visit / medical history entry
// @route   POST /api/patients/:id/history
// @access  Private/Doctor
exports.addMedicalHistoryEntry = catchAsync(async (req, res, next) => {
  const { visitType, reason, diagnosis, notes, vitals } = req.body;
  if (!reason) return next(new AppError("Visit reason is required", 400));

  const historyPayload = {
    visitType: visitType || "OPD",
    reason,
    diagnosis,
    notes,
    recordedBy: req.user.id,
  };

  if (vitals && typeof vitals === "object") {
    historyPayload.vitals = {
      bp: vitals.bp || "",
      pulse: vitals.pulse || "",
      temp: vitals.temp || "",
      weight: vitals.weight || "",
      spO2: vitals.spO2 || "",
    };
  }

  const patient = await Patient.findOneAndUpdate(
    { _id: req.params.id, clinicId: req.user.clinicId },
    {
      $push: {
        medicalHistory: historyPayload,
      },
    },
    { returnDocument: "after", runValidators: true },
  ).populate("medicalHistory.recordedBy", "name role");

  if (!patient) return next(new AppError("Patient not found", 404));
  res.status(201).json({ success: true, data: patient });
});
