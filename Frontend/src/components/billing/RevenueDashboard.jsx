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

const startOfMonthStr = format(
  new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  "yyyy-MM-dd",
);
const todayStr = format(new Date(), "yyyy-MM-dd");

const KpiCard = ({ label, value, accent }) => (
  <div className="rounded-2xl border border-slate-100 bg-white/70 p-5 shadow-sm backdrop-blur">
    <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
    <p className={`mt-1 text-2xl font-semibold ${accent || "text-slate-800"}`}>
      {value}
    </p>
  </div>
);

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
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <KpiCard
                label="Collected"
                value={`Rs. ${(summary.totalCollected || 0).toLocaleString()}`}
                accent="text-green-600"
              />
              <KpiCard
                label="Outstanding"
                value={`Rs. ${(summary.outstanding?.totalOutstanding || 0).toLocaleString()}`}
                accent="text-amber-600"
              />
              <KpiCard
                label="Unpaid / Partial Bills"
                value={summary.outstanding?.billCount ?? 0}
              />
            </div>

            <div className="mb-6 rounded-2xl border border-slate-100 bg-white/70 p-5 shadow-sm backdrop-blur">
              <h3 className="mb-4 text-sm font-semibold text-slate-700">
                Daily Revenue
              </h3>
              {chartData.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-400">
                  No payments recorded in this range.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                    />
                    <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
                    <Tooltip
                      formatter={(v) => [
                        `Rs. ${v.toLocaleString()}`,
                        "Revenue",
                      ]}
                    />
                    <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white/70 p-5 shadow-sm backdrop-blur">
              <h3 className="mb-3 text-sm font-semibold text-slate-700">
                By Payment Method
              </h3>
              {summary.byMethod.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No payments in this range.
                </p>
              ) : (
                <div className="space-y-2">
                  {summary.byMethod.map((m) => (
                    <div
                      key={m._id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-slate-600">{m._id}</span>
                      <span className="font-medium text-slate-700">
                        Rs. {m.total.toLocaleString()}
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
