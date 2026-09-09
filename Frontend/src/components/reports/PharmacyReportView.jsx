import { FiShoppingBag, FiXCircle, FiTrendingUp, FiDownload } from "react-icons/fi";
import RupeeIcon from "../common/RupeeIcon";
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

const PharmacyReportView = ({ data }) => {
  if (!data) return null;

  const { summary, dailyTrend, topMedicines, records } = data;

  const handleExportCSV = () => {
    const columns = [
      { key: "saleId", label: "Sale ID" },
      {
        key: "createdAt",
        label: "Date & Time",
        formatter: (val) => val ? new Date(val).toLocaleString() : "—",
      },
      { key: "customerName", label: "Customer Name" },
      { key: "customerPhone", label: "Customer Phone" },
      {
        key: "soldBy",
        label: "Pharmacist / Staff",
        formatter: (s) => s?.name || "N/A",
      },
      { key: "totalAmount", label: "Total Amount (Rs.)" },
      { key: "status", label: "Status" },
    ];
    exportToCSV(`pharmacy_sales_report_${new Date().toISOString().slice(0, 10)}`, columns, records);
  };

  const topMedChartData = (topMedicines || []).map((m) => ({
    name: m._id || "Medicine",
    revenue: m.revenue,
    quantity: m.quantitySold,
  }));

  const avgOrderVal =
    summary?.completedCount > 0
      ? Math.round(summary.totalRevenue / summary.completedCount)
      : 0;

  return (
    <div className="space-y-6">
      {/* Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pharmacy Revenue
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
              <RupeeIcon size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-3 tracking-tight">
            Rs. {(summary?.totalRevenue || 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">From completed OTC &amp; POS orders</p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Completed Sales
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <FiShoppingBag size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-3 tracking-tight">
            {summary?.completedCount || 0}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Dispensed checkout transactions</p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Voided Slips
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/20">
              <FiXCircle size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-3 tracking-tight">
            {summary?.voidedCount || 0}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Returned and restocked slips</p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Avg Basket Value
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20">
              <FiTrendingUp size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 mt-3 tracking-tight">
            Rs. {avgOrderVal.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Mean value per dispensed order</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Selling Medicines */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Top Formulations by Revenue</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Leading retail medicines in this timeframe</p>
            </div>
          </div>
          {topMedChartData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topMedChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#94a3b8" />
                  <Tooltip
                    formatter={(val) => [`Rs. ${(val || 0).toLocaleString()}`, "Revenue"]}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      color: "#fff",
                      backdropFilter: "blur(8px)",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                    }}
                  />
                  <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
              No medicine sales recorded in this range.
            </div>
          )}
        </div>

        {/* Daily Sales Trend */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Daily POS Sales Trend</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total daily pharmacy billing revenue</p>
            </div>
          </div>
          {dailyTrend && dailyTrend.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyTrend.map((d) => ({ date: d._id.slice(5), revenue: d.revenue, count: d.salesCount }))}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#94a3b8" />
                  <Tooltip
                    formatter={(val) => [`Rs. ${(val || 0).toLocaleString()}`, "Revenue"]}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      color: "#fff",
                      backdropFilter: "blur(8px)",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                    }}
                  />
                  <Bar dataKey="revenue" name="Daily Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
              No daily sales data available.
            </div>
          )}
        </div>
      </div>

      {/* POS Transactions Table */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs backdrop-blur-md overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              POS Dispensary Ledger
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Audit trails of all pharmaceutical sales in this date range
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
                <th className="px-5 py-3.5">Sale ID</th>
                <th className="px-5 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5">Customer Name</th>
                <th className="px-5 py-3.5">Dispensed By</th>
                <th className="px-5 py-3.5 text-right">Items</th>
                <th className="px-5 py-3.5 text-right">Total Net</th>
                <th className="px-5 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {records && records.length > 0 ? (
                records.map((s) => (
                  <tr key={s._id} className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      {s.saleId}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                      {s.createdAt
                        ? new Date(s.createdAt).toLocaleString([], {
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
                        {s.customerName || "Walk-in OTC"}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">
                        {s.customerPhone || "—"}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300">
                      {s.soldBy?.name || "Staff"}
                    </td>
                    <td className="px-5 py-3.5 text-right text-slate-700 dark:text-slate-300 font-bold">
                      {s.items?.length || 0}
                    </td>
                    <td className="px-5 py-3.5 text-right font-black text-slate-900 dark:text-white">
                      Rs. {(s.totalAmount ?? 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === "Completed"
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80"
                            : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
                    No sales transactions found for this period.
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

export default PharmacyReportView;
