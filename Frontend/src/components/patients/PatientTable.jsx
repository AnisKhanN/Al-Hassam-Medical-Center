import { Link } from 'react-router-dom';
import { FiEdit2, FiArchive, FiEye } from 'react-icons/fi';

const PatientTable = ({ patients, onEdit, onArchive }) => {
  if (patients.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
          No patients found matching your search.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-left text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
            <th className="px-5 py-3.5">Record ID</th>
            <th className="px-5 py-3.5">Full Name</th>
            <th className="px-5 py-3.5">Age / Gender</th>
            <th className="px-5 py-3.5">Contact Phone</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {patients.map((p) => (
            <tr
              key={p._id}
              className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors"
            >
              <td className="px-5 py-4">
                <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-900/50">
                  {p.patientId}
                </span>
              </td>
              <td className="px-5 py-4">
                <Link
                  to={`/patients/${p._id}`}
                  className="font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  {p.fullName}
                </Link>
                {p.cnic && (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                    CNIC: {p.cnic}
                  </p>
                )}
              </td>
              <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-1 font-medium">
                  {p.computedAge ?? p.age ?? "—"} yrs
                  <span className="text-slate-400 dark:text-slate-600">·</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-normal">
                    {p.gender}
                  </span>
                </span>
              </td>
              <td className="px-5 py-4 font-mono text-xs text-slate-600 dark:text-slate-300">
                {p.phone || "—"}
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-end gap-1.5">
                  <Link
                    to={`/patients/${p._id}`}
                    className="rounded-xl p-2 text-slate-400 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="View Full Patient EHR Profile"
                  >
                    <FiEye size={16} />
                  </Link>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(p)}
                      className="rounded-xl p-2 text-slate-400 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Edit Patient Details"
                    >
                      <FiEdit2 size={16} />
                    </button>
                  )}
                  {onArchive && (
                    <button
                      onClick={() => onArchive(p)}
                      className="rounded-xl p-2 text-slate-400 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/60 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Archive Patient Record"
                    >
                      <FiArchive size={16} />
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

export default PatientTable;