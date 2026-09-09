const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const User = require("../models/User");
const generateAppointmentId = require("../utils/generateAppointmentId");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// Real overlap check, not exact-slot matching: a new [start, start+duration)
// window conflicts with any existing Scheduled appointment for the same doctor
// whose window intersects it. excludeId lets a reschedule ignore itself.
const hasConflict = async (doctorId, startTime, duration, excludeId = null, clinicId = null) => {
  const newStart = new Date(startTime);
  const newEnd = new Date(newStart.getTime() + duration * 60000);
  const query = {
    doctor: doctorId,
    status: { $ne: "Cancelled" },
    appointmentDate: { $lt: newEnd },
  };
  if (clinicId) query.clinicId = clinicId;
  if (excludeId) query._id = { $ne: excludeId };

  const candidates = await Appointment.find(query)
    .select("appointmentDate duration")
    .lean();
  return candidates.some((appt) => {
    const existingEnd = new Date(
      appt.appointmentDate.getTime() + appt.duration * 60000,
    );
    return existingEnd > newStart;
  });
};

const withRefs = (query) =>
  query.populate([
    { path: "patient", select: "fullName patientId phone" },
    { path: "doctor", select: "name" },
  ]);

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private/Admin,Receptionist
exports.createAppointment = catchAsync(async (req, res, next) => {
  const {
    patient,
    doctor,
    appointmentDate,
    duration,
    reason,
    isTelemedicine,
    meetingRoomId,
    meetingStatus,
  } = req.body;

  if (!patient || !doctor || !appointmentDate || !reason) {
    return next(
      new AppError("Patient, doctor, date/time, and reason are required", 400),
    );
  }

  const apptDate = new Date(appointmentDate);
  if (apptDate < new Date()) {
    return next(new AppError("Cannot book an appointment in the past", 400));
  }

  const [patientDoc, doctorDoc] = await Promise.all([
    Patient.findOne({ _id: patient, clinicId: req.user.clinicId, isActive: true }),
    User.findOne({ _id: doctor, clinicId: req.user.clinicId, role: "Doctor", isActive: true }),
  ]);
  if (!patientDoc)
    return next(new AppError("Patient not found or inactive", 404));
  if (!doctorDoc)
    return next(new AppError("Doctor not found or inactive", 404));

  if (await hasConflict(doctor, apptDate, duration || 30, null, req.user.clinicId)) {
    return next(
      new AppError(
        "This doctor already has an appointment in that time slot",
        409,
      ),
    );
  }

  const appointmentId = await generateAppointmentId(req.user.clinicId);
  const appointment = await Appointment.create({
    clinicId: req.user.clinicId,
    appointmentId,
    patient,
    doctor,
    appointmentDate: apptDate,
    duration: duration || 30,
    reason,
    isTelemedicine: Boolean(isTelemedicine),
    meetingRoomId: isTelemedicine
      ? meetingRoomId ||
        `tele-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`
      : null,
    meetingStatus: isTelemedicine ? meetingStatus || "Waiting" : "Scheduled",
    createdBy: req.user.id,
  });

  const populated = await withRefs(Appointment.findOne({ _id: appointment._id, clinicId: req.user.clinicId }));
  res.status(201).json({ success: true, data: populated });
});

// @desc    List appointments — filter by single day, range, doctor, patient, status
// @route   GET /api/appointments?date=&dateFrom=&dateTo=&doctor=&patient=&status=&page=&limit=
// @access  Private/Admin,Doctor,Receptionist
exports.getAppointments = catchAsync(async (req, res) => {
  const { date, dateFrom, dateTo, doctor, patient, status, isTelemedicine } =
    req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const filter = { clinicId: req.user.clinicId };
  if (doctor) filter.doctor = doctor;
  if (patient) filter.patient = patient;
  if (status) filter.status = status;
  if (isTelemedicine !== undefined) {
    filter.isTelemedicine = isTelemedicine === "true";
  }

  // Doctors are scoped to their own schedule server-side, regardless of what
  // doctor id they pass in the query — never trust the client for this.
  if (req.user.role === "Doctor") filter.doctor = req.user.id;

  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    filter.appointmentDate = { $gte: start, $lt: end };
  } else if (dateFrom || dateTo) {
    filter.appointmentDate = {};
    if (dateFrom) filter.appointmentDate.$gte = new Date(dateFrom);
    if (dateTo) filter.appointmentDate.$lte = new Date(dateTo);
  }

  const [appointments, total] = await Promise.all([
    withRefs(Appointment.find(filter))
      .sort("appointmentDate")
      .skip(skip)
      .limit(limit)
      .lean(),
    Appointment.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: appointments.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: appointments,
  });
});

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private/Admin,Doctor,Receptionist
exports.getAppointmentById = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findOne({
    _id: req.params.id,
    clinicId: req.user.clinicId,
  })
    .populate("patient", "fullName patientId phone gender")
    .populate("doctor", "name")
    .populate("createdBy", "name role")
    .lean();

  if (!appointment) return next(new AppError("Appointment not found", 404));

  if (
    req.user.role === "Doctor" &&
    String(appointment.doctor._id) !== req.user.id
  ) {
    return next(new AppError("You can only view your own appointments", 403));
  }

  res.status(200).json({ success: true, data: appointment });
});

// @desc    Reschedule / edit an appointment (date, duration, reason)
// @route   PUT /api/appointments/:id
// @access  Private/Admin,Receptionist
exports.updateAppointment = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findOne({
    _id: req.params.id,
    clinicId: req.user.clinicId,
  });
  if (!appointment) return next(new AppError("Appointment not found", 404));

  if (appointment.status !== "Scheduled") {
    return next(
      new AppError(
        `Cannot modify a ${appointment.status.toLowerCase()} appointment`,
        400,
      ),
    );
  }

  const { appointmentDate, duration, reason } = req.body;
  const newDate = appointmentDate
    ? new Date(appointmentDate)
    : appointment.appointmentDate;
  const newDuration = duration || appointment.duration;

  if (appointmentDate && newDate < new Date()) {
    return next(new AppError("Cannot reschedule to a time in the past", 400));
  }

  if (appointmentDate || duration) {
    if (
      await hasConflict(
        appointment.doctor,
        newDate,
        newDuration,
        appointment._id,
        req.user.clinicId,
      )
    ) {
      return next(
        new AppError(
          "This doctor already has an appointment in that time slot",
          409,
        ),
      );
    }
  }

  appointment.appointmentDate = newDate;
  appointment.duration = newDuration;
  if (reason) appointment.reason = reason;
  await appointment.save();

  const populated = await withRefs(Appointment.findOne({ _id: appointment._id, clinicId: req.user.clinicId }));
  res.status(200).json({ success: true, data: populated });
});

// @desc    Change status — Complete / Cancel / No-show
// @route   PATCH /api/appointments/:id/status
// @access  Private/Admin,Doctor,Receptionist (role rules enforced inside)
exports.updateAppointmentStatus = catchAsync(async (req, res, next) => {
  const { status, notes, cancelReason } = req.body;
  const validStatuses = ["Completed", "Cancelled", "No-show"];
  if (!validStatuses.includes(status)) {
    return next(
      new AppError(`Status must be one of: ${validStatuses.join(", ")}`, 400),
    );
  }

  const appointment = await Appointment.findOne({
    _id: req.params.id,
    clinicId: req.user.clinicId,
  });
  if (!appointment) return next(new AppError("Appointment not found", 404));

  if (appointment.status !== "Scheduled") {
    return next(
      new AppError(
        `Appointment is already ${appointment.status.toLowerCase()}`,
        400,
      ),
    );
  }

  // Enforce doctor ownership: A doctor can only update the status of their own appointments
  if (
    req.user.role === "Doctor" &&
    String(appointment.doctor) !== req.user.id
  ) {
    return next(
      new AppError(
        "Doctors are only permitted to update the status of their own appointments",
        403,
      ),
    );
  }

  // Only doctors mark a visit Completed — receptionists/admins do not complete clinical visits
  if (status === "Completed") {
    if (req.user.role !== "Doctor") {
      return next(
        new AppError(
          "Only the assigned doctor can mark this appointment as completed",
          403,
        ),
      );
    }
    appointment.notes = notes || appointment.notes;
  }

  if (status === "Cancelled") {
    if (!cancelReason)
      return next(new AppError("A cancellation reason is required", 400));
    appointment.cancelReason = cancelReason;
  }

  appointment.status = status;
  await appointment.save();

  const populated = await withRefs(Appointment.findOne({ _id: appointment._id, clinicId: req.user.clinicId }));
  res.status(200).json({ success: true, data: populated });
});
