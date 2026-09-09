import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { FiPlus, FiCalendar, FiClock, FiCheckCircle, FiVideo } from "react-icons/fi";
import { useAppointments } from "../../hooks/useAppointments";
import { useAuth } from "../../hooks/useAuth";
import AppointmentTable from "../../components/appointments/AppointmentTable";
import BookAppointmentModal from "../../components/appointments/BookAppointmentModal";
import CompleteAppointmentModal from "../../components/appointments/CompleteAppointmentModal";
import CancelAppointmentModal from "../../components/appointments/CancelAppointmentModal";
import MonthCalendar from "../../components/appointments/MonthCalendar";
import Pagination from "../../components/common/Pagination";
import AiVisitSummaryModal from "../../components/ai/AiVisitSummaryModal";
import StatCard from "../../components/dashboard/StatCard";
import api from "../../api/axios";
import useSEO from "../../hooks/useSEO";

const TABS = ["Today", "Calendar", "Telemedicine", "Completed", "Cancelled"];

const Appointments = () => {
  useSEO({
    title: "Appointment Scheduler & Queue Management",
    description: "Doctor consultation calendar with double-booking prevention, queue tracking, and telemedicine scheduling.",
  });

  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("type") === "telemedicine" ? "Telemedicine" : "Today";
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    if (searchParams.get("type") === "telemedicine") {
      setTab("Telemedicine");
    }
  }, [searchParams]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthCounts, setMonthCounts] = useState({});
  const [bookOpen, setBookOpen] = useState(false);
  const [completeTarget, setCompleteTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [slipTarget, setSlipTarget] = useState(null);

  // Today: today's date, no status filter (see everything at a glance).
  // Calendar: whichever day is selected. Completed/Cancelled: pure status
  // filters with no date bound. Telemedicine: virtual consultations.
  const filters = useMemo(() => {
    if (tab === "Today") return { date: format(new Date(), "yyyy-MM-dd") };
    if (tab === "Calendar") return { date: format(selectedDate, "yyyy-MM-dd") };
    if (tab === "Telemedicine") return { isTelemedicine: true };
    if (tab === "Completed") return { status: "Completed" };
    if (tab === "Cancelled") return { status: "Cancelled" };
    return {};
  }, [tab, selectedDate]);

  const {
    appointments,
    loading,
    error,
    page,
    setPage,
    pages,
    total,
    bookAppointment,
    updateStatus,
  } = useAppointments(filters);

  // Separate lightweight fetch just for the calendar's dots
  const loadMonthCounts = async (monthDate) => {
    const from = format(
      new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
      "yyyy-MM-dd",
    );
    const to = format(
      new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0),
      "yyyy-MM-dd",
    );
    try {
      const { data } = await api.get("/appointments", {
        params: { dateFrom: from, dateTo: to, limit: 100 },
      });
      const counts = {};
      data.data.forEach((a) => {
        const key = format(new Date(a.appointmentDate), "yyyy-MM-dd");
        counts[key] = (counts[key] || 0) + 1;
      });
      setMonthCounts(counts);
    } catch {
      setMonthCounts({});
    }
  };

  useEffect(() => {
    if (tab === "Calendar") {
      loadMonthCounts(selectedDate);
    }
  }, [tab, selectedDate]);

  const handleComplete = (payload) => updateStatus(completeTarget._id, payload);
  const handleCancel = async (payload) => {
    await updateStatus(cancelTarget._id, payload);
    if (tab === "Calendar") loadMonthCounts(selectedDate);
  };

  const canBook = user?.role === "Admin" || user?.role === "Receptionist";

  const scheduledCount = appointments.filter((a) => a.status === "Scheduled").length;
  const completedCount = appointments.filter((a) => a.status === "Completed").length;
  const teleCount = appointments.filter((a) => a.isTelemedicine).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      {/* Top Welcome Hero Banner */}
      <div className="mb-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-7 shadow-xs backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-black text-white shadow-md shadow-blue-500/20">
              <FiCalendar size={28} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Appointment Scheduler & Patient Queue
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/60 px-3 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                  Conflict Radar Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Real-time doctor scheduling with slot collision detection and telemedicine rooms.
              </p>
            </div>
          </div>

          {canBook && (
            <button
              onClick={() => setBookOpen(true)}
              className="flex items-center gap-2 self-start sm:self-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm font-semibold shadow-sm shadow-blue-500/25 transition-all hover:shadow-md hover:scale-[1.02]"
            >
              <FiPlus size={16} /> Book Appointment
            </button>
          )}
        </div>
      </div>

      {/* KPI Quick-Stats Row */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total In Queue"
          value={total}
          subtitle={`Current view: ${tab}`}
          icon={FiCalendar}
          accent="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          label="Scheduled"
          value={scheduledCount}
          subtitle="Awaiting consultation"
          icon={FiClock}
          accent="text-amber-600 dark:text-amber-400"
        />
        <StatCard
          label="Completed"
          value={completedCount}
          subtitle="Consulted visits"
          icon={FiCheckCircle}
          accent="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Telemedicine"
          value={teleCount}
          subtitle="Virtual video rooms"
          icon={FiVideo}
          accent="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Segmented Tab Navigation Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-1.5 backdrop-blur-md w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              tab === t
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className={tab === "Calendar" ? "grid gap-6 md:grid-cols-3" : ""}>
        {tab === "Calendar" && (
          <div className="md:col-span-1 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs backdrop-blur-md p-4">
            <MonthCalendar
              appointmentsByDay={monthCounts}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onMonthChange={loadMonthCounts}
            />
          </div>
        )}

        <div
          className={`overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs backdrop-blur-md ${
            tab === "Calendar" ? "md:col-span-2" : ""
          }`}
        >
          {tab === "Calendar" && (
            <div className="border-b border-slate-200/80 dark:border-slate-800 px-5 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-50/80 dark:bg-slate-900/80">
              {format(selectedDate, "EEEE, dd MMMM yyyy")}
            </div>
          )}
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-600" />
            </div>
          ) : (
            <>
              <AppointmentTable
                appointments={appointments}
                onComplete={setCompleteTarget}
                onCancel={setCancelTarget}
                onOpenSlip={(a) => setSlipTarget(a)}
              />
              <Pagination
                page={page}
                pages={pages}
                total={total}
                onChange={setPage}
              />
            </>
          )}
        </div>
      </div>

      <BookAppointmentModal
        isOpen={bookOpen}
        onClose={() => setBookOpen(false)}
        onSubmit={async (payload) => {
          await bookAppointment(payload);
          if (tab === "Calendar") loadMonthCounts(selectedDate);
        }}
        defaultDate={
          tab === "Today"
            ? format(new Date(), "yyyy-MM-dd")
            : format(selectedDate, "yyyy-MM-dd")
        }
      />
      <CompleteAppointmentModal
        isOpen={!!completeTarget}
        onClose={() => setCompleteTarget(null)}
        onSubmit={handleComplete}
      />
      <CancelAppointmentModal
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onSubmit={handleCancel}
      />
      <AiVisitSummaryModal
        isOpen={!!slipTarget}
        onClose={() => setSlipTarget(null)}
        patient={slipTarget?.patient}
        initialNotes={slipTarget?.reason ? `Consultation for: ${slipTarget.reason}` : ""}
      />
    </div>
  );
};

export default Appointments;
