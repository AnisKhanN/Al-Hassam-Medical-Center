const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

// In-memory registry for active WebRTC signaling rooms
// roomId -> { clients: Set<res>, participants: Map<clientId, info> }
const activeRooms = new Map();

const getOrCreateRoom = (roomId) => {
  if (!activeRooms.has(roomId)) {
    activeRooms.set(roomId, {
      clients: new Set(),
      participants: new Map(),
      createdAt: new Date(),
    });
  }
  return activeRooms.get(roomId);
};

const broadcastToRoom = (roomId, event, data, senderRes = null) => {
  const room = activeRooms.get(roomId);
  if (!room) return;

  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of room.clients) {
    if (client !== senderRes) {
      try {
        client.write(payload);
      } catch (err) {
        console.error("Failed to send SSE signal:", err.message);
      }
    }
  }
};

/**
 * @route   POST /api/telemedicine/create-room
 * @access  Private (Admin, Doctor, Receptionist)
 */
exports.createRoom = catchAsync(async (req, res, next) => {
  const { appointmentId, customRoomId } = req.body;

  let roomId = customRoomId || `tele-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
  let appointment = null;

  if (appointmentId) {
    appointment = await Appointment.findOne({
      _id: appointmentId,
      ...(req.user?.clinicId ? { clinicId: req.user.clinicId } : {}),
    })
      .populate("patient", "fullName patientId phone age gender bloodGroup medicalHistory")
      .populate("doctor", "name specialization email");

    if (!appointment) {
      return next(new AppError("Appointment not found", 404));
    }

    appointment.isTelemedicine = true;
    appointment.meetingRoomId = roomId;
    appointment.meetingStatus = "Waiting";
    await appointment.save();
  }

  getOrCreateRoom(roomId);

  res.status(201).json({
    success: true,
    data: {
      roomId,
      appointment,
      meetingUrl: `${process.env.CLIENT_URL || "http://localhost:5173"}/telemedicine/${roomId}`,
    },
  });
});

/**
 * @route   GET /api/telemedicine/room/:roomId
 * @access  Private (All Roles)
 */
exports.getRoom = catchAsync(async (req, res, next) => {
  const { roomId } = req.params;

  let appointment = await Appointment.findOne({ meetingRoomId: roomId })
    .populate("patient", "fullName patientId phone age gender bloodGroup medicalHistory")
    .populate("doctor", "name specialization email");

  const room = getOrCreateRoom(roomId);

  let sanitizedAppointment = null;
  if (appointment) {
    const isAuthorizedStaff =
      req.user && ["Admin", "Doctor", "Receptionist"].includes(req.user.role);

    if (isAuthorizedStaff) {
      // Full EHR access for attending physician and clinic staff
      sanitizedAppointment = appointment;
    } else {
      // Confidentiality filter for guest/patient participants — protect medical records & contact info
      sanitizedAppointment = {
        _id: appointment._id,
        appointmentId: appointment.appointmentId,
        appointmentDate: appointment.appointmentDate,
        duration: appointment.duration,
        reason: appointment.reason,
        meetingStatus: appointment.meetingStatus,
        status: appointment.status,
        isTelemedicine: appointment.isTelemedicine,
        doctor: appointment.doctor
          ? {
              _id: appointment.doctor._id,
              name: appointment.doctor.name,
              specialization: appointment.doctor.specialization,
            }
          : null,
        patient: appointment.patient
          ? {
              fullName: appointment.patient.fullName,
              patientId: appointment.patient.patientId,
              age: appointment.patient.age,
              gender: appointment.patient.gender,
            }
          : null,
      };
    }
  }

  res.status(200).json({
    success: true,
    data: {
      roomId,
      appointment: sanitizedAppointment,
      activeParticipantsCount: room.clients.size,
      status: appointment?.meetingStatus || "Active",
    },
  });
});

/**
 * @route   GET /api/telemedicine/room/:roomId/events (SSE Real-time Signaling)
 * @access  Private / Public-with-token (All logged-in or invited participants)
 */
exports.roomEvents = (req, res) => {
  const { roomId } = req.params;
  const clientId = `client-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const user = req.user || { name: "Patient Participant", role: "Patient" };

  // Set SSE headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no", // disable nginx proxy buffering if any
  });
  res.write("\n");

  const room = getOrCreateRoom(roomId);
  room.clients.add(res);
  room.participants.set(clientId, {
    clientId,
    id: user._id || clientId,
    name: user.name,
    role: user.role,
  });

  // Notify new client of successful connection
  res.write(
    `event: connected\ndata: ${JSON.stringify({
      clientId,
      roomId,
      participantsCount: room.clients.size,
    })}\n\n`,
  );

  // Broadcast to other peers that a new participant joined
  broadcastToRoom(
    roomId,
    "peer-joined",
    {
      clientId,
      name: user.name,
      role: user.role,
      participantsCount: room.clients.size,
    },
    res,
  );

  // Keep-alive heartbeat every 25 seconds
  const heartbeat = setInterval(() => {
    try {
      res.write(": keepalive\n\n");
    } catch (e) {
      clearInterval(heartbeat);
    }
  }, 25000);

  // Clean up on disconnect
  req.on("close", () => {
    clearInterval(heartbeat);
    room.clients.delete(res);
    room.participants.delete(clientId);

    broadcastToRoom(roomId, "peer-left", {
      clientId,
      name: user.name,
      participantsCount: room.clients.size,
    });

    if (room.clients.size === 0) {
      setTimeout(() => {
        if (room.clients.size === 0) {
          activeRooms.delete(roomId);
        }
      }, 300000); // 5 min idle room cleanup
    }
  });
};

/**
 * @route   POST /api/telemedicine/room/:roomId/signal
 * @access  Private (All participants)
 */
exports.sendSignal = catchAsync(async (req, res, next) => {
  const { roomId } = req.params;
  const { signalType, payload, senderId } = req.body;

  if (!signalType || !payload) {
    return next(new AppError("Signal type and payload are required", 400));
  }

  const room = activeRooms.get(roomId);
  if (!room) {
    return next(new AppError("Telemedicine room not found or expired", 404));
  }

  broadcastToRoom(
    roomId,
    "signal",
    {
      signalType,
      payload,
      senderId: senderId || req.user?._id,
      senderName: req.user?.name || "Participant",
      senderRole: req.user?.role || "User",
      timestamp: new Date().toISOString(),
    },
    res, // don't echo back to the sender
  );

  res.status(200).json({ success: true });
});

/**
 * @route   POST /api/telemedicine/room/:roomId/end
 * @access  Private (Admin, Doctor)
 */
exports.endConsultation = catchAsync(async (req, res, next) => {
  const { roomId } = req.params;
  const { clinicalNotes, vitals, prescription } = req.body;

  const appointment = await Appointment.findOne({ meetingRoomId: roomId });

  if (appointment) {
    if (
      req.user.role === "Doctor" &&
      String(appointment.doctor) !== String(req.user.id)
    ) {
      return next(
        new AppError(
          "Doctors are only permitted to conclude their own consultations",
          403,
        ),
      );
    }

    appointment.status = "Completed";
    appointment.meetingStatus = "Completed";
    if (clinicalNotes) {
      appointment.notes = clinicalNotes;
    }
    await appointment.save();

    // If clinical notes or vitals provided, append to patient medical history
    if (appointment.patient && (clinicalNotes || vitals || prescription)) {
      await Patient.findOneAndUpdate(
        {
          _id: appointment.patient,
          ...(appointment.clinicId ? { clinicId: appointment.clinicId } : {}),
        },
        {
          $push: {
            medicalHistory: {
              visitDate: new Date(),
              visitType: "Telemedicine Video Consultation",
              doctor: req.user._id,
              reason: appointment.reason || "Virtual Follow-up",
              notes: clinicalNotes || "Virtual video consultation completed.",
              vitals: vitals || {},
              prescribedMedicines: prescription || [],
            },
          },
        },
      );
    }
  }

  broadcastToRoom(roomId, "room-ended", {
    message: "Consultation has concluded by the attending physician.",
    endedBy: req.user?.name,
    timestamp: new Date().toISOString(),
  });

  res.status(200).json({
    success: true,
    message: "Telemedicine consultation concluded successfully.",
    data: appointment,
  });
});
