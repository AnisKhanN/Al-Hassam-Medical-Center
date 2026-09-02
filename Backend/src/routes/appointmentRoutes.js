const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
    createAppointment, getAppointments, getAppointmentById,
    updateAppointment, updateAppointmentStatus,
} = require('../controllers/appointmentController');

router.use(protect);

router
    .route('/')
    .get(authorize('Admin', 'Doctor', 'Receptionist'), getAppointments)
    .post(authorize('Admin', 'Receptionist'), createAppointment);

router
    .route('/:id')
    .get(authorize('Admin', 'Doctor', 'Receptionist'), getAppointmentById)
    .put(authorize('Admin', 'Receptionist'), updateAppointment);

router.patch('/:id/status', authorize('Admin', 'Doctor', 'Receptionist'), updateAppointmentStatus);

module.exports = router;