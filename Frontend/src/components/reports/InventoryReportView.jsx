import { FiPackage, FiAlertTriangle, FiClock, FiDownload, FiLayers } from "react-icons/fi";
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

const InventoryReportView = ({ data }) => {
  if (!data) return null;

  const {
    summary,
    categoryDistribution,
    expiringBatches30,
    expiringBatches60,
    reorderList,
    records,
  } = data;

  const handleExportCSV = () => {
    const columns = [
      { key: "medicineId", label: "Medicine ID" },
      { key: "name", label: "Medicine Name" },
      { key: "category", label: "Category" },
      { key: "unit", label: "Unit" },
      { key: "totalStock", label: "Current Stock" },
      { key: "reorderLevel", label: "Reorder Level" },
      { key: "unitPrice", label: "Unit Price (Rs.)" },
      {
        key: "supplier",
        label: "Supplier",
        formatter: (s) => s?.name || "N/A",
      },
    ];
    exportToCSV(`inventory_report_${new Date().toISOString().slice(0, 10)}`, columns, records);
  };

  const catChartData = (categoryDistribution || []).map((c) => ({
    name: c.category || "General",
    valuation: c.valuation,
    stock: c.totalStock,
  }));

  return (
    <div className="space-y-6">
      {/* Top Valuation & Stock KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Inventory Cost Value
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
              <RupeeIcon size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-3 tracking-tight">
            Rs. {(summary?.totalCostValuation || 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total purchasing capital tied in stock</p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Retail Valuation
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <RupeeIcon size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 mt-3 tracking-tight">
            Rs. {(summary?.totalRetailValuation || 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Expected gross turnover</p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Stock Units
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20">
              <FiPackage size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-3 tracking-tight">
            {(summary?.totalStockUnits || 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Across {summary?.totalMedicines || 0} formulations</p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Health Status
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20">
              <FiAlertTriangle size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-3 tracking-tight">
            {summary?.lowStockCount || 0} Low · {summary?.outOfStockCount || 0} Out
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{summary?.inStockCount || 0} adequately replenished</p>
        </div>
      </div>

      {/* Category Distribution Chart & Expiry Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <FiLayers size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Stock Valuation by Drug Class</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Retail capital allocation across therapeutic categories</p>
            </div>
          </div>
          {catChartData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={catChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#94a3b8" />
                  <Tooltip
                    formatter={(val) => [`Rs. ${(val || 0).toLocaleString()}`, "Retail Value"]}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      color: "#fff",
                      backdropFilter: "blur(8px)",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                    }}
                  />
                  <Bar dataKey="valuation" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
              No inventory category data available.
            </div>
          )}
        </div>

        {/* Expiring Batches Alert Card */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xs backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiClock className="text-amber-500" /> Expiry Radar
            </h3>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800/80 px-2.5 py-0.5 rounded-full">
              {summary?.expiringCount30 || 0} in &le;30d
            </span>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {expiringBatches30 && expiringBatches30.length > 0 ? (
              expiringBatches30.map((b, i) => (
                <div key={i} className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border border-amber-200/80 dark:border-amber-800/60 text-xs">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{b.medicineName}</div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 mt-1 font-mono text-[11px]">
                    <span>Batch: {b.batchNumber}</span>
                    <span className="font-bold text-amber-700 dark:text-amber-400">{b.daysLeft} days left</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                ✅ No batches expiring within the next 30 days.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reorder Requirements Table */}
      {reorderList && reorderList.length > 0 && (
        <div className="rounded-3xl border border-amber-200/80 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/30 p-5 shadow-xs backdrop-blur-md">
          <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 mb-3 flex items-center gap-2">
            <FiAlertTriangle className="text-amber-600 dark:text-amber-400" /> Critical Stock Reorder List ({reorderList.length} Items)
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-amber-200/60 dark:border-amber-800/40 bg-white/70 dark:bg-slate-900/70">
            <table className="w-full text-left text-xs">
              <thead className="bg-amber-100/60 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold border-b border-amber-200 dark:border-amber-800/60">
                <tr>
                  <th className="py-2.5 px-4">Medicine</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4 text-right">Current Stock</th>
                  <th className="py-2.5 px-4 text-right">Reorder Level</th>
                  <th className="py-2.5 px-4">Supplier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 dark:divide-amber-900/40">
                {reorderList.map((r) => (
                  <tr key={r._id} className="hover:bg-amber-100/40 dark:hover:bg-amber-950/40 transition">
                    <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{r.name}</td>
                    <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">{r.category}</td>
                    <td className="py-2.5 px-4 text-right font-black text-rose-600 dark:text-rose-400">
                      {r.totalStock} {r.unit}
                    </td>
                    <td className="py-2.5 px-4 text-right text-slate-600 dark:text-slate-400 font-mono">{r.reorderLevel}</td>
                    <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">{r.supplierName || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Complete Medicine Catalog Table */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs backdrop-blur-md overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Inventory Catalog Directory
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active formulations and stock status ({records?.length || 0} total)
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
                <th className="px-5 py-3.5">Code</th>
                <th className="px-5 py-3.5">Medicine Formulation</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5 text-right">Available Stock</th>
                <th className="px-5 py-3.5 text-right">Unit Price</th>
                <th className="px-5 py-3.5">Primary Supplier</th>
                <th className="px-5 py-3.5 text-center">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {records && records.length > 0 ? (
                records.map((m) => (
                  <tr key={m._id} className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      {m.medicineId}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                      {m.name}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                      <span className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                        {m.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-slate-900 dark:text-white">
                      {m.totalStock} {m.unit}
                    </td>
                    <td className="px-5 py-3.5 text-right text-slate-900 dark:text-white font-semibold">
                      Rs. {(m.unitPrice || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                      {m.supplier?.name || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          m.totalStock === 0
                            ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60"
                            : m.isLowStock
                            ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                            : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                        }`}
                      >
                        {m.totalStock === 0
                          ? "Out of Stock"
                          : m.isLowStock
                          ? "Low Stock"
                          : "In Stock"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
                    No medicines found in the pharmacy catalog.
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

export default InventoryReportView;
