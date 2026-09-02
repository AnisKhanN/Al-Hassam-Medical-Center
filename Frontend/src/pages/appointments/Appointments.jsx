import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { FiPlus } from "react-icons/fi";
import { useAppointments } from "../../hooks/useAppointments";
import { useAuth } from "../../hooks/useAuth";
import AppointmentTable from "../../components/appointments/AppointmentTable";
import BookAppointmentModal from "../../components/appointments/BookAppointmentModal";
import CompleteAppointmentModal from "../../components/appointments/CompleteAppointmentModal";
import CancelAppointmentModal from "../../components/appointments/CancelAppointmentModal";
import MonthCalendar from "../../components/appointments/MonthCalendar";
import Pagination from "../../components/common/Pagination";
import api from "../../api/axios";

const TABS = ["Today", "Calendar", "Completed", "Cancelled"];

const Appointments = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState("Today");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthCounts, setMonthCounts] = useState({});
  const [bookOpen, setBookOpen] = useState(false);
  const [completeTarget, setCompleteTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  // Today: today's date, no status filter (see everything at a glance).
  // Calendar: whichever day is selected. Completed/Cancelled: pure status
  // filters with no date bound.
  const filters = useMemo(() => {
    if (tab === "Today") return { date: format(new Date(), "yyyy-MM-dd") };
    if (tab === "Calendar") return { date: format(selectedDate, "yyyy-MM-dd") };
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

  // Separate lightweight fetch just for the calendar's dots — pulling a
  // whole month through the paginated list hook would fight its own paging.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40 p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Appointments</h1>
          <p className="text-sm text-slate-500">
            {tab === "Today"
              ? `Today, ${format(new Date(), "dd MMM yyyy")}`
              : `${total} appointment${total !== 1 ? "s" : ""}`}
          </p>
        </div>
        {canBook && (
          <button
            onClick={() => setBookOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <FiPlus size={16} /> Book Appointment
          </button>
        )}
      </div>

      <div className="mb-5 flex w-fit gap-1 rounded-lg border border-slate-100 bg-white/70 p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${tab === t ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className={tab === "Calendar" ? "grid gap-6 md:grid-cols-3" : ""}>
        {tab === "Calendar" && (
          <div className="md:col-span-1">
            <MonthCalendar
              appointmentsByDay={monthCounts}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onMonthChange={loadMonthCounts}
            />
          </div>
        )}

        <div
          className={`overflow-hidden rounded-2xl border border-slate-100 bg-white/70 shadow-sm backdrop-blur ${tab === "Calendar" ? "md:col-span-2" : ""}`}
        >
          {tab === "Calendar" && (
            <div className="border-b border-slate-100 px-4 py-3 text-sm font-medium text-slate-600">
              {format(selectedDate, "EEEE, dd MMMM yyyy")}
            </div>
          )}
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            </div>
          ) : (
            <>
              <AppointmentTable
                appointments={appointments}
                onComplete={setCompleteTarget}
                onCancel={setCancelTarget}
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
    </div>
  );
};

export default Appointments;
