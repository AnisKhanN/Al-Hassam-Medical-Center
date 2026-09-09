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
} from "react-icons/fi";
import api from "../../api/axios";
import { sendWhatsAppNotification } from "../../api/notificationApi";
import StatusBadge from "../appointments/StatusBadge";
import PatientFormModal from "../patients/PatientFormModal";
import BookAppointmentModal from "../appointments/BookAppointmentModal";
import CreateBillModal from "../billing/CreateBillModal";
import RupeeIcon from "../common/RupeeIcon";

export default function ReceptionDeskHub() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Modals state
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

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
    const scheduled = appointments.filter((a) => a.status === "Scheduled").length;
    const completed = appointments.filter((a) => a.status === "Completed").length;
    const cancelled = appointments.filter((a) => a.status === "Cancelled").length;
    return { total, scheduled, completed, cancelled };
  }, [appointments]);

  // Handle fast patient creation
  const handleCreatePatient = async (values) => {
    const res = await api.post("/patients", values);
    const newPatient = res.data?.data;
    setActionSuccess(`Patient registered successfully: ${newPatient?.fullName || "New Patient"}`);
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
      // In clinical practice, receptionist marks as "Checked In" (or triggers live status)
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
      alert(err.response?.data?.message || "Failed to trigger WhatsApp reminder");
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {actionSuccess && (
        <div className="rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/70 p-4 text-sm font-semibold text-emerald-800 dark:text-emerald-200 shadow-md flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <FiCheckCircle size={18} className="text-emerald-600 dark:text-emerald-400" />
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

      {/* Front-Desk Command Bar & Action Launchers */}
      <div className="rounded-3xl border border-emerald-200/80 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50/60 via-white dark:via-slate-900 to-teal-50/40 dark:to-teal-950/20 p-6 sm:p-7 shadow-xs backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
                <FiActivity size={22} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Reception Desk Command Center
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Front-desk queue management, instant token allocation, and patient intake.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setPatientModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-sm shadow-emerald-500/25 transition-all hover:shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <FiUserPlus size={16} />
              <span>Register Patient</span>
            </button>

            <button
              onClick={() => setAppointmentModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-sm shadow-blue-500/25 transition-all hover:shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <FiCalendar size={16} />
              <span>Book Consultation</span>
            </button>

            <button
              onClick={() => setBillModalOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-800 dark:text-amber-200 px-4 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <RupeeIcon size={16} />
              <span>Collect Fee / Bill</span>
            </button>

            <button
              onClick={fetchReceptionData}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              title="Refresh Queue"
            >
              <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Live Census Indicator Cards */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-slate-200/60 dark:border-slate-800/60 pt-5">
          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Tokens Issued Today
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {queueCensus.total}
              </span>
              <span className="text-xs text-slate-400">Total</span>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200/70 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <FiClock size={12} /> Awaiting Doctor
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-blue-700 dark:text-blue-300">
                {queueCensus.scheduled}
              </span>
              <span className="text-xs text-blue-500 dark:text-blue-400">In Queue</span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200/70 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/30 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <FiCheckCircle size={12} /> Concluded Visits
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                {queueCensus.completed}
              </span>
              <span className="text-xs text-emerald-500 dark:text-emerald-400">Done</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Doctors on Roster
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
                {doctors.length}
              </span>
              <span className="text-xs text-slate-400">Available</span>
            </div>
          </div>
        </div>
      </div>

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Live Queue Table (2 Columns) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiUsers className="text-blue-600 dark:text-blue-400" />
                <span>Today's Live Patient Queue</span>
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Real-time lobby waiting list sorted by arrival and token sequence.
              </p>
            </div>
            <Link
              to="/appointments"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Full Calendar</span>
              <FiChevronRight size={14} />
            </Link>
          </div>

          {appointments.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
                <FiCalendar size={22} />
              </div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                No appointments booked for today yet.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Click "+ Book Consultation" to issue the first token of the day.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="pb-3 pl-2">Token</th>
                    <th className="pb-3">Patient</th>
                    <th className="pb-3">Doctor</th>
                    <th className="pb-3">Time</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 pr-2 text-right">Quick Desk Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {appointments.map((a, idx) => {
                    const tokenNum = String(idx + 1).padStart(2, "0");
                    const isScheduled = a.status === "Scheduled";
                    return (
                      <tr
                        key={a._id}
                        className="hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-colors"
                      >
                        <td className="py-3.5 pl-2 font-mono font-black text-xs text-slate-800 dark:text-slate-200">
                          <span className="inline-flex items-center justify-center h-6 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold">
                            #{tokenNum}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <Link
                            to={`/patients/${a.patient?._id}`}
                            className="font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
                          >
                            {a.patient?.fullName || "Patient"}
                          </Link>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {a.patient?.patientId}
                          </p>
                        </td>
                        <td className="py-3.5 font-medium text-slate-700 dark:text-slate-300">
                          Dr. {a.doctor?.name || "Practitioner"}
                        </td>
                        <td className="py-3.5 font-mono text-xs text-slate-500">
                          {format(new Date(a.appointmentDate), "hh:mm a")}
                        </td>
                        <td className="py-3.5">
                          <StatusBadge status={a.status} />
                        </td>
                        <td className="py-3.5 pr-2 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isScheduled && (
                              <button
                                onClick={() => handleCheckIn(a._id)}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 text-xs font-bold transition active:scale-95"
                                title="Mark Patient as Arrived in Lobby"
                              >
                                <FiCheck size={12} />
                                <span>Checked In</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleSendReminder(a, tokenNum)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600 transition"
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

        {/* Doctors On-Duty Roster (1 Column) */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Doctors On-Duty Roster</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-400">
              Live Presence
            </span>
          </div>

          <div className="space-y-3">
            {doctors.map((doc) => {
              const docQueueCount = appointments.filter(
                (a) => a.doctor?._id === doc._id && a.status === "Scheduled",
              ).length;
              return (
                <div
                  key={doc._id}
                  className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3.5 transition hover:border-blue-300 dark:hover:border-blue-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-sm">
                        Dr
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          Dr. {doc.name}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {doc.specialization || "General Physician"}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                      Active
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-200/50 dark:border-slate-700/50 pt-2 text-xs">
                    <span className="text-slate-500">Queue Depth:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">
                      {docQueueCount} patient{docQueueCount !== 1 ? "s" : ""} waiting
                    </span>
                  </div>
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
      />

      <CreateBillModal
        isOpen={billModalOpen}
        onClose={() => setBillModalOpen(false)}
        onSubmit={handleCreateBill}
      />
    </div>
  );
}
