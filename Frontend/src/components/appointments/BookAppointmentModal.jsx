import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCalendar, FiVideo } from "react-icons/fi";
import PatientSearchSelect from "../common/PatientSearchSelect";
import { useDoctors } from "../../hooks/useDoctors";

const BookAppointmentModal = ({
  isOpen,
  onClose,
  onSubmit,
  defaultDate,
  defaultDoctorId = "",
  defaultReason = "",
}) => {
  const { doctors, loading: doctorsLoading } = useDoctors();
  const [patient, setPatient] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: { duration: 30, doctor: defaultDoctorId, reason: defaultReason },
  });

  useEffect(() => {
    if (isOpen) {
      if (defaultDoctorId) setValue("doctor", defaultDoctorId);
      if (defaultReason) setValue("reason", defaultReason);
    }
  }, [isOpen, defaultDoctorId, defaultReason, setValue]);

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
      const isTelemedicine = Boolean(values.isTelemedicine);
      const meetingRoomId = isTelemedicine
        ? `tele-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`
        : null;

      await onSubmit({
        patient: patient._id,
        doctor: values.doctor,
        appointmentDate: new Date(
          `${values.date}T${values.time}`,
        ).toISOString(),
        duration: Number(values.duration),
        reason: values.reason,
        isTelemedicine,
        meetingRoomId,
        meetingStatus: isTelemedicine ? "Waiting" : "Scheduled",
      });
      close();
    } catch (err) {
      setError("root", {
        message: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all";
  const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400";
  const today = new Date().toISOString().slice(0, 10);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
                  <FiCalendar size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Schedule Consultation
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Book clinical appointment or telemedicine session
                  </p>
                </div>
              </div>
              <button
                onClick={close}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                <FiX size={18} />
              </button>
            </div>

            {errors.root && (
              <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-300">
                {errors.root.message}
              </div>
            )}

            <form
              onSubmit={handleSubmit(submit)}
              noValidate
              className="space-y-4"
            >
              <div>
                <label className={labelClass}>Patient Profile *</label>
                <PatientSearchSelect value={patient} onChange={setPatient} />
              </div>

              <div>
                <label className={labelClass}>Consulting Clinician *</label>
                <select
                  className={inputClass}
                  disabled={doctorsLoading}
                  {...register("doctor", { required: "Select a doctor" })}
                >
                  <option value="" className="dark:bg-slate-900 dark:text-white">
                    {doctorsLoading ? "Loading clinicians..." : "Select clinician"}
                  </option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id} className="dark:bg-slate-900 dark:text-white">
                      Dr. {d.name} {d.specialization ? `(${d.specialization})` : ""}
                    </option>
                  ))}
                </select>
                {errors.doctor && (
                  <p className="mt-1 text-xs text-red-500 font-medium">
                    {errors.doctor.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Date *</label>
                  <input
                    type="date"
                    min={today}
                    defaultValue={defaultDate}
                    className={inputClass}
                    {...register("date", { required: "Required" })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Time *</label>
                  <input
                    type="time"
                    className={inputClass}
                    {...register("time", { required: "Required" })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Duration</label>
                  <select className={inputClass} {...register("duration")}>
                    {[15, 30, 45, 60].map((d) => (
                      <option key={d} value={d} className="dark:bg-slate-900 dark:text-white">
                        {d} mins
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Chief Complaint / Reason *</label>
                <input
                  className={inputClass}
                  placeholder="e.g. Routine checkup, fever, lab review"
                  {...register("reason", { required: "Reason is required" })}
                />
                {errors.reason && (
                  <p className="mt-1 text-xs text-red-500 font-medium">
                    {errors.reason.message}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-purple-200/80 dark:border-purple-800/60 bg-purple-50/70 dark:bg-purple-950/40 p-3.5">
                <input
                  type="checkbox"
                  id="telemedicine"
                  className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  {...register("isTelemedicine")}
                />
                <label htmlFor="telemedicine" className="text-xs font-semibold text-purple-900 dark:text-purple-200 cursor-pointer">
                  <span className="flex items-center gap-1.5 font-bold">
                    <FiVideo size={14} className="text-purple-600 dark:text-purple-400" />
                    Virtual Telemedicine Video Consultation
                  </span>
                  <span className="block text-[11px] font-normal text-purple-700 dark:text-purple-300 mt-0.5">
                    Generates an instant WebRTC secure video room link for remote care.
                  </span>
                </label>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={close}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 shadow-md shadow-blue-500/25 disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? "Booking..." : "Book Appointment"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookAppointmentModal;
