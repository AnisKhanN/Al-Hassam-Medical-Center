const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");

router.use(protect);

router.get(
  "/",
  authorize("Admin", "Doctor", "Receptionist", "Pharmacist"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Endpoints retrieved successfully",
      data: {
        endpoints: {
          auth: {
            login: "POST /api/auth/login",
            me: "GET /api/auth/me",
            logout: "POST /api/auth/logout",
          },
          users: {
            list: "GET /api/users",
            create: "POST /api/users",
            getById: "GET /api/users/:id",
            update: "PUT /api/users/:id",
            delete: "DELETE /api/users/:id",
          },
          patients: {
            list: "GET /api/patients",
            create: "POST /api/patients",
            getById: "GET /api/patients/:id",
            update: "PUT /api/patients/:id",
            delete: "DELETE /api/patients/:id",
            addMedicalHistory: "POST /api/patients/:id/history",
          },
          appointments: {
            list: "GET /api/appointments",
            create: "POST /api/appointments",
            getById: "GET /api/appointments/:id",
            update: "PUT /api/appointments/:id",
            delete: "DELETE /api/appointments/:id",
          },
          bills: {
            list: "GET /api/bills",
            create: "POST /api/bills",
            getById: "GET /api/bills/:id",
            update: "PUT /api/bills/:id",
          },
          sales: {
            list: "GET /api/sales",
            create: "POST /api/sales",
            getById: "GET /api/sales/:id",
          },
          medicines: {
            list: "GET /api/medicines",
            create: "POST /api/medicines",
            getById: "GET /api/medicines/:id",
            update: "PUT /api/medicines/:id",
            delete: "DELETE /api/medicines/:id",
          },
          suppliers: {
            list: "GET /api/suppliers",
            create: "POST /api/suppliers",
            getById: "GET /api/suppliers/:id",
            update: "PUT /api/suppliers/:id",
            delete: "DELETE /api/suppliers/:id",
          },
        },
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          clinicId: req.user.clinicId,
          clinicName: req.user.clinicName,
          clinicLogo: req.user.clinicLogo,
          clinicDomain: req.user.clinicDomain,
          clinicStatus: req.user.clinicStatus,
          isClinicOwner: req.user.isClinicOwner,
          profilePic: req.user.profilePic,
          isActive: req.user.isActive,
        },
      },
    });
  },
);

module.exports = router;
