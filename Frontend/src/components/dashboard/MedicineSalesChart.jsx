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
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">
            From
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-blue-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">
            To
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-blue-400"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>
      ) : (
        summary && (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <StatCard
                label="Pharmacy Revenue"
                value={`Rs. ${summary.totalRevenue.toLocaleString()}`}
                accent="text-green-600"
              />
              <StatCard label="Sales Recorded" value={summary.saleCount} />
            </div>

            <div className="mb-6 rounded-2xl border border-slate-100 bg-white/70 p-5 shadow-sm backdrop-blur">
              <h3 className="mb-4 text-sm font-semibold text-slate-700">
                Daily Medicine Sales
              </h3>
              {chartData.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-400">
                  No sales recorded in this range.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                    />
                    <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
                    <Tooltip
                      formatter={(v) => [`Rs. ${v.toLocaleString()}`, "Sales"]}
                    />
                    <Bar dataKey="total" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white/70 p-5 shadow-sm backdrop-blur">
              <h3 className="mb-3 text-sm font-semibold text-slate-700">
                Top Medicines
              </h3>
              {(summary?.topMedicines || []).length === 0 ? (
                <p className="text-sm text-slate-400">
                  No sales in this range.
                </p>
              ) : (
                <div className="space-y-2">
                  {(summary?.topMedicines || []).map((m) => (
                    <div
                      key={m._id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-slate-600">
                        {m._id}{" "}
                        <span className="text-slate-400">
                          ({m.quantitySold} units)
                        </span>
                      </span>
                      <span className="font-medium text-slate-700">
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
