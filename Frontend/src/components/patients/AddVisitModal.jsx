import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const AddVisitModal = ({ isOpen, onClose, onSubmit }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setError } = useForm({
        defaultValues: { visitType: 'OPD', reason: '', notes: '' },
    });

    const submit = async (values) => {
        try {
            await onSubmit(values);
            reset();
            onClose();
        } catch (err) {
            setError('root', { message: err.response?.data?.message || 'Something went wrong' });
        }
    };

    const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-800">Record Visit</h2>
                            <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><FiX size={18} /></button>
                        </div>

                        {errors.root && <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errors.root.message}</div>}

                        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600">Visit Type</label>
                                <select className={inputClass} {...register('visitType')}>
                                    <option value="OPD">OPD</option>
                                    <option value="Follow-up">Follow-up</option>
                                    <option value="Emergency">Emergency</option>
                                    <option value="Routine Checkup">Routine Checkup</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600">Reason</label>
                                <input className={inputClass} {...register('reason', { required: 'Reason is required' })} />
                                {errors.reason && <p className="mt-1 text-xs text-red-500">{errors.reason.message}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600">Notes</label>
                                <textarea rows={3} className={inputClass} {...register('notes')} />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Visit'}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddVisitModal;