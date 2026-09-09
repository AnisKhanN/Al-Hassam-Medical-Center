import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiActivity, FiFileText } from 'react-icons/fi';

const AddVisitModal = ({ isOpen, onClose, onSubmit }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setError } = useForm({
        defaultValues: {
            visitType: 'OPD',
            reason: '',
            diagnosis: '',
            notes: '',
            vitals: {
                bp: '',
                pulse: '',
                temp: '',
                weight: '',
                spO2: '',
            },
        },
    });

    const submit = async (values) => {
        try {
            await onSubmit(values);
            reset();
            onClose();
        } catch (err) {
            setError('root', { message: err.response?.data?.message || 'Something went wrong saving visit record' });
        }
    };

    const inputClass = 'w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 my-8"
                    >
                        <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <FiActivity className="text-blue-600" />
                                    Record Clinical Consultation &amp; Vitals
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Appends directly to patient's longitudinal EHR timeline
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        {errors.root && (
                            <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 px-3.5 py-2 text-xs text-red-600 dark:text-red-300">
                                {errors.root.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Visit Type *
                                    </label>
                                    <select className={inputClass} {...register('visitType')}>
                                        <option value="OPD">OPD Consultation</option>
                                        <option value="Follow-up">Follow-up Review</option>
                                        <option value="Emergency">Emergency / Acute</option>
                                        <option value="Routine Checkup">Routine Preventive Checkup</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Chief Complaint / Reason *
                                    </label>
                                    <input
                                        placeholder="e.g. High grade fever, coughing"
                                        className={inputClass}
                                        {...register('reason', { required: 'Reason is required' })}
                                    />
                                    {errors.reason && <p className="mt-1 text-[10px] text-red-500">{errors.reason.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Clinical Diagnosis / Clinical Impression (Optional)
                                </label>
                                <input
                                    placeholder="e.g. Acute Viral Bronchitis, Essential Hypertension"
                                    className={inputClass}
                                    {...register('diagnosis')}
                                />
                            </div>

                            {/* Vitals Recording Section */}
                            <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 p-3.5">
                                <div className="mb-2.5 flex items-center justify-between">
                                    <span className="text-xs font-bold text-blue-950 dark:text-blue-300 flex items-center gap-1.5">
                                        <FiActivity size={14} className="text-blue-600" />
                                        Recorded Vital Signs (EHR Longitudinal Tracking)
                                    </span>
                                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Auto-synced</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                    <div>
                                        <label className="mb-0.5 block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                                            BP (mmHg)
                                        </label>
                                        <input
                                            placeholder="120/80"
                                            className={inputClass}
                                            {...register('vitals.bp')}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-0.5 block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                                            Pulse (bpm)
                                        </label>
                                        <input
                                            placeholder="76"
                                            className={inputClass}
                                            {...register('vitals.pulse')}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-0.5 block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                                            Temp (°F)
                                        </label>
                                        <input
                                            placeholder="98.6"
                                            className={inputClass}
                                            {...register('vitals.temp')}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-0.5 block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                                            Weight
                                        </label>
                                        <input
                                            placeholder="68 kg"
                                            className={inputClass}
                                            {...register('vitals.weight')}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-0.5 block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                                            SpO2 (%)
                                        </label>
                                        <input
                                            placeholder="98%"
                                            className={inputClass}
                                            {...register('vitals.spO2')}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                    <FiFileText size={13} className="text-slate-400" />
                                    Doctor Consultation Notes &amp; Observations
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Patient reports symptoms started 3 days ago. Chest auscultation clear. Advised blood CP, fluid intake, and rest."
                                    className={inputClass}
                                    {...register('notes')}
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 transition-all"
                                >
                                    {isSubmitting ? 'Saving to EHR...' : 'Save Visit & Vitals'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddVisitModal;