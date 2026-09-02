import { Link } from 'react-router-dom';
import { FiEdit2, FiArchive, FiEye } from 'react-icons/fi';

const PatientTable = ({ patients, onEdit, onArchive }) => {
    if (patients.length === 0) {
        return <p className="py-10 text-center text-sm text-slate-400">No patients found.</p>;
    }

    return (
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Age / Gender</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {patients.map((p) => (
                    <tr key={p._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.patientId}</td>
                        <td className="px-4 py-3 font-medium text-slate-700">{p.fullName}</td>
                        <td className="px-4 py-3 text-slate-500">{p.computedAge ?? p.age ?? '—'} / {p.gender}</td>
                        <td className="px-4 py-3 text-slate-500">{p.phone}</td>
                        <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                                <Link to={`/patients/${p._id}`} className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600" title="View">
                                    <FiEye size={15} />
                                </Link>
                                <button onClick={() => onEdit(p)} className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600" title="Edit">
                                    <FiEdit2 size={15} />
                                </button>
                                <button onClick={() => onArchive(p)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600" title="Archive">
                                    <FiArchive size={15} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PatientTable;