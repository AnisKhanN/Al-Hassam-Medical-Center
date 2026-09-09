import { FiEdit2, FiTrash2, FiPhone, FiMapPin, FiUser, FiTruck } from "react-icons/fi";

const SupplierTable = ({ suppliers = [], onEdit, onArchive }) => {
  if (suppliers.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
          <FiTruck size={24} />
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          No pharmaceutical suppliers registered
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Add drug manufacturers and distributors to manage procurement batches.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
            <th className="px-5 py-3.5">Supplier / Company Name</th>
            <th className="px-5 py-3.5">Point of Contact</th>
            <th className="px-5 py-3.5">Contact Phone</th>
            <th className="px-5 py-3.5">Distribution Facility / Address</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {suppliers.map((s) => (
            <tr
              key={s._id}
              className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors"
            >
              {/* Name with Supplier Icon */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold text-sm shadow-sm shadow-amber-500/20">
                    <FiTruck size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {s.name}
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                      SUP-{s._id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                </div>
              </td>

              {/* Contact Person */}
              <td className="px-5 py-4 text-slate-700 dark:text-slate-300">
                {s.contactPerson ? (
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-xs">
                      <FiUser size={12} />
                    </div>
                    <span className="font-medium">{s.contactPerson}</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">Not specified</span>
                )}
              </td>

              {/* Phone */}
              <td className="px-5 py-4 text-slate-700 dark:text-slate-300">
                {s.phone ? (
                  <a
                    href={`tel:${s.phone}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 shadow-xs transition"
                  >
                    <FiPhone size={12} className="text-blue-500" />
                    <span>{s.phone}</span>
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 italic">No phone on record</span>
                )}
              </td>

              {/* Address */}
              <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-400">
                {s.address ? (
                  <div className="flex items-center gap-1.5 max-w-xs">
                    <FiMapPin size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate" title={s.address}>{s.address}</span>
                  </div>
                ) : (
                  <span className="text-slate-400 italic">Address pending</span>
                )}
              </td>

              {/* Actions */}
              <td className="px-5 py-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(s)}
                      className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-2 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 transition shadow-xs"
                      title="Edit Supplier Profile"
                    >
                      <FiEdit2 size={14} />
                    </button>
                  )}
                  {onArchive && (
                    <button
                      onClick={() => onArchive(s)}
                      className="rounded-xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/40 p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition shadow-xs"
                      title="Deactivate Supplier"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierTable;
