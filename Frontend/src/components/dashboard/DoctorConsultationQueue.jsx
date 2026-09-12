import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiVideo,
  FiFileText,
  FiRefreshCw,
  FiArrowRight,
  FiActivity,
  FiUserCheck,
  FiPhone,
  FiCpu,
  FiAward,
  FiMapPin,
  FiCalendar,
  FiX,
  FiToggleLeft,
  FiToggleRight,
  FiShield,
} from "react-icons/fi";
import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import StatusBadge from "../appointments/StatusBadge";
import AiClinicalCoPilot from "./AiClinicalCoPilot";
import SpecialistDoctorsRoster from "./SpecialistDoctorsRoster";
import SpecialistClinicalSuite from "./SpecialistClinicalSuite";

export default function DoctorConsultationQueue() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all" | "waiting" | "in-consultation" | "telemedicine" | "completed"
  const [updatingId, setUpdatingId] = useState(null);

  // Specialist Clinical Tools State
  const [specialistSuiteOpen, setSpecialistSuiteOpen] = useState(true);
  const [selectedPatientForSuite, setSelectedPatientForSuite] = useState(null);

  // AI Co-Pilot & Colleague Roster Modals
  const [coPilotOpen, setCoPilotOpen] = useState(false);
  const [selectedApptForAi, setSelectedApptForAi] = useState(null);
  const [rosterModalOpen, setRosterModalOpen] = useState(false);
  const [dutyStatus, setDutyStatus] = useState(user?.onDuty ?? true);
  const [togglingDuty, setTogglingDuty] = useState(false);

  const todayStr = format(new Date(), "yyyy-MM-dd");

  const fetchDoctorQueue = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/appointments", {
        params: { date: todayStr, limit: 50 },
      });
      setAppointments(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load doctor consultation queue", err);
    } finally {
      setLoading(false);
    }
  }, [todayStr]);

  useEffect(() => {
    fetchDoctorQueue();
  }, [fetchDoctorQueue]);

  useEffect(() => {
    if (user?.onDuty !== undefined) {
      setDutyStatus(user.onDuty);
    }
  }, [user]);

  const handleToggleDuty = async () => {
    if (!user?._id && !user?.id) return;
    setTogglingDuty(true);
    try {
      const res = await api.patch(`/users/${user._id || user.id}/duty`);
      setDutyStatus(res.data?.data?.onDuty);
    } catch (err) {
      console.error("Failed to toggle duty status", err);
    } finally {
      setTogglingDuty(false);
    }
  };

  const handleUpdateStatus = async (apptId, newStatus) => {
    setUpdatingId(apptId);
    try {
      await api.patch(`/appointments/${apptId}/status`, { status: newStatus });
      await fetchDoctorQueue();
    } catch (err) {
      console.error("Failed to update appointment status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenAiCoPilot = (appt = null) => {
    setSelectedApptForAi(appt);
    setCoPilotOpen(true);
  };

  const filteredAppointments = appointments.filter((appt) => {
    if (filter === "waiting") return appt.status === "Scheduled";
    if (filter === "in-consultation") return appt.status === "In Consultation";
    if (filter === "completed") return appt.status === "Completed";
    if (filter === "telemedicine")
      return (
        appt.type === "telemedicine" ||
        appt.appointmentType === "telemedicine" ||
        appt.telemedicine?.isTelemedicine
      );
    return true;
  });

  const waitingCount = appointments.filter((a) => a.status === "Scheduled").length;
  const inConsultCount = appointments.filter((a) => a.status === "In Consultation").length;
  const completedCount = appointments.filter((a) => a.status === "Completed").length;

  return (
    <div className="space-y-6">
      {/* Doctor Specialty & Consultation Header Card */}
      <div className="rounded-3xl border border-blue-200/80 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/70 via-white dark:via-slate-900 to-indigo-50/40 dark:to-indigo-950/30 p-6 sm:p-8 shadow-xs backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Doctor Specialty Details */}
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 shrink-0">
              <FiActivity size={26} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Dr. {user?.name || "Practitioner"} — Clinical Workstation
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-3 py-0.5 text-xs font-bold border border-blue-200 dark:border-blue-800">
                  <FiAward size={13} />
                  {user?.specialty || user?.specialization || "General Medicine"}
                </span>
                <button
                  onClick={handleToggleDuty}
                  disabled={togglingDuty}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-bold border transition cursor-pointer ${
                    dutyStatus
                      ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700"
                  }`}
                  title="Click to toggle your live On-Duty status for OPD receptionist booking"
                >
                  {dutyStatus ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>On-Duty</span>
                      <FiToggleRight size={15} />
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 rounded-full bg-slate-400" />
                      <span>Off-Duty</span>
                      <FiToggleLeft size={15} />
                    </>
                  )}
                </button>
              </div>

              {/* Practice metadata chips */}
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <FiMapPin size={13} className="text-blue-600 dark:text-blue-400" />
                  OPD Room: <strong>{user?.roomNumber || "Consultation Suite 02"}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <FiCalendar size={13} className="text-emerald-600 dark:text-emerald-400" />
                  Visiting Days: <strong>{user?.visitingDays || "Mon - Sat (24/7 Emergency Support)"}</strong>
                </span>
                {user?.consultationFee && (
                  <>
                    <span>•</span>
                    <span>
                      Fee: <strong>₨ {user.consultationFee.toLocaleString()}</strong>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Clinical Launchers */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Embedded Specialist Clinical Suite Launcher */}
            <button
              onClick={() => setSpecialistSuiteOpen(!specialistSuiteOpen)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-3.5 py-2.5 text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <FiAward size={16} />
              <span>{specialistSuiteOpen ? "Clinical Tools Active" : "Open Clinical Tools"}</span>
            </button>

            {/* Embedded AI Clinical Co-Pilot Launcher */}
            <button
              onClick={() => handleOpenAiCoPilot(null)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-3.5 py-2.5 text-xs font-bold shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <FiCpu size={16} />
              <span>AI Clinical Co-Pilot</span>
            </button>

            {/* Specialist Colleagues Roster */}
            <button
              onClick={() => setRosterModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 px-3.5 py-2.5 text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              <FiUsers size={15} />
              <span>7 Specialties Roster</span>
            </button>

            <button
              onClick={fetchDoctorQueue}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer shadow-2xs"
            >
              <FiRefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <Link
              to="/appointments"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2.5 text-xs font-bold shadow-md shadow-blue-500/20 transition hover:scale-[1.02] active:scale-95"
            >
              <span>Calendar</span>
              <FiArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Live Queue Summary Chips */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-slate-200/70 dark:border-slate-800/70 pt-5">
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Today
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {appointments.length}
              </span>
              <span className="text-xs text-slate-400">Patients</span>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/30 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <FiClock size={13} /> Waiting in OPD
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-400">
                {waitingCount}
              </span>
              <span className="text-xs text-amber-600 dark:text-amber-500">In Queue</span>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
              <FiActivity size={13} /> In Consultation
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-blue-700 dark:text-blue-400">
                {inConsultCount}
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-500">Active</span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/30 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <FiCheckCircle size={13} /> Completed Visits
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400">
                {completedCount}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-500">Done</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7 Specialist Medical Disciplines Clinical Suite */}
      {specialistSuiteOpen && (
        <SpecialistClinicalSuite
          currentDoctorSpecialty={user?.specialty || user?.specialization || "General Medicine"}
          activePatient={selectedPatientForSuite || filteredAppointments[0]?.patientId || filteredAppointments[0]?.patient}
          activeAppointment={filteredAppointments[0]}
        />
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
        {[
          { id: "all", label: `All Patients (${appointments.length})` },
          { id: "waiting", label: `Waiting (${waitingCount})` },
          { id: "in-consultation", label: `In Consultation (${inConsultCount})` },
          { id: "telemedicine", label: "Telemedicine" },
          { id: "completed", label: `Completed (${completedCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filter === tab.id
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Patient Queue List */}
      {loading ? (
        <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 dark:border-blue-950 border-t-blue-600" />
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Updating doctor consultation queue...
          </p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-3">
            <FiUserCheck size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Queue Clear for this View
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            There are no patients matching the selected filter. New patients checked in by reception will appear in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredAppointments.map((appt, idx) => {
            const patient = appt.patientId || appt.patient || {};
            const isTelemedicine =
              appt.type === "telemedicine" ||
              appt.appointmentType === "telemedicine" ||
              appt.telemedicine?.isTelemedicine;

            return (
              <div
                key={appt._id}
                className="group flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-900 transition-all duration-200"
              >
                {/* Left: Token, Patient Details */}
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900 text-blue-700 dark:text-blue-300 font-black text-base">
                    #{idx + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
                        {patient.fullName || appt.patientName || "Walk-In Patient"}
                      </h4>
                      {patient.patientId && (
                        <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300">
                          {patient.patientId}
                        </span>
                      )}
                      <StatusBadge status={appt.status} />
                      {isTelemedicine && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 px-2.5 py-0.5 text-[11px] font-bold border border-cyan-200 dark:border-cyan-800">
                          <FiVideo size={12} /> Telemedicine
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      {patient.gender && (
                        <span>
                          {patient.gender}
                          {patient.age ? `, ${patient.age} yrs` : ""}
                        </span>
                      )}
                      {patient.phone && (
                        <span className="flex items-center gap-1 font-mono">
                          <FiPhone size={12} /> {patient.phone}
                        </span>
                      )}
                      {appt.timeSlot && (
                        <span className="flex items-center gap-1 font-mono text-blue-600 dark:text-blue-400 font-semibold">
                          <FiClock size={12} /> {appt.timeSlot}
                        </span>
                      )}
                      {appt.reason && (
                        <span className="truncate max-w-xs text-slate-600 dark:text-slate-300 font-medium">
                          Complaint: {appt.reason}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Clinical Launchpad Actions */}
                <div className="flex flex-wrap items-center gap-2.5 self-end lg:self-center shrink-0">
                  {/* Embedded Specialist Exam Tools per patient */}
                  <button
                    onClick={() => {
                      setSelectedPatientForSuite(patient);
                      setSpecialistSuiteOpen(true);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 px-3 py-2 text-xs font-bold transition active:scale-95 cursor-pointer"
                    title="Examine patient with discipline-specific clinical tools"
                  >
                    <FiAward size={14} className="text-blue-600 dark:text-blue-400" />
                    <span>Specialist Exam</span>
                  </button>

                  {/* Embedded AI Clinical Co-Pilot per patient */}
                  <button
                    onClick={() => handleOpenAiCoPilot(appt)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/80 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-700 dark:text-purple-300 px-3 py-2 text-xs font-bold transition active:scale-95 cursor-pointer"
                    title="Launch AI Differential Diagnosis and trilingual discharge for this patient"
                  >
                    <FiCpu size={14} className="text-purple-600 dark:text-purple-400" />
                    <span>AI Co-Pilot</span>
                  </button>

                  {/* Start / Resume Consultation Status Toggle */}
                  {appt.status === "Scheduled" && (
                    <button
                      onClick={() => handleUpdateStatus(appt._id, "In Consultation")}
                      disabled={updatingId === appt._id}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      <FiActivity size={14} />
                      <span>Call In</span>
                    </button>
                  )}

                  {appt.status === "In Consultation" && (
                    <button
                      onClick={() => handleUpdateStatus(appt._id, "Completed")}
                      disabled={updatingId === appt._id}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      <FiCheckCircle size={14} />
                      <span>Complete</span>
                    </button>
                  )}

                  {/* Telemedicine direct launch */}
                  {isTelemedicine && (
                    <Link
                      to={`/telemedicine/${appt._id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition hover:scale-[1.02] active:scale-95"
                    >
                      <FiVideo size={14} />
                      <span>Join Video</span>
                    </Link>
                  )}

                  {/* Open Clinical EHR */}
                  {patient._id ? (
                    <Link
                      to={`/patients/${patient._id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-2 text-xs font-bold shadow-2xs transition"
                    >
                      <FiFileText size={14} />
                      <span>EHR</span>
                      <FiArrowRight size={13} />
                    </Link>
                  ) : (
                    <Link
                      to="/patients"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-2 text-xs font-bold shadow-2xs transition"
                    >
                      <FiUsers size={14} />
                      <span>Patients</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Clinical Co-Pilot Modal Overlay */}
      {coPilotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/25">
                  <FiCpu size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    AI Clinical Decision Support Co-Pilot
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedApptForAi
                      ? `Patient: ${selectedApptForAi.patientId?.fullName || selectedApptForAi.patientName || "Consultation Patient"} (${selectedApptForAi.reason || "General OPD"})`
                      : "Multi-Specialty Clinical Diagnostics & Drug Interaction Safety"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCoPilotOpen(false)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <FiX size={18} />
              </button>
            </div>

            <AiClinicalCoPilot
              activePatient={selectedApptForAi?.patientId || selectedApptForAi?.patient}
              activeAppointment={selectedApptForAi}
            />
          </div>
        </div>
      )}

      {/* Specialist Colleagues Roster Modal Overlay */}
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
                    Live colleague availability, OPD suites, visiting days, and referral routing.
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

            <SpecialistDoctorsRoster />
          </div>
        </div>
      )}
    </div>
  );
}
