import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FiEdit2, FiTrash2, FiExternalLink } from "react-icons/fi";
import StockBadge from "./StockBadge";

const MedicineTable = ({ medicines = [], onEdit, onArchive }) => {
  if (medicines.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
          No medicines found matching your search.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
            <th className="px-5 py-3.5">Medicine Formulation</th>
            <th className="px-5 py-3.5">Drug Category</th>
            <th className="px-5 py-3.5">Unit Pricing</th>
            <th className="px-5 py-3.5">Stock Level</th>
            <th className="px-5 py-3.5">Nearest Expiry</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {medicines.map((m) => {
            const expiryText = m.nearestExpiry
              ? format(new Date(m.nearestExpiry), "dd MMM yyyy")
              : "—";

            return (
              <tr
                key={m._id}
                className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors"
              >
                <td className="px-5 py-4">
                  <Link
                    to={`/pharmacy/medicines/${m._id}`}
                    className="font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
                    {m.name}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">{m.medicineId}</span>
                    {m.genericName && <span>· {m.genericName}</span>}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                    {m.category}
                  </span>
                </td>
                <td className="px-5 py-4 font-semibold text-slate-800 dark:text-slate-200">
                  Rs. {m.unitPrice?.toLocaleString()} <span className="text-xs font-normal text-slate-400 dark:text-slate-500">/{m.unit}</span>
                </td>
                <td className="px-5 py-4">
                  <StockBadge
                    totalStock={m.totalStock}
                    isLowStock={m.isLowStock}
                  />
                </td>
                <td className="px-5 py-4 text-xs font-mono text-slate-600 dark:text-slate-300">
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
