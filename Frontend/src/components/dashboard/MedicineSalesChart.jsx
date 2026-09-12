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
import { useSalesSummary } from "../../hooks/useSalesSummary";
import StatCard from "./StatCard";
import { FiShoppingBag, FiLayers } from "react-icons/fi";

const startOfMonthStr = format(
  new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  "yyyy-MM-dd",
);
const todayStr = format(new Date(), "yyyy-MM-dd");

const MedicineSalesChart = () => {
  const [dateFrom, setDateFrom] = useState(startOfMonthStr);
  const [dateTo, setDateTo] = useState(todayStr);
  const { summary, loading, error } = useSalesSummary(dateFrom, dateTo);

  const chartData = (summary?.dailySales || []).map((d) => ({
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
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <StatCard
                label="Medicine Sales Revenue"
                value={`Rs. ${(summary.totalSales || 0).toLocaleString()}`}
                accent="text-emerald-600 dark:text-emerald-400"
                icon={FiShoppingBag}
              />
              <StatCard
                label="Total Units Dispensed"
                value={summary.saleCount ?? 0}
                icon={FiLayers}
              />
            </div>

            <div className="mb-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs backdrop-blur-md">
              <h3 className="mb-4 text-sm font-bold text-slate-800 dark:text-slate-100">
                Daily Medicine Dispensing Revenue
              </h3>
              {chartData.length === 0 ? (
                <p className="py-12 text-center text-xs text-slate-400 dark:text-slate-500">
                  No sales recorded in this date range.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#64748b"
                      opacity={0.2}
                    />
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
                      itemStyle={{ color: "#34d399" }}
                      formatter={(v) => [
                        `Rs. ${Number(v).toLocaleString()}`,
                        "Sales",
                      ]}
                    />
                    <Bar dataKey="total" fill="#059669" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs backdrop-blur-md">
              <h3 className="mb-3 text-sm font-bold text-slate-800 dark:text-slate-100">
                Top Dispensed Medicines
              </h3>
              {(summary?.topMedicines || []).length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 py-4">
                  No medicine sales in this date range.
                </p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {(summary?.topMedicines || []).map((m) => (
                    <div
                      key={m._id}
                      className="flex items-center justify-between py-2.5 text-xs sm:text-sm"
                    >
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {m._id}{" "}
                        <span className="text-slate-400 dark:text-slate-500 font-normal">
                          ({m.quantitySold} units)
                        </span>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        Rs. {(m.revenue || 0).toLocaleString()}
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

export default MedicineSalesChart;
