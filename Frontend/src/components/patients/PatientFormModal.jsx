import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const BLOOD_GROUPS = ['Unknown', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const PatientFormModal = ({ isOpen, onClose, onSubmit, editingPatient }) => {
    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting }, setError } = useForm();
    const isEditMode = Boolean(editingPatient);
    const dobValue = watch('dateOfBirth');
    const ageValue = watch('age');

    useEffect(() => {
        if (!isOpen) return;
        if (isEditMode) {
            reset({
                fullName: editingPatient.fullName,
                guardianName: editingPatient.guardianName || '',
                cnic: editingPatient.cnic || '',
                dateOfBirth: editingPatient.dateOfBirth ? editingPatient.dateOfBirth.slice(0, 10) : '',
                age: editingPatient.age ?? '',
                gender: editingPatient.gender,
                phone: editingPatient.phone,
                alternatePhone: editingPatient.alternatePhone || '',
                address: editingPatient.address || '',
                bloodGroup: editingPatient.bloodGroup || 'Unknown',
                allergies: (editingPatient.allergies || []).join(', '),
                emergencyName: editingPatient.emergencyContact?.name || '',
                emergencyPhone: editingPatient.emergencyContact?.phone || '',
                emergencyRelation: editingPatient.emergencyContact?.relation || '',
            });
        } else {
            reset({ gender: 'Male', bloodGroup: 'Unknown' });
        }
    }, [isOpen, editingPatient, isEditMode, reset]);

    const submit = async (values) => {
        if (!values.dateOfBirth && !values.age) {
            setError('dateOfBirth', { message: 'Provide date of birth or age' });
            return;
        }
        try {
            await onSubmit({
                fullName: values.fullName,
                guardianName: values.guardianName || undefined,
                cnic: values.cnic || undefined,
                dateOfBirth: values.dateOfBirth || undefined,
                age: values.age ? Number(values.age) : undefined,
                gender: values.gender,
                phone: values.phone,
                alternatePhone: values.alternatePhone || undefined,
                address: values.address || undefined,
                bloodGroup: values.bloodGroup,
                allergies: values.allergies ? values.allergies.split(',').map((a) => a.trim()).filter(Boolean) : [],
                emergencyContact: {
                    name: values.emergencyName || undefined,
                    phone: values.emergencyPhone || undefined,
                    relation: values.emergencyRelation || undefined,
                },
            });
            onClose();
        } catch (err) {
            setError('root', { message: err.response?.data?.message || 'Something went wrong' });
        }
    };

    const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400';
    const labelClass = 'mb-1 block text-sm font-medium text-slate-600';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-800">{isEditMode ? 'Edit Patient' : 'Register Patient'}</h2>
                            <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><FiX size={18} /></button>
                        </div>

                        {errors.root && <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errors.root.message}</div>}

                        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Full Name</label>
                                    <input className={inputClass} {...register('fullName', { required: 'Full name is required' })} />
                                    {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Guardian Name</label>
                                    <input className={inputClass} {...register('guardianName')} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Date of Birth</label>
                                    <input type="date" className={inputClass} disabled={!!ageValue} {...register('dateOfBirth')} />
                                </div>
                                <div>
                                    <label className={labelClass}>Age (if DOB unknown)</label>
                                    <input type="number" min="0" max="130" className={inputClass} disabled={!!dobValue} {...register('age')} />
                                </div>
                            </div>
                            {errors.dateOfBirth && <p className="-mt-2 text-xs text-red-500">{errors.dateOfBirth.message}</p>}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Gender</label>
                                    <select className={inputClass} {...register('gender', { required: true })}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>CNIC (optional)</label>
                                    <input
                                        placeholder="12345-1234567-1"
                                        className={inputClass}
                                        {...register('cnic', { pattern: { value: /^\d{5}-\d{7}-\d{1}$/, message: 'Format: 12345-1234567-1' } })}
                                    />
                                    {errors.cnic && <p className="mt-1 text-xs text-red-500">{errors.cnic.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Phone</label>
                                    <input className={inputClass} {...register('phone', { required: 'Phone is required' })} />
                                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Alternate Phone</label>
                                    <input className={inputClass} {...register('alternatePhone')} />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Address</label>
                                <input className={inputClass} {...register('address')} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Blood Group</label>
                                    <select className={inputClass} {...register('bloodGroup')}>
                                        {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Allergies (comma separated)</label>
                                    <input placeholder="Penicillin, Dust" className={inputClass} {...register('allergies')} />
                                </div>
                            </div>

                            <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Emergency Contact</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <input placeholder="Name" className={inputClass} {...register('emergencyName')} />
                                    <input placeholder="Phone" className={inputClass} {...register('emergencyPhone')} />
                                    <input placeholder="Relation" className={inputClass} {...register('emergencyRelation')} />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                            >
                                {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Register Patient'}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PatientFormModal;