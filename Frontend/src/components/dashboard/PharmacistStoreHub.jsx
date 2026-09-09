import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  FiPackage,
  FiShoppingBag,
  FiAlertTriangle,
  FiClock,
  FiSearch,
  FiPlus,
  FiRefreshCw,
  FiChevronRight,
  FiTruck,
  FiCheckCircle,
  FiLayers,
} from "react-icons/fi";
import { RiBarcodeLine } from "react-icons/ri";
import api from "../../api/axios";
import RupeeIcon from "../common/RupeeIcon";
import NewSaleModal from "../pharmacy/NewSaleModal";
import MedicineFormModal from "../pharmacy/MedicineFormModal";

export default function PharmacistStoreHub() {
  const [medicines, setMedicines] = useState([]);
  const [sales, setSales] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchCode, setSearchCode] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Modals
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [medicineModalOpen, setMedicineModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchPharmacyData = useCallback(async () => {
    setLoading(true);
    try {
      const [medsRes, salesRes, lowStockRes, expRes] = await Promise.all([
        api.get("/medicines", { params: { limit: 10 } }),
        api.get("/sales", { params: { limit: 8 } }),
        api.get("/medicines/low-stock"),
        api.get("/medicines/expiring", { params: { days: 60 } }),
      ]);
      setMedicines(medsRes.data?.data || []);
      setSales(salesRes.data?.data || []);
      setLowStock(lowStockRes.data?.data || []);
      setExpiring(expRes.data?.data || []);
    } catch (err) {
      console.error("Failed to load pharmacy dispensary data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPharmacyData();
  }, [fetchPharmacyData]);

  // Fast Barcode / SKU / Name lookup
  const handleLookup = async (e) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    setSearching(true);
    setSearchError("");
    setSearchResult(null);
    try {
      // First try barcode lookup
      const code = searchCode.trim();
      const res = await api.get(`/medicines/barcode/${code}`).catch(async () => {
        // Fallback to name search
        const fallback = await api.get("/medicines", { params: { search: code, limit: 1 } });
        return { data: { data: fallback.data?.data?.[0] } };
      });
      if (res.data?.data) {
        setSearchResult(res.data.data);
      } else {
        setSearchError(`No medication found for "${code}"`);
      }
    } catch (err) {
      setSearchError(`No medication found matching "${searchCode}"`);
    } finally {
      setSearching(false);
    }
  };

  // Today's dispensing summary
  const todaySummary = useMemo(() => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    const todaySales = sales.filter((s) => s.createdAt?.slice(0, 10) === todayStr);
    const revenue = todaySales.reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0);
    return { count: todaySales.length, revenue };
  }, [sales]);

  const handleSaleSubmit = async (payload) => {
    await api.post("/sales", payload);
    setActionSuccess("POS Sale recorded & FEFO stock deducted successfully!");
    setTimeout(() => setActionSuccess(null), 4000);
    fetchPharmacyData();
  };

  const handleCreateMedicine = async (payload) => {
    await api.post("/medicines", payload);
    setActionSuccess("New medication cataloged successfully!");
    setTimeout(() => setActionSuccess(null), 4000);
    fetchPharmacyData();
  };

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {actionSuccess && (
        <div className="rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/70 p-4 text-sm font-semibold text-emerald-800 dark:text-emerald-200 shadow-md flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <FiCheckCircle size={18} className="text-emerald-600 dark:text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <button
            onClick={() => setActionSuccess(null)}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Pharmacist Dispensary Hero Command Bar */}
      <div className="rounded-3xl border border-amber-200/80 dark:border-amber-900/40 bg-gradient-to-br from-amber-50/60 via-white dark:via-slate-900 to-orange-50/40 dark:to-orange-950/20 p-6 sm:p-7 shadow-xs backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
                <FiPackage size={22} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Pharmacist Dispensary & POS Terminal
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Automated FEFO batch depletion, near-expiry monitoring, and barcode checkout.
                </p>
              </div>
            </div>
          </div>

          {/* Quick POS Launchers */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSaleModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md shadow-amber-500/25 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <RiBarcodeLine size={18} />
              <span>Launch Barcode POS</span>
            </button>

            <button
              onClick={() => setMedicineModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-sm shadow-blue-500/25 transition-all hover:shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <FiPlus size={16} />
              <span>Add Medication</span>
            </button>

            <button
              onClick={fetchPharmacyData}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              title="Refresh Inventory"
            >
              <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Stock & Expiry Safety Radar Cards */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-slate-200/60 dark:border-slate-800/60 pt-5">
          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Low Stock Alerts
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {lowStock.length}
              </span>
              <span className="text-xs text-amber-500">Reorder soon</span>
            </div>
          </div>

          <div className="rounded-2xl border border-rose-200/70 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/30 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <FiClock size={12} /> Expiring &lt;60d
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-rose-700 dark:text-rose-300">
                {expiring.length}
              </span>
              <span className="text-xs text-rose-500 dark:text-rose-400">Batches</span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200/70 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/30 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <FiShoppingBag size={12} /> Today's Sales
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                {todaySummary.count}
              </span>
              <span className="text-xs text-emerald-500 dark:text-emerald-400">Invoices</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Today's POS Revenue
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xs text-slate-400">PKR</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {todaySummary.revenue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Instant Barcode & Stock Verifier Bar */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
        <form onSubmit={handleLookup} className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <RiBarcodeLine size={20} />
          </div>
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Scan Barcode or Type Medicine Name to instantly check real-time stock & price..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none font-medium"
          />
          <button
            type="submit"
            disabled={searching}
            className="rounded-xl bg-slate-900 dark:bg-slate-800 text-white px-4 py-2 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition"
          >
            {searching ? "Searching..." : "Lookup"}
          </button>
        </form>

        {/* Live Search Card */}
        {searchResult && (
          <div className="mt-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-base text-slate-900 dark:text-white">
                  {searchResult.name}
                </span>
                <span className="rounded-md bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-200">
                  {searchResult.medicineId}
                </span>
                <span className="text-xs text-slate-500">
                  ({searchResult.category || "General"})
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3 font-medium">
                <span>Unit Price: <strong>PKR {searchResult.unitPrice}</strong></span>
                <span>• Total Stock: <strong className={searchResult.totalStock <= searchResult.reorderLevel ? "text-red-500" : "text-emerald-600"}>{searchResult.totalStock} units</strong></span>
                <span>• Reorder Level: {searchResult.reorderLevel}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSaleModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition"
              >
                <RiBarcodeLine size={15} />
                <span>Sell at POS</span>
              </button>
              <Link
                to={`/pharmacy/medicines/${searchResult._id}`}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                View Batches
              </Link>
            </div>
          </div>
        )}

        {searchError && (
          <p className="mt-3 text-xs text-red-500 font-semibold">{searchError}</p>
        )}
      </div>

      {/* Main Grid: Urgent FEFO Expiry Radar + Recent Sales Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent FEFO Expiry Radar Table (2 Columns) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiClock className="text-rose-600 dark:text-rose-400" />
                <span>FEFO Expiry Alert Radar</span>
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Batches expiring soonest — prioritize for earliest POS dispensing.
              </p>
            </div>
            <Link
              to="/pharmacy"
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Manage Inventory</span>
              <FiChevronRight size={14} />
            </Link>
          </div>

          {expiring.length === 0 ? (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 mb-2">
                <FiCheckCircle size={20} />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                All batches in inventory have safe shelf-life!
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Zero medicines expiring within the next 60 days.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="pb-3 pl-2">Medicine</th>
                    <th className="pb-3">Batch No</th>
                    <th className="pb-3">Qty Left</th>
                    <th className="pb-3">Expiry Date</th>
                    <th className="pb-3 pr-2 text-right">FEFO Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {expiring.map((b) => {
                    const daysLeft = Math.ceil(
                      (new Date(b.expiryDate) - new Date()) / (1000 * 60 * 60 * 24),
                    );
                    const isCritical = daysLeft <= 15;
                    return (
                      <tr
                        key={b.batchId || b._id}
                        className="hover:bg-rose-50/30 dark:hover:bg-rose-950/20 transition-colors"
                      >
                        <td className="py-3 pl-2 font-bold text-slate-800 dark:text-slate-200">
                          {b.medicineName}
                        </td>
                        <td className="py-3 font-mono text-xs text-slate-500">
                          {b.batchNumber}
                        </td>
                        <td className="py-3 font-bold text-slate-800 dark:text-slate-200">
                          {b.quantity} units
                        </td>
                        <td className="py-3 font-mono text-xs text-slate-500">
                          {format(new Date(b.expiryDate), "dd MMM yyyy")}
                        </td>
                        <td className="py-3 pr-2 text-right">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              isCritical
                                ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 animate-pulse"
                                : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                            }`}
                          >
                            {daysLeft <= 0 ? "Expired" : `${daysLeft} days left`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent POS Sales Activity Feed (1 Column) */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiShoppingBag className="text-emerald-600 dark:text-emerald-400" />
              <span>Recent POS Receipts</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-400">
              Live Counter
            </span>
          </div>

          {sales.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-400">
              No sales recorded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {sales.slice(0, 5).map((sale) => (
                <div
                  key={sale._id}
                  className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3.5 transition hover:border-amber-300 dark:hover:border-amber-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                        {sale.saleId || "SALE-REC"}
                      </span>
                      <p className="text-[11px] text-slate-400">
                        {sale.customerName || "Walk-in Patient"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        PKR {Number(sale.totalAmount || 0).toLocaleString()}
                      </span>
                      <p className="text-[10px] text-slate-400 capitalize">
                        {sale.paymentMethod || "Cash"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-500 border-t border-slate-200/50 dark:border-slate-700/50 pt-1.5 flex justify-between">
                    <span>{sale.items?.length || 1} line items</span>
                    <span>{sale.createdAt ? format(new Date(sale.createdAt), "h:mm a") : ""}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Embedded Modals for Fast Action */}
      <NewSaleModal
        isOpen={saleModalOpen}
        onClose={() => setSaleModalOpen(false)}
        onSubmit={handleSaleSubmit}
      />

      <MedicineFormModal
        isOpen={medicineModalOpen}
        onClose={() => setMedicineModalOpen(false)}
        onSubmit={handleCreateMedicine}
      />
    </div>
  );
}
