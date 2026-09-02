import { FiEdit2, FiTrash2, FiPhone, FiMapPin, FiUser } from "react-icons/fi";

const SupplierTable = ({ suppliers = [], onEdit, onArchive }) => {
  if (suppliers.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-400">
        No suppliers found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Supplier Name</th>
            <th className="px-4 py-3">Contact Person</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Address</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {suppliers.map((s) => (
            <tr
              key={s._id}
              className="transition hover:bg-slate-50/60"
            >
              <td className="px-4 py-3 font-medium text-slate-800">
                {s.name}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {s.contactPerson ? (
                  <div className="flex items-center gap-1.5">
                    <FiUser size={13} className="text-slate-400" />
                    <span>{s.contactPerson}</span>
                  </div>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {s.phone ? (
                  <div className="flex items-center gap-1.5">
                    <FiPhone size={13} className="text-slate-400" />
                    <span>{s.phone}</span>
                  </div>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3 text-xs text-slate-500">
                {s.address ? (
                  <div className="flex items-center gap-1.5">
                    <FiMapPin size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate max-w-xs">{s.address}</span>
                  </div>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(s)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      title="Edit Supplier"
                    >
                      <FiEdit2 size={15} />
                    </button>
                  )}
                  {onArchive && (
                    <button
                      onClick={() => onArchive(s)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      title="Deactivate Supplier"
                    >
                      <FiTrash2 size={15} />
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
