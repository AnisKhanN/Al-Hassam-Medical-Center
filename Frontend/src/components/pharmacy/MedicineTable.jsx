import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FiEdit2, FiTrash2, FiExternalLink } from "react-icons/fi";
import StockBadge from "./StockBadge";

const MedicineTable = ({ medicines = [], onEdit, onArchive }) => {
  if (medicines.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-400">
        No medicines found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Medicine</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock Status</th>
            <th className="px-4 py-3">Nearest Expiry</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {medicines.map((m) => {
            const expiryText = m.nearestExpiry
              ? format(new Date(m.nearestExpiry), "dd MMM yyyy")
              : "—";

            return (
              <tr
                key={m._id}
                className="transition hover:bg-slate-50/60"
              >
                <td className="px-4 py-3">
                  <Link
                    to={`/pharmacy/medicines/${m._id}`}
                    className="font-medium text-slate-800 hover:text-blue-600"
                  >
                    {m.name}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono">{m.medicineId}</span>
                    {m.genericName && <span>· {m.genericName}</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    {m.category}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-slate-700">
                  Rs. {m.unitPrice?.toLocaleString()} <span className="text-xs font-normal text-slate-400">/{m.unit}</span>
                </td>
                <td className="px-4 py-3">
                  <StockBadge
                    totalStock={m.totalStock}
                    isLowStock={m.isLowStock}
                  />
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {expiryText}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={`/pharmacy/medicines/${m._id}`}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                      title="View Details & Batches"
                    >
                      <FiExternalLink size={15} />
                    </Link>
                    {onEdit && (
                      <button
                        onClick={() => onEdit(m)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        title="Edit Medicine"
                      >
                        <FiEdit2 size={15} />
                      </button>
                    )}
                    {onArchive && (
                      <button
                        onClick={() => onArchive(m)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        title="Archive Medicine"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MedicineTable;
