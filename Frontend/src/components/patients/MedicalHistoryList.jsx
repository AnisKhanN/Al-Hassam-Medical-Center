import { format } from 'date-fns'; // npm i date-fns if not already installed

const VISIT_STYLES = {
    Emergency: 'bg-red-50 text-red-700 border-red-200',
    'Follow-up': 'bg-blue-50 text-blue-700 border-blue-200',
    OPD: 'bg-slate-50 text-slate-600 border-slate-200',
    'Routine Checkup': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const MedicalHistoryList = ({ history }) => {
    if (!history || history.length === 0) {
        return <p className="py-6 text-center text-sm text-slate-400">No visits recorded yet.</p>;
    }

    const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="space-y-3">
            {sorted.map((entry) => (
                <div key={entry._id} className="rounded-xl border border-slate-100 bg-white/70 p-4">
                    <div className="mb-1.5 flex items-center justify-between">
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${VISIT_STYLES[entry.visitType] || VISIT_STYLES.OPD}`}>
                            {entry.visitType}
                        </span>
                        <span className="text-xs text-slate-400">{format(new Date(entry.date), 'dd MMM yyyy')}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-700">{entry.reason}</p>
                    {entry.notes && <p className="mt-1 text-sm text-slate-500">{entry.notes}</p>}
                    {entry.recordedBy?.name && <p className="mt-2 text-xs text-slate-400">Dr. {entry.recordedBy.name}</p>}
                </div>
            ))}
        </div>
    );
};

export default MedicalHistoryList;