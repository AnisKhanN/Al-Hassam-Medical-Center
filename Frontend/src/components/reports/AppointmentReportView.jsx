import { FiCalendar, FiCheckCircle, FiXCircle, FiClock, FiDownload, FiUserCheck } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { exportToCSV } from "../../utils/exportUtils";

const AppointmentReportView = ({ data }) => {
  if (!data) return null;

  const { summary, doctorBreakdown, dailyTrend, records } = data;

  const handleExportCSV = () => {
    const columns = [
      { key: "appointmentId", label: "Appointment ID" },
      {
        key: "appointmentDate",
        label: "Date & Time",
        formatter: (val) => val ? new Date(val).toLocaleString() : "—",
      },
      {
        key: "patient",
        label: "Patient Name",
        formatter: (p) => p?.fullName || "N/A",
      },
      {
        key: "doctor",
        label: "Doctor Name",
        formatter: (d) => d?.name || "N/A",
      },
      { key: "status", label: "Status" },
      { key: "reason", label: "Reason for Visit" },
    ];
    exportToCSV(`appointments_report_${new Date().toISOString().slice(0, 10)}`, columns, records);
  };

  const doctorChartData = (doctorBreakdown || []).map((d) => ({
    name: d.doctorName?.replace("Dr. ", "") || "Doctor",
    completed: d.completed,
    cancelled: d.cancelled,
    scheduled: d.scheduled,
  }));

  return (
    <div className="space-y-6">
      {/* Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Bookings
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <FiCalendar size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-3 tracking-tight">
            {summary?.total || 0}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total appointments in range</p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Completion Rate
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
              <FiCheckCircle size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-3 tracking-tight">
            {summary?.completionRate || 0}%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{summary?.completedCount || 0} visits completed</p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Cancellation Rate
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/20">
              <FiXCircle size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-3 tracking-tight">
            {summary?.cancellationRate || 0}%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{summary?.cancelledCount || 0} visits cancelled</p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pending Queue
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20">
              <FiClock size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 mt-3 tracking-tight">
            {summary?.scheduledCount || 0}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pending clinical consultations</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clinician Consultation Breakdown */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <FiUserCheck size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Doctor Consultation Load</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Completed vs cancelled consultations per doctor</p>
            </div>
          </div>
          {doctorChartData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={doctorChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      color: "#fff",
                      backdropFilter: "blur(8px)",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                    }}
                  />
                  <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cancelled" name="Cancelled" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
              No doctor consultation data available.
            </div>
          )}
        </div>

        {/* Daily Appointment Trend */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <FiCalendar size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Daily Visit Trend</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total bookings vs completed consultations</p>
            </div>
          </div>
          {dailyTrend && dailyTrend.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyTrend.map((d) => ({ date: d._id.slice(5), total: d.total, completed: d.completed }))}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      color: "#fff",
                      backdropFilter: "blur(8px)",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                    }}
                  />
                  <Bar dataKey="total" name="Total Bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
              No daily booking data available.
            </div>
          )}
        </div>
      </div>

      {/* Appointment Registry Table */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs backdrop-blur-md overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Appointment Records Registry
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comprehensive list of clinical bookings across selected date range
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 self-start sm:self-center rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-xs"
          >
            <FiDownload size={14} /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3.5">ID</th>
                <th className="px-5 py-3.5">Scheduled Slot</th>
                <th className="px-5 py-3.5">Patient Details</th>
                <th className="px-5 py-3.5">Assigned Clinician</th>
                <th className="px-5 py-3.5">Chief Complaint / Reason</th>
                <th className="px-5 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {records && records.length > 0 ? (
                records.map((a) => (
                  <tr key={a._id} className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      {a.appointmentId}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                      {a.appointmentDate
                        ? new Date(a.appointmentDate).toLocaleString([], {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {a.patient?.fullName || "Walk-in Patient"}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                        {a.patient?.patientId || a.patient?.phone || "—"}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300">
                      <div className="font-medium">{a.doctor?.name || "Dr. Unassigned"}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">
                        {a.doctor?.specialization || "General Medicine"}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {a.reason || "General Consultation"}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          a.status === "Completed"
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80"
                            : a.status === "Cancelled"
                            ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80"
                            : "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
                    No appointments scheduled for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppointmentReportView;
