import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiPlus, FiActivity, FiCpu } from "react-icons/fi";
import { usePatient } from "../../hooks/usePatient";
import { useAuth } from "../../hooks/useAuth";
import MedicalHistoryList from "../../components/patients/MedicalHistoryList";
import AddVisitModal from "../../components/patients/AddVisitModal";
import AiVisitSummaryModal from "../../components/ai/AiVisitSummaryModal";
import useSEO from "../../hooks/useSEO";

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
      {label}
    </p>
    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
      {value || "—"}
    </p>
  </div>
);

const PatientDetail = () => {
  const { id } = useParams();
  const { patient, loading, error, addHistoryEntry } = usePatient(id);

  useSEO({
    title: patient
      ? `${patient.fullName} — Patient Profile & EHR`
      : "Patient Profile & EHR",
    description:
      "Detailed electronic medical record, longitudinal vitals timeline, and doctor visit history.",
  });

  const { user } = useAuth();
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const isDoctor = user?.role === "Doctor"; // only Doctors write clinical visit notes, per RBAC

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="p-8 text-sm text-red-600">
        {error || "Patient not found"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40 p-6 md:p-8 dark:from-slate-950 dark:to-slate-900">
      <Link
        to="/patients"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
      >
        <FiArrowLeft size={14} /> Back to Patients
      </Link>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile card */}
        <div className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 md:col-span-1">
          <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {patient.patientId}
          </p>
          <h1 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
            {patient.fullName}
          </h1>

          <div className="space-y-3 divide-y divide-slate-100/60 dark:divide-slate-800/60">
            <InfoRow label="Guardian" value={patient.guardianName} />
            <div className="pt-2.5">
              <InfoRow
                label="Age / Gender"
                value={`${patient.computedAge ?? patient.age ?? "—"} yrs / ${patient.gender}`}
              />
            </div>
            <div className="pt-2.5">
              <InfoRow label="CNIC" value={patient.cnic} />
            </div>
            <div className="pt-2.5">
              <InfoRow label="Phone" value={patient.phone} />
            </div>
            <div className="pt-2.5">
              <InfoRow label="Alternate Phone" value={patient.alternatePhone} />
            </div>
            <div className="pt-2.5">
              <InfoRow label="Address" value={patient.address} />
            </div>
            <div className="pt-2.5">
              <InfoRow label="Blood Group" value={patient.bloodGroup} />
            </div>
            <div className="pt-2.5">
              <InfoRow
                label="Allergies"
                value={patient.allergies?.join(", ")}
              />
            </div>
            {patient.emergencyContact?.name && (
              <div className="pt-2.5">
                <InfoRow
                  label="Emergency Contact"
                  value={`${patient.emergencyContact.name} (${patient.emergencyContact.relation || "—"}) — ${patient.emergencyContact.phone || "—"}`}
                />
              </div>
            )}
          </div>

          {/* Latest Vitals Snapshot */}
          {(() => {
            const lastWithVitals = [...(patient.medicalHistory || [])]
              .reverse()
              .find(
                (h) =>
                  h.vitals &&
                  (h.vitals.bp ||
                    h.vitals.pulse ||
                    h.vitals.temp ||
                    h.vitals.weight),
              );

            if (!lastWithVitals?.vitals) return null;
            const v = lastWithVitals.vitals;

            return (
              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 mb-2.5 flex items-center gap-1.5">
                  <FiActivity
                    size={14}
                    className="text-blue-600 dark:text-blue-400"
                  />
                  Latest Vitals Snapshot
                </p>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {v.bp && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">
                        BP:
                      </span>{" "}
                      <strong className="text-slate-900 dark:text-white">
                        {v.bp}
                      </strong>
                    </div>
                  )}
                  {v.pulse && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">
                        Pulse:
                      </span>{" "}
                      <strong className="text-slate-900 dark:text-white">
                        {v.pulse} bpm
                      </strong>
                    </div>
                  )}
                  {v.temp && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">
                        Temp:
                      </span>{" "}
                      <strong className="text-slate-900 dark:text-white">
                        {v.temp} °F
                      </strong>
                    </div>
                  )}
                  {v.weight && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">
                        Weight:
                      </span>{" "}
                      <strong className="text-slate-900 dark:text-white">
                        {v.weight}
                      </strong>
                    </div>
                  )}
                  {v.spO2 && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">
                        SpO2:
                      </span>{" "}
                      <strong className="text-slate-900 dark:text-white">
                        {v.spO2}
                      </strong>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Medical history */}
        <div className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 md:col-span-2">
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Medical History
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Longitudinal visit consultations, diagnosis notes &amp;
                prescriptions
              </p>
            </div>
            {isDoctor && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAiModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  <FiCpu size={14} /> AI Visit Summary
                </button>
                <button
                  onClick={() => setVisitModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
                >
                  <FiPlus size={14} /> Add Visit
                </button>
              </div>
            )}
          </div>
          <MedicalHistoryList history={patient.medicalHistory} />
        </div>
      </div>

      <AiVisitSummaryModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        patient={patient}
        initialNotes={
          patient.medicalHistory?.length
            ? [...patient.medicalHistory]
                .reverse()
                .find((h) => h.notes || h.reason)?.notes ||
              [...patient.medicalHistory]
                .reverse()
                .find((h) => h.notes || h.reason)?.reason ||
              ""
            : ""
        }
      />
      <AddVisitModal
        isOpen={visitModalOpen}
        onClose={() => setVisitModalOpen(false)}
        onSubmit={addHistoryEntry}
      />
    </div>
  );
};

export default PatientDetail;
