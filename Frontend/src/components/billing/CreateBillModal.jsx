import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import PatientSearchSelect from "../common/PatientSearchSelect";
import AppointmentSelect from "./AppointmentSelect";
import BillItemsEditor from "./BillItemsEditor";
import RupeeIcon from "../common/RupeeIcon";

const CreateBillModal = ({ isOpen, onClose, onSubmit }) => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [appointmentId, setAppointmentId] = useState(null);
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: {
      items: [
        {
          description: "",
          category: "Consultation",
          quantity: 1,
          unitPrice: "",
        },
      ],
      discount: 0,
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const close = () => {
    setPatient(null);
    setAppointmentId(null);
    reset({
      items: [
        {
          description: "",
          category: "Consultation",
          quantity: 1,
          unitPrice: "",
        },
      ],
      discount: 0,
    });
    onClose();
  };

  const submit = async (values) => {
    if (!patient) {
      setError("root", { message: "Select a patient first" });
      return;
    }
    try {
      const bill = await onSubmit({
        patient: patient._id,
        appointment: appointmentId || undefined,
        items: values.items.map((it) => ({
          ...it,
          quantity: Number(it.quantity),
          unitPrice: Number(it.unitPrice),
        })),
        discount: Number(values.discount) || 0,
        notes: values.notes || undefined,
      });
      close();
      navigate(`/billing/${bill._id}`);
    } catch (err) {
      setError("root", {
        message: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all";
  const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400";

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
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
                  <RupeeIcon size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Generate Patient Invoice
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Create billing ledger and line item receipts
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
              <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 px-3.5 py-2 text-sm text-red-600 dark:text-red-300">
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
                <PatientSearchSelect
                  value={patient}
                  onChange={(p) => {
                    setPatient(p);
                    setAppointmentId(null);
                  }}
                />
              </div>

              {patient && (
                <div>
                  <label className={labelClass}>
                    Linked Consultation (optional)
                  </label>
                  <AppointmentSelect
                    patientId={patient._id}
                    value={appointmentId}
                    onChange={setAppointmentId}
                  />
                </div>
              )}

              <BillItemsEditor
                fields={fields}
                append={append}
                remove={remove}
                register={register}
                watch={watch}
                errors={errors}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Discount concession (Rs.)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    className={inputClass}
                    {...register("discount", { min: 0, valueAsNumber: true })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Billing Remarks (optional)</label>
                  <input className={inputClass} placeholder="Payment terms or notes" {...register("notes")} />
                </div>
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
                  {isSubmitting ? "Generating..." : "Generate Bill"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateBillModal;
