import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiPlus, FiPackage, FiLayers, FiAlertCircle } from "react-icons/fi";
import { useMedicine } from "../../hooks/useMedicine";
import BatchTable from "../../components/pharmacy/BatchTable";
import AddBatchModal from "../../components/pharmacy/AddBatchModal";
import StockBadge from "../../components/pharmacy/StockBadge";
import useSEO from "../../hooks/useSEO";

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
    <span className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">{label}</span>
    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{value || "—"}</span>
  </div>
);

const MedicineDetail = () => {
  const { id } = useParams();
  const { medicine, loading, error, addBatch } = useMedicine(id);

  useSEO({
    title: medicine ? `${medicine.name} — Batch Inventory & Stock` : "Medicine Detail & Batch Stock",
    description: "Detailed batch inventory, expiry dates, purchase cost, and reorder levels.",
  });

  const [batchModalOpen, setBatchModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-600" />
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
        <div className="rounded-3xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 p-6 text-sm text-rose-700 dark:text-rose-300">
          <div className="flex items-center gap-2 font-bold mb-1">
            <FiAlertCircle size={18} />
            Medicine Error
          </div>
          {error || "Medicine formulation not found"}
          <div className="mt-4">
            <Link to="/pharmacy" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              ← Return to Pharmacy Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 transition-colors duration-200 space-y-6">
      <Link
        to="/pharmacy"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-xs backdrop-blur-md transition"
      >
        <FiArrowLeft size={14} /> Back to Pharmacy Hub
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Medicine Profile Card */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-7 shadow-xs backdrop-blur-md lg:col-span-1 h-fit">
          <div className="flex items-center gap-3.5 mb-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20">
              <FiPackage size={24} />
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md">
                {medicine.medicineId}
              </span>
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
                {medicine.name}
              </h1>
            </div>
          </div>

          {medicine.genericName && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <strong className="text-slate-700 dark:text-slate-300">Generic:</strong> {medicine.genericName}
            </p>
          )}

          <div className="mb-6 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Stock Status</span>
            <StockBadge
              totalStock={medicine.totalStock}
              isLowStock={medicine.isLowStock}
            />
          </div>

          <div className="space-y-3.5">
            <InfoRow label="Therapeutic Category" value={medicine.category} />
            <InfoRow
              label="Retail Unit Price"
              value={`Rs. ${(medicine.unitPrice || 0).toLocaleString()} / ${medicine.unit}`}
            />
            <InfoRow label="Reorder Threshold" value={`${medicine.reorderLevel} ${medicine.unit}s`} />
            <InfoRow
              label="Total Available Units"
              value={`${medicine.totalStock} ${medicine.unit}s`}
            />
            {medicine.supplier && (
              <InfoRow label="Registered Supplier" value={medicine.supplier.name} />
            )}
            {medicine.barcode && (
              <InfoRow label="Assigned Barcode" value={medicine.barcode} />
            )}
          </div>
        </div>

        {/* Right Column: FEFO Batches Ledger */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-7 shadow-xs backdrop-blur-md lg:col-span-2">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40">
                <FiLayers size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Batch Ledger &amp; FEFO Depletion
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  First-Expired, First-Out automatic dispense priority
                </p>
              </div>
            </div>

            <button
              onClick={() => setBatchModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs font-semibold shadow-sm shadow-blue-500/25 transition-all hover:shadow-md hover:scale-[1.02] self-start sm:self-center"
            >
              <FiPlus size={15} /> Receive New Batch
            </button>
          </div>

          <BatchTable batches={medicine.batches} />
        </div>
      </div>

      <AddBatchModal
        isOpen={batchModalOpen}
        onClose={() => setBatchModalOpen(false)}
        onSubmit={addBatch}
      />
    </div>
  );
};

export default MedicineDetail;
