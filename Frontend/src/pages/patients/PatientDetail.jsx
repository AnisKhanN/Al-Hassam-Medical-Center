import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import { usePatient } from '../../hooks/usePatient';
import { useAuth } from '../../hooks/useAuth';
import MedicalHistoryList from '../../components/patients/MedicalHistoryList';
import AddVisitModal from '../../components/patients/AddVisitModal';

const InfoRow = ({ label, value }) => (
    <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-sm text-slate-700">{value || '—'}</p>
    </div>
);

const PatientDetail = () => {
    const { id } = useParams();
    const { patient, loading, error, addHistoryEntry } = usePatient(id);
    const { user } = useAuth();
    const [visitModalOpen, setVisitModalOpen] = useState(false);
    const isDoctor = user?.role === 'Doctor'; // only Doctors write clinical visit notes, per RBAC

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            </div>
        );
    }

    if (error || !patient) {
        return <div className="p-8 text-sm text-red-600">{error || 'Patient not found'}</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40 p-6 md:p-8">
            <Link to="/patients" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
                <FiArrowLeft size={14} /> Back to Patients
            </Link>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Profile card */}
                <div className="rounded-2xl border border-slate-100 bg-white/70 p-6 shadow-sm backdrop-blur md:col-span-1">
                    <p className="mb-1 font-mono text-xs text-slate-400">{patient.patientId}</p>
                    <h1 className="mb-4 text-xl font-semibold text-slate-800">{patient.fullName}</h1>

                    <div className="space-y-3">
                        <InfoRow label="Guardian" value={patient.guardianName} />
                        <InfoRow label="Age / Gender" value={`${patient.computedAge ?? patient.age ?? '—'} / ${patient.gender}`} />
                        <InfoRow label="CNIC" value={patient.cnic} />
                        <InfoRow label="Phone" value={patient.phone} />
                        <InfoRow label="Alternate Phone" value={patient.alternatePhone} />
                        <InfoRow label="Address" value={patient.address} />
                        <InfoRow label="Blood Group" value={patient.bloodGroup} />
                        <InfoRow label="Allergies" value={patient.allergies?.join(', ')} />
                        {patient.emergencyContact?.name && (
                            <InfoRow
                                label="Emergency Contact"
                                value={`${patient.emergencyContact.name} (${patient.emergencyContact.relation || '—'}) — ${patient.emergencyContact.phone || '—'}`}
                            />
                        )}
                    </div>
                </div>

                {/* Medical history */}
                <div className="rounded-2xl border border-slate-100 bg-white/70 p-6 shadow-sm backdrop-blur md:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-800">Medical History</h2>
                        {isDoctor && (
                            <button
                                onClick={() => setVisitModalOpen(true)}
                                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                            >
                                <FiPlus size={14} /> Add Visit
                            </button>
                        )}
                    </div>
                    <MedicalHistoryList history={patient.medicalHistory} />
                </div>
            </div>

            <AddVisitModal isOpen={visitModalOpen} onClose={() => setVisitModalOpen(false)} onSubmit={addHistoryEntry} />
        </div>
    );
};

export default PatientDetail;