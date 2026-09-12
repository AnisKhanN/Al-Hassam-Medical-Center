import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  FiUsers,
  FiCalendar,
  FiUserPlus,
  FiSearch,
  FiCheckCircle,
  FiClock,
  FiSend,
  FiPhone,
  FiAlertCircle,
  FiCreditCard,
  FiRefreshCw,
  FiChevronRight,
  FiActivity,
  FiCheck,
  FiCpu,
  FiAward,
  FiMapPin,
  FiX,
  FiFilter,
} from "react-icons/fi";
import api from "../../api/axios";
import { sendWhatsAppNotification } from "../../api/notificationApi";
import StatusBadge from "../appointments/StatusBadge";
import PatientFormModal from "../patients/PatientFormModal";
import BookAppointmentModal from "../appointments/BookAppointmentModal";
import CreateBillModal from "../billing/CreateBillModal";
import RupeeIcon from "../common/RupeeIcon";
import AiTriageRecommender from "./AiTriageRecommender";
import SpecialistDoctorsRoster from "./SpecialistDoctorsRoster";

const SPECIALTIES = [
  "All Specialties",
  "Child Care & Pediatrics",
  "General Medicine",
  "Cardiology",
  "Gastroenterology",
  "General Surgery",
  "Gynecology & Obstetrics",
  "Ophthalmology",
];

export default function ReceptionDeskHub() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");

  // Modals and Triage UI State
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [rosterModalOpen, setRosterModalOpen] = useState(false);
  const [triagePanelOpen, setTriagePanelOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Pre-selected fields for booking
  const [bookingDoctorId, setBookingDoctorId] = useState("");
  const [bookingReason, setBookingReason] = useState("");

  const todayStr = format(new Date(), "yyyy-MM-dd");

  // Fetch today's appointments and doctors list
  const fetchReceptionData = useCallback(async () => {
    setLoading(true);
    try {
      const [apptsRes, docsRes] = await Promise.all([
        api.get("/appointments", { params: { date: todayStr, limit: 50 } }),
        api.get("/users/doctors"),
      ]);
      setAppointments(apptsRes.data?.data || []);
      setDoctors(docsRes.data?.data || []);
    } catch (err) {
      console.error("Failed to load reception desk data", err);
    } finally {
      setLoading(false);
    }
  }, [todayStr]);

  useEffect(() => {
    fetchReceptionData();
  }, [fetchReceptionData]);

  // Instant patient search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get("/patients", {
          params: { search: searchQuery.trim(), limit: 5 },
        });
        setSearchResults(res.data?.data?.patients || res.data?.data || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Compute live queue census
  const queueCensus = useMemo(() => {
    const total = appointments.length;
    const scheduled = appointments.filter(
      (a) => a.status === "Scheduled",
    ).length;
    const completed = appointments.filter(
      (a) => a.status === "Completed",
    ).length;
    const cancelled = appointments.filter(
      (a) => a.status === "Cancelled",
    ).length;
    return { total, scheduled, completed, cancelled };
  }, [appointments]);

  // Filtered doctors by selected specialty
  const filteredDoctors = useMemo(() => {
    if (selectedSpecialty === "All Specialties") return doctors;
    return doctors.filter(
      (d) =>
        (d.specialty && d.specialty.toLowerCase() === selectedSpecialty.toLowerCase()) ||
        (d.specialization && d.specialization.toLowerCase() === selectedSpecialty.toLowerCase()),
    );
  }, [doctors, selectedSpecialty]);

  // Handle fast patient creation
  const handleCreatePatient = async (values) => {
    const res = await api.post("/patients", values);
    const newPatient = res.data?.data;
    setActionSuccess(
      `Patient registered successfully: ${newPatient?.fullName || "New Patient"}`,
    );
    setTimeout(() => setActionSuccess(null), 4000);
    return res;
  };

  // Handle fast booking
  const handleBookAppointment = async (payload) => {
    await api.post("/appointments", payload);
    fetchReceptionData();
    setActionSuccess("Consultation booked and token generated!");
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Handle fast bill creation
  const handleCreateBill = async (payload) => {
    await api.post("/bills", payload);
    setActionSuccess("Invoice generated successfully!");
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Quick Check-in action
  const handleCheckIn = async (appointmentId) => {
    try {
      await api.patch(`/appointments/${appointmentId}/status`, {
        status: "Scheduled",
      });
      setActionSuccess("Patient marked as arrived in lobby!");
      setTimeout(() => setActionSuccess(null), 3000);
      fetchReceptionData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update appointment");
    }
  };

  // Send WhatsApp Token Reminder
  const handleSendReminder = async (a, tokenNumber) => {
    const patientPhone = a.patient?.phone || "03001234567";
    const dateStr = format(new Date(a.appointmentDate), "dd MMMM yyyy");
    const timeStr = format(new Date(a.appointmentDate), "hh:mm a");

    try {
      const res = await sendWhatsAppNotification({
        phone: patientPhone,
        type: "appointment",
        data: {
          patientName: a.patient?.fullName || "Patient",
          doctorName: a.doctor?.name ? `Dr. ${a.doctor.name}` : "Doctor",
          dateStr,
          timeStr,
          tokenNumber: `Token #${tokenNumber}`,
          phone: patientPhone,
        },
      });
      if (res.data?.whatsAppLink) {
        window.open(res.data.whatsAppLink, "_blank");
      }
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to trigger WhatsApp reminder",
      );
    }
  };

  // Triage recommendation routing handler
  const handleApplyTriage = (specialty, triageResult) => {
    setSelectedSpecialty(specialty);
    // Find an on-duty doctor in this specialty
    const targetDoc = doctors.find(
      (d) =>
        (d.specialty === specialty || d.specialization === specialty) &&
        (d.onDuty !== false),
    ) || doctors.find(
      (d) => d.specialty === specialty || d.specialization === specialty,
    );

    if (targetDoc) {
      setBookingDoctorId(targetDoc._id);
    }
    setBookingReason(
      triageResult?.symptomInput || `AI Triaged: ${specialty} (${triageResult?.triageLevel || "Routine"})`,
    );
    setAppointmentModalOpen(true);
    setActionSuccess(`AI Triaged to ${specialty} (Level: ${triageResult?.triageLevel || "Routine"}). Select patient to book.`);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  const handleBookWithDoctor = (doc) => {
    setBookingDoctorId(doc._id);
    setBookingReason(`OPD Consultation with ${doc.specialty || doc.specialization || "General Medicine"}`);
    setAppointmentModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {actionSuccess && (
        <div className="rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/70 p-4 text-sm font-semibold text-emerald-800 dark:text-emerald-200 shadow-md flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <FiCheckCircle
              size={18}
              className="text-emerald-600 dark:text-emerald-400"
            />
            <span>{actionSuccess}</span>
          </div>
          <button
            onClick={() => setActionSuccess(null)}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Reception Desk Command Center Hero Banner */}
      <div className="rounded-3xl border border-emerald-200/80 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50/60 via-white dark:via-slate-900 to-teal-50/40 dark:to-teal-950/20 p-6 sm:p-8 shadow-xs backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20 shrink-0">
                <FiActivity size={24} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Reception Desk Command Center
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Front-desk queue triage, AI symptom-to-specialty routing, instant token allocation, and lobby census.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* AI Patient Triage Launcher */}
            <button
              onClick={() => setTriagePanelOpen(!triagePanelOpen)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer ${
                triagePanelOpen
                  ? "bg-purple-700 text-white shadow-purple-500/30"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/20"
              }`}
            >
              <FiCpu size={16} />
              <span>{triagePanelOpen ? "Close AI Triage" : "AI Smart Triage"}</span>
            </button>

            <button
              onClick={() => {
                setBookingDoctorId("");
                setBookingReason("");
                setAppointmentModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <FiCalendar size={16} />
              <span>Book Consultation</span>
            </button>

            <button
              onClick={() => setPatientModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <FiUserPlus size={16} />
              <span>Register Patient</span>
            </button>

            <button
              onClick={() => setBillModalOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-200 px-4 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <RupeeIcon size={16} />
              <span>Collect Fee</span>
            </button>

            <button
              onClick={() => setRosterModalOpen(true)}
              className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/80 dark:bg-blue-950/60 p-2.5 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition cursor-pointer shadow-2xs font-bold text-xs flex items-center gap-1.5"
              title="View 7 Specialties Doctor Roster"
            >
              <FiUsers size={16} />
              <span className="hidden xl:inline">Specialty Roster</span>
            </button>

            <button
              onClick={fetchReceptionData}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer shadow-2xs"
              title="Refresh Queue"
            >
              <FiRefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        {/* Live Census Indicator Cards */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-slate-200/70 dark:border-slate-800/70 pt-5">
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Tokens Issued Today
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {queueCensus.total}
              </span>
              <span className="text-xs text-slate-400">Total</span>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <FiClock size={13} /> Awaiting Doctor
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-blue-700 dark:text-blue-300">
                {queueCensus.scheduled}
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400">
                In Queue
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/30 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <FiCheckCircle size={13} /> Concluded Visits
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300">
                {queueCensus.completed}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400">
                Done
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-purple-200/80 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/30 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <FiAward size={13} /> 7 Medical Specialties
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-purple-700 dark:text-purple-300">
                {doctors.length}
              </span>
              <span className="text-xs text-purple-600 dark:text-purple-400">Doctors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded AI Triage Recommender Panel (Expandable) */}
      {triagePanelOpen && (
        <div className="rounded-3xl border border-purple-200 dark:border-purple-900/60 bg-gradient-to-br from-purple-50/40 via-white dark:via-slate-900 to-indigo-50/30 dark:to-indigo-950/20 p-6 sm:p-7 shadow-lg animate-fade-in space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-purple-900/40">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
                <FiCpu size={18} />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  AI Symptom-to-Specialty Smart Triage Recommender
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Instantly categorizes walk-in patient complaints and routes them to the right specialist doctor.
                </p>
              </div>
            </div>
            <button
              onClick={() => setTriagePanelOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <FiX size={18} />
            </button>
          </div>

          <AiTriageRecommender onSelectSpecialty={handleApplyTriage} />
        </div>
      )}

      {/* Instant Patient Search & Quick Lookup Bar */}
      <div className="relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <FiSearch size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Fast Patient Lookup — search by Patient Name, MRN ID (PT-000001), or Phone (0300...)"
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown Card */}
        {searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 z-30 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl divide-y divide-slate-100 dark:divide-slate-800">
            {searchResults.map((p) => (
              <div
                key={p._id}
                className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {p.fullName}
                    </span>
                    <span className="rounded-md bg-blue-100 dark:bg-blue-950 px-2 py-0.5 text-[11px] font-mono font-bold text-blue-700 dark:text-blue-300">
                      {p.patientId}
                    </span>
                    <span className="text-xs text-slate-400">
                      {p.gender}, {p.age ? `${p.age} yrs` : "Age N/A"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>Phone: {p.phone}</span>
                    {p.cnic && <span>• CNIC: {p.cnic}</span>}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setBookingReason(`Consultation for ${p.fullName}`);
                      setAppointmentModalOpen(true);
                      setSearchResults([]);
                    }}
                    className="flex items-center gap-1 rounded-lg bg-blue-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-blue-700 transition"
                  >
                    <span>Book Token</span>
                  </button>
                  <Link
                    to={`/patients/${p._id}`}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    <span>View Record</span>
                    <FiChevronRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Live Patient Queue Table + Doctors On-Duty Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7">
        {/* Today's Live Queue Table (2 Columns) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-7 shadow-xs backdrop-blur-md">
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                <FiUsers className="text-blue-600 dark:text-blue-400" />
                <span>Today&apos;s Live Patient Queue</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time lobby waiting list sorted by arrival sequence and assigned tokens.
              </p>
            </div>
            <Link
              to="/appointments"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-center"
            >
              <span>Full Calendar</span>
              <FiChevronRight size={14} />
            </Link>
          </div>

          {appointments.length === 0 ? (
            <div className="py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
                <FiCalendar size={24} />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                No appointments booked for today yet.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Click &ldquo;+ Book Consultation&rdquo; above to issue the first token of the day.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3.5 pl-3">Token</th>
                    <th className="py-3.5 px-3">Patient</th>
                    <th className="py-3.5 px-3">Specialist Doctor</th>
                    <th className="py-3.5 px-3">Time</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 pr-3 text-right">Quick Desk Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {appointments.map((a, idx) => {
                    const tokenNum = String(idx + 1).padStart(2, "0");
                    const isScheduled = a.status === "Scheduled";
                    const doc = a.doctor || {};
                    const specialtyName = a.specialty || doc.specialty || doc.specialization || "General Medicine";

                    return (
                      <tr
                        key={a._id}
                        className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors"
                      >
                        <td className="py-4 pl-3 font-mono font-black text-xs text-slate-800 dark:text-slate-200">
                          <span className="inline-flex items-center justify-center h-7 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-900/60">
                            #{tokenNum}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <Link
                            to={`/patients/${a.patient?._id}`}
                            className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
                          >
                            {a.patient?.fullName || "Patient"}
                          </Link>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {a.patient?.patientId}
                          </p>
                        </td>
                        <td className="py-4 px-3">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            Dr. {doc.name || "Practitioner"}
                          </div>
                          <span className="inline-block text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-900/40">
                            {specialtyName}
                          </span>
                        </td>
                        <td className="py-4 px-3 font-mono text-xs text-slate-500">
                          {format(new Date(a.appointmentDate), "hh:mm a")}
                        </td>
                        <td className="py-4 px-3">
                          <StatusBadge status={a.status} />
                        </td>
                        <td className="py-4 pr-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isScheduled && (
                              <button
                                onClick={() => handleCheckIn(a._id)}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1.5 text-xs font-bold transition active:scale-95 cursor-pointer"
                                title="Mark Patient as Arrived in Lobby"
                              >
                                <FiCheck size={12} />
                                <span>Checked In</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleSendReminder(a, tokenNum)}
                              className="rounded-lg p-2 text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600 transition cursor-pointer"
                              title="Send WhatsApp Token Reminder"
                            >
                              <FiSend size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Doctors On-Duty Roster Filterable by 7 Medical Specialties (1 Column) */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-7 shadow-xs backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Specialist Doctors</span>
              </h3>
              <p className="text-xs text-slate-400">
                Al-Hassam Medical Center (Sanghar)
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
              {filteredDoctors.length} Available
            </span>
          </div>

          {/* Specialty Filter Dropdown */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1">
              <FiFilter size={11} /> Filter by Medical Specialty
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {SPECIALTIES.map((spec) => (
                <option key={spec} value={spec} className="dark:bg-slate-900">
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Filtered Doctor Cards */}
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredDoctors.map((doc) => {
              const docQueueCount = appointments.filter(
                (a) => (a.doctor?._id === doc._id || a.doctor === doc._id) && a.status === "Scheduled",
              ).length;
              const isOnDuty = doc.onDuty !== false;

              return (
                <div
                  key={doc._id}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-3.5 transition hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-2xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs shadow-2xs shrink-0">
                        Dr
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                          Dr. {doc.name}
                        </h4>
                        <span className="inline-block mt-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-2 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-900/60">
                          {doc.specialty || doc.specialization || "General OPD"}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                        isOnDuty
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isOnDuty ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                        }`}
                      />
                      {isOnDuty ? "On Duty" : "Off Duty"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200/50 dark:border-slate-700/50 pt-2 font-medium">
                    <span className="flex items-center gap-1">
                      <FiMapPin size={11} className="text-slate-400" />
                      {doc.roomNumber || "Suite 01"}
                    </span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      ₨ {Number(doc.consultationFee || 1500).toLocaleString()}
                    </span>
                    <span className="rounded-full bg-blue-50 dark:bg-blue-950 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 font-mono">
                      {docQueueCount} queued
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookWithDoctor(doc)}
                    className="w-full rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 py-1.5 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FiCalendar size={12} />
                    <span>Book Token with Dr. {doc.name.split(" ")[0]}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Embedded Modals for Fast Action */}
      <PatientFormModal
        isOpen={patientModalOpen}
        onClose={() => setPatientModalOpen(false)}
        onSubmit={handleCreatePatient}
      />

      <BookAppointmentModal
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        onSubmit={handleBookAppointment}
        defaultDate={new Date()}
        defaultDoctorId={bookingDoctorId}
        defaultReason={bookingReason}
      />

      <CreateBillModal
        isOpen={billModalOpen}
        onClose={() => setBillModalOpen(false)}
        onSubmit={handleCreateBill}
      />

      {/* 7 Medical Specialties Roster Modal */}
      {rosterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
                  <FiUsers size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Al-Hassam Medical Center — 7 Medical Specialties Roster
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Live doctor availability, OPD suites, visiting days, and referral routing.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRosterModalOpen(false)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <FiX size={18} />
              </button>
            </div>

            <SpecialistDoctorsRoster
              onSelectDoctor={(doc) => {
                setRosterModalOpen(false);
                handleBookWithDoctor(doc);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
