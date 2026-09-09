import { format } from 'date-fns';
import { FiActivity, FiUser, FiClock, FiFileText } from 'react-icons/fi';

const VISIT_STYLES = {
    Emergency: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-900',
    'Follow-up': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900',
    OPD: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    'Routine Checkup': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900',
};

const MedicalHistoryList = ({ history }) => {
    if (!history || history.length === 0) {
        return (
            <div className="py-12 text-center">
                <FiActivity className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No clinical visits recorded yet.</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Click "Add Visit" to log consultation notes &amp; vital signs.</p>
            </div>
        );
    }

    const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="space-y-3.5">
            {sorted.map((entry) => {
                const hasVitals = entry.vitals && (
                    entry.vitals.bp ||
                    entry.vitals.pulse ||
                    entry.vitals.temp ||
                    entry.vitals.weight ||
                    entry.vitals.spO2
                );

                return (
                    <div
                        key={entry._id}
                        className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition hover:shadow-sm"
                    >
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${VISIT_STYLES[entry.visitType] || VISIT_STYLES.OPD}`}>
                                    {entry.visitType}
                                </span>
                                {entry.diagnosis && (
                                    <span className="rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:text-purple-300">
                                        Dx: {entry.diagnosis}
                                    </span>
                                )}
                            </div>
                            <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                                <FiClock size={12} />
                                {format(new Date(entry.date), 'dd MMM yyyy • hh:mm a')}
                            </span>
                        </div>

                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                            {entry.reason}
                        </p>

                        {/* Longitudinal Vitals Bar */}
                        {hasVitals && (
                            <div className="my-2.5 flex flex-wrap gap-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 p-2.5 border border-slate-100 dark:border-slate-800/80 text-xs">
                                <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
                                    <FiActivity size={13} className="text-blue-500" />
                                    Vitals:
                                </span>
                                {entry.vitals.bp && (
                                    <span className="rounded-md bg-white dark:bg-slate-900 px-2 py-0.5 font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                        BP: <strong className="text-slate-900 dark:text-white">{entry.vitals.bp}</strong>
                                    </span>
                                )}
                                {entry.vitals.pulse && (
                                    <span className="rounded-md bg-white dark:bg-slate-900 px-2 py-0.5 font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                        Pulse: <strong className="text-slate-900 dark:text-white">{entry.vitals.pulse} bpm</strong>
                                    </span>
                                )}
                                {entry.vitals.temp && (
                                    <span className="rounded-md bg-white dark:bg-slate-900 px-2 py-0.5 font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                        Temp: <strong className="text-slate-900 dark:text-white">{entry.vitals.temp} °F</strong>
                                    </span>
                                )}
                                {entry.vitals.weight && (
                                    <span className="rounded-md bg-white dark:bg-slate-900 px-2 py-0.5 font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                        Weight: <strong className="text-slate-900 dark:text-white">{entry.vitals.weight}</strong>
                                    </span>
                                )}
                                {entry.vitals.spO2 && (
                                    <span className="rounded-md bg-white dark:bg-slate-900 px-2 py-0.5 font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                        SpO2: <strong className="text-slate-900 dark:text-white">{entry.vitals.spO2}</strong>
                                    </span>
                                )}
                            </div>
                        )}

                        {entry.notes && (
                            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                <span className="font-semibold text-slate-500">Doctor Notes: </span>
                                {entry.notes}
                            </p>
                        )}

                        {entry.recordedBy?.name && (
                            <div className="mt-2.5 flex items-center justify-end text-[11px] text-slate-400 dark:text-slate-500 gap-1">
                                <FiUser size={12} />
                                <span>Attending: Dr. {entry.recordedBy.name}</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default MedicalHistoryList;