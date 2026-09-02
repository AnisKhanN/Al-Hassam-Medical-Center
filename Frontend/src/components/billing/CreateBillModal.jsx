import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import PatientSearchSelect from "../common/PatientSearchSelect";
import AppointmentSelect from "./AppointmentSelect";
import BillItemsEditor from "./BillItemsEditor";

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
      navigate(`/billing/${bill._id}`); // straight to detail — the receptionist usually records a payment right away
    } catch (err) {
      setError("root", {
        message: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400";
  const labelClass = "mb-1 block text-sm font-medium text-slate-600";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                Generate Bill
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
                    Linked Appointment (optional)
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
                  <label className={labelClass}>Discount (Rs.)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={inputClass}
                    {...register("discount", { min: 0, valueAsNumber: true })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Notes (optional)</label>
                  <input className={inputClass} {...register("notes")} />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {isSubmitting ? "Generating..." : "Generate Bill"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateBillModal;
