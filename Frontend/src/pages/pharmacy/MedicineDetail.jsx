import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiPlus } from "react-icons/fi";
import { useMedicine } from "../../hooks/useMedicine";
import BatchTable from "../../components/pharmacy/BatchTable";
import AddBatchModal from "../../components/pharmacy/AddBatchModal";
import StockBadge from "../../components/pharmacy/StockBadge";

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
    <p className="text-sm text-slate-700">{value || "—"}</p>
  </div>
);

const MedicineDetail = () => {
  const { id } = useParams();
  const { medicine, loading, error, addBatch } = useMedicine(id);
  const [batchModalOpen, setBatchModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }
  if (error || !medicine)
    return (
      <div className="p-8 text-sm text-red-600">
        {error || "Medicine not found"}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40 p-6 md:p-8">
      <Link
        to="/pharmacy"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <FiArrowLeft size={14} /> Back to Pharmacy
      </Link>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white/70 p-6 shadow-sm backdrop-blur md:col-span-1">
          <p className="mb-1 font-mono text-xs text-slate-400">
            {medicine.medicineId}
          </p>
          <h1 className="mb-1 text-xl font-semibold text-slate-800">
            {medicine.name}
          </h1>
          {medicine.genericName && (
            <p className="mb-4 text-sm text-slate-500">
              {medicine.genericName}
            </p>
          )}

          <div className="mb-4">
            <StockBadge
              totalStock={medicine.totalStock}
              isLowStock={medicine.isLowStock}
            />
          </div>

          <div className="space-y-3">
            <InfoRow label="Category" value={medicine.category} />
            <InfoRow
              label="Unit Price"
              value={`Rs. ${medicine.unitPrice} / ${medicine.unit}`}
            />
            <InfoRow label="Reorder Level" value={medicine.reorderLevel} />
            <InfoRow
              label="Total Stock"
              value={`${medicine.totalStock} ${medicine.unit}`}
            />
            {medicine.supplier && (
              <InfoRow label="Supplier" value={medicine.supplier.name} />
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white/70 p-6 shadow-sm backdrop-blur md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-800">Batches</h2>
            <button
              onClick={() => setBatchModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
            >
              <FiPlus size={14} /> Add Batch
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
