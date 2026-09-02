import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import PatientSearchSelect from "../common/PatientSearchSelect";
import { useDoctors } from "../../hooks/useDoctors";

const BookAppointmentModal = ({ isOpen, onClose, onSubmit, defaultDate }) => {
  const { doctors, loading: doctorsLoading } = useDoctors();
  const [patient, setPatient] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ defaultValues: { duration: 30 } });

  const close = () => {
    setPatient(null);
    reset();
    onClose();
  };

  const submit = async (values) => {
    if (!patient) {
      setError("root", { message: "Select a patient first" });
      return;
    }
    try {
      await onSubmit({
        patient: patient._id,
        doctor: values.doctor,
        appointmentDate: new Date(
          `${values.date}T${values.time}`,
        ).toISOString(),
        duration: Number(values.duration),
        reason: values.reason,
      });
      close();
    } catch (err) {
      // surfaces the backend's 409 conflict message directly, e.g.
      // "This doctor already has an appointment in that time slot"
      setError("root", {
        message: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400";
  const labelClass = "mb-1 block text-sm font-medium text-slate-600";
  const today = new Date().toISOString().slice(0, 10);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                Book Appointment
              </h2>
              <button
                onClick={close}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <FiX size={18} />
              </button>
            </div>

            {errors.root && (
              <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {errors.root.message}
              </div>
            )}

            <form
              onSubmit={handleSubmit(submit)}
              noValidate
              className="space-y-4"
            >
              <div>
                <label className={labelClass}>Patient</label>
                <PatientSearchSelect value={patient} onChange={setPatient} />
              </div>

              <div>
                <label className={labelClass}>Doctor</label>
                <select
                  className={inputClass}
                  disabled={doctorsLoading}
                  {...register("doctor", { required: "Select a doctor" })}
                >
                  <option value="">
                    {doctorsLoading ? "Loading doctors..." : "Select doctor"}
                  </option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>
                      Dr. {d.name}
                    </option>
                  ))}
                </select>
                {errors.doctor && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.doctor.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Date</label>
                  <input
                    type="date"
                    min={today}
                    defaultValue={defaultDate}
                    className={inputClass}
                    {...register("date", { required: "Required" })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Time</label>
                  <input
                    type="time"
                    className={inputClass}
                    {...register("time", { required: "Required" })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Duration (min)</label>
                  <select className={inputClass} {...register("duration")}>
                    {[15, 30, 45, 60].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Reason</label>
                <input
                  className={inputClass}
                  {...register("reason", { required: "Reason is required" })}
                />
                {errors.reason && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.reason.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {isSubmitting ? "Booking..." : "Book Appointment"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookAppointmentModal;
