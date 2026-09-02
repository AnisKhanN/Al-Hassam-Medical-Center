const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  addMedicalHistoryEntry,
} = require("../controllers/patientController");

router.use(protect); // every route below requires a valid session

router
  .route("/")
  .get(authorize("Admin", "Doctor", "Receptionist"), getPatients)
  .post(authorize("Admin", "Receptionist"), createPatient);

router
  .route("/:id")
  .get(authorize("Admin", "Doctor", "Receptionist"), getPatientById)
  .put(authorize("Admin", "Receptionist"), updatePatient)
  .delete(authorize("Admin"), deletePatient);

// Only doctors write clinical notes — receptionists register patients, they don't diagnose or record visits
router.post("/:id/history", authorize("Doctor"), addMedicalHistoryEntry);

module.exports = router;
