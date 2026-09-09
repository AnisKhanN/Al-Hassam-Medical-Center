import { useState } from "react";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useRevenueSummary } from "../../hooks/useRevenueSummary";
import StatCard from "../dashboard/StatCard";
import RupeeIcon from "../common/RupeeIcon";
import { FiClock, FiAlertCircle } from "react-icons/fi";

const startOfMonthStr = format(
  new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  "yyyy-MM-dd",
);
const todayStr = format(new Date(), "yyyy-MM-dd");

const RevenueDashboard = () => {
  const [dateFrom, setDateFrom] = useState(startOfMonthStr);
  const [dateTo, setDateTo] = useState(todayStr);
  const { summary, loading, error } = useRevenueSummary(dateFrom, dateTo);

  const chartData = (summary?.dailyRevenue || []).map((d) => ({
    day: format(new Date(d._id), "d MMM"),
    total: d.total,
  }));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end gap-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-4 shadow-xs backdrop-blur-md">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300">
            From Date
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 dark:focus:border-blue-400 shadow-xs"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300">
            To Date
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 dark:focus:border-blue-400 shadow-xs"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-4 text-xs font-medium text-red-600 dark:text-red-400 shadow-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-44 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>
      ) : (
        summary && (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                label="Collected Revenue"
                value={`Rs. ${(summary.totalCollected || 0).toLocaleString()}`}
                accent="text-emerald-600 dark:text-emerald-400"
                icon={RupeeIcon}
              />
              <StatCard
                label="Outstanding Balance"
                value={`Rs. ${(summary.outstanding?.totalOutstanding || 0).toLocaleString()}`}
                accent="text-amber-600 dark:text-amber-400"
                icon={FiClock}
              />
              <StatCard
                label="Unpaid / Partial Invoices"
                value={summary.outstanding?.billCount ?? 0}
                accent="text-rose-600 dark:text-rose-400"
                icon={FiAlertCircle}
              />
            </div>

            <div className="mb-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs backdrop-blur-md">
              <h3 className="mb-4 text-sm font-bold text-slate-800 dark:text-slate-100">
                Daily Revenue Trajectory
              </h3>
              {chartData.length === 0 ? (
                <p className="py-12 text-center text-xs text-slate-400 dark:text-slate-500">
                  No payment collections recorded in this date range.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#64748b" opacity={0.2} />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        borderRadius: "12px",
                        color: "#f8fafc",
                        fontSize: "12px",
                      }}
                      itemStyle={{ color: "#38bdf8" }}
                      formatter={(v) => [
                        `Rs. ${Number(v).toLocaleString()}`,
                        "Revenue",
                      ]}
                    />
                    <Bar dataKey="total" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs backdrop-blur-md">
              <h3 className="mb-3 text-sm font-bold text-slate-800 dark:text-slate-100">
                Collections by Payment Method
              </h3>
              {summary.byMethod.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 py-4">
                  No breakdown recorded in this date range.
                </p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {summary.byMethod.map((m) => (
                    <div
                      key={m._id}
                      className="flex items-center justify-between py-2.5 text-xs sm:text-sm"
                    >
                      <span className="font-medium text-slate-600 dark:text-slate-300">
                        {m._id || "Other"}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        Rs. {Number(m.total).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )
      )}
    </div>
  );
};

export default RevenueDashboard;
