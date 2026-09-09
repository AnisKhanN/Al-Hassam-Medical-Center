import { FiUsers, FiUserPlus, FiActivity, FiDownload, FiPieChart } from "react-icons/fi";
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

const PatientReportView = ({ data }) => {
  if (!data) return null;

  const {
    summary,
    genderDistribution,
    bloodGroupDistribution,
    ageDistribution,
    registrationTrend,
    records,
  } = data;

  const handleExportCSV = () => {
    const columns = [
      { key: "patientId", label: "Patient ID" },
      { key: "fullName", label: "Full Name" },
      { key: "phone", label: "Phone" },
      { key: "gender", label: "Gender" },
      { key: "age", label: "Age" },
      { key: "bloodGroup", label: "Blood Group" },
      {
        key: "createdAt",
        label: "Registration Date",
        formatter: (val) => val ? new Date(val).toLocaleDateString() : "—",
      },
    ];
    exportToCSV(`patients_report_${new Date().toISOString().slice(0, 10)}`, columns, records);
  };

  const ageChartData = (ageDistribution || []).map((a) => ({
    group: a._id.split(" ")[0],
    count: a.count,
  }));

  return (
    <div className="space-y-6">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              New Registrations
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <FiUserPlus size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 mt-3 tracking-tight">
            {summary?.newRegisteredInRange || 0}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Registered within selected date range</p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              All-Time Patient Base
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
              <FiUsers size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-3 tracking-tight">
            {summary?.allTimeTotal || 0}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Active electronic health records directory</p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Blood Profiles
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/20">
              <FiActivity size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-3 tracking-tight">
            {bloodGroupDistribution?.length || 0} Types
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Verified donor / recipient blood groups</p>
        </div>
      </div>

      {/* Demographics & Blood Groups Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Age Group Distribution Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FiPieChart size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Age Demographic Distribution</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Cohort distribution across clinical age brackets</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.15} />
                <XAxis dataKey="group" tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#94a3b8" />
                <Tooltip
                  formatter={(val) => [`${val} Patients`, "Count"]}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    color: "#fff",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                  }}
                />
                <Bar dataKey="count" name="Patient Count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blood Groups Distribution Grid */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <FiActivity size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Blood Group Census</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Recorded patient types</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {bloodGroupDistribution && bloodGroupDistribution.length > 0 ? (
              bloodGroupDistribution.map((bg) => (
                <div
                  key={bg._id}
                  className="rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/50 p-3 flex items-center justify-between"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {bg._id || "Unknown"}
                  </span>
                  <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded-lg">
                    {bg.count}
                  </span>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-xs text-slate-400 py-6">
                No blood groups recorded.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Patient Register Table */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs backdrop-blur-md overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Patient Registry Records
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Recently admitted or updated patient files in this timeframe
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
                <th className="px-5 py-3.5">EMR ID</th>
                <th className="px-5 py-3.5">Patient Full Name</th>
                <th className="px-5 py-3.5">Phone Contact</th>
                <th className="px-5 py-3.5">Demographics</th>
                <th className="px-5 py-3.5">Blood Group</th>
                <th className="px-5 py-3.5">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {records && records.length > 0 ? (
                records.map((p) => (
                  <tr key={p._id} className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      {p.patientId}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                      {p.fullName}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                      {p.phone || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                      {p.gender || "—"}, {p.age ? `${p.age} yrs` : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                        {p.bloodGroup || "Pending"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 dark:text-slate-500">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
                    No patient records registered during this date range.
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

export default PatientReportView;
