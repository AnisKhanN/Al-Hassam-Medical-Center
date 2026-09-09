import { FiCheckCircle, FiClock, FiPercent, FiDownload, FiCreditCard } from "react-icons/fi";
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

const RevenueReportView = ({ data }) => {
  if (!data) return null;

  const { summary, dailyTrend, byMethod, records } = data;

  const handleExportCSV = () => {
    const columns = [
      { key: "billId", label: "Bill ID" },
      {
        key: "createdAt",
        label: "Date",
        formatter: (val) => val ? new Date(val).toLocaleDateString() : "—",
      },
      {
        key: "patient",
        label: "Patient Name",
        formatter: (p) => p?.fullName || "N/A",
      },
      {
        key: "patient",
        label: "Patient Phone",
        formatter: (p) => p?.phone || "N/A",
      },
      { key: "totalAmount", label: "Total Amount (Rs.)" },
      { key: "amountPaid", label: "Amount Paid (Rs.)" },
      { key: "balanceDue", label: "Balance Due (Rs.)" },
      { key: "discount", label: "Discount (Rs.)" },
      { key: "status", label: "Status" },
    ];
    exportToCSV(`revenue_report_${new Date().toISOString().slice(0, 10)}`, columns, records);
  };

  const trendChartData = (dailyTrend || []).map((d) => ({
    date: d._id.slice(5),
    collected: d.collected,
    billed: d.billed,
  }));

  return (
    <div className="space-y-6">
      {/* Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Collected
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
              <FiCheckCircle size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-3 tracking-tight">
            Rs. {(summary?.totalCollected || 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            From {summary?.paidBillsCount || 0} fully settled invoices
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Billed
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <RupeeIcon size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-3 tracking-tight">
            Rs. {(summary?.totalBilled || 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {summary?.billCount || 0} total invoices generated
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Outstanding Due
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20">
              <FiClock size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-3 tracking-tight">
            Rs. {(summary?.totalOutstanding || 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Across {summary?.unpaidBillsCount || 0} unpaid patient accounts
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Discounts Conceded
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-600 text-white shadow-md shadow-purple-500/20">
              <FiPercent size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 mt-3 tracking-tight">
            Rs. {(summary?.totalDiscount || 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Concessions &amp; welfare grants</p>
        </div>
      </div>

      {/* Charts & Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Revenue Trend Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Daily Financial Trend
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Collection vs Invoiced trajectory across current period
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Collected
              </span>
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> Billed
              </span>
            </div>
          </div>
          {trendChartData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#94a3b8" />
                  <Tooltip
                    formatter={(val) => [`Rs. ${(val || 0).toLocaleString()}`, "Amount"]}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      color: "#fff",
                      backdropFilter: "blur(8px)",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                    }}
                  />
                  <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="billed" name="Billed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
              No daily revenue activity recorded in this period.
            </div>
          )}
        </div>

        {/* Payment Methods Breakdown */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <FiCreditCard size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Settlement Modalities
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tender share breakdown</p>
            </div>
          </div>
          <div className="space-y-4">
            {byMethod && byMethod.length > 0 ? (
              byMethod.map((m) => {
                const total = summary?.totalCollected || 1;
                const pct = ((m.total / total) * 100).toFixed(1);
                return (
                  <div key={m._id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800 dark:text-slate-200">{m._id || "Other"}</span>
                      <span className="text-slate-600 dark:text-slate-400 font-mono">
                        Rs. {(m.total || 0).toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-48 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
                No tender method data available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoices Audit Table */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs backdrop-blur-md overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Revenue Invoices Audit
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detailed breakdown of all billing statements generated in range
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
                <th className="px-5 py-3.5">Bill ID</th>
                <th className="px-5 py-3.5">Issue Date</th>
                <th className="px-5 py-3.5">Patient Account</th>
                <th className="px-5 py-3.5 text-right">Invoiced Total</th>
                <th className="px-5 py-3.5 text-right">Amount Paid</th>
                <th className="px-5 py-3.5 text-right">Balance Due</th>
                <th className="px-5 py-3.5 text-center">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {records && records.length > 0 ? (
                records.map((b) => (
                  <tr key={b._id} className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      {b.billId}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                      {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {b.patient?.fullName || "Walk-in Patient"}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">
                        {b.patient?.phone || "—"}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-slate-900 dark:text-white">
                      Rs. {(b.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                      Rs. {(b.amountPaid || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-right text-amber-600 dark:text-amber-400 font-bold">
                      Rs. {(b.balanceDue || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          b.status === "Paid"
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80"
                            : b.status === "Partially Paid"
                            ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80"
                            : b.status === "Cancelled"
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
                    No billing records found for this period.
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

export default RevenueReportView;
