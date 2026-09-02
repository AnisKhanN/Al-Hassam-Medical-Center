import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

const RecordPaymentModal = ({ isOpen, onClose, onSubmit, balanceDue }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
    setError,
  } = useForm();
  const method = watch("method");

  useEffect(() => {
    if (isOpen) reset({ amount: balanceDue, method: "Cash", reference: "" });
  }, [isOpen, balanceDue, reset]);

  const submit = async (values) => {
    try {
      await onSubmit({
        amount: Number(values.amount),
        method: values.method,
        reference: values.reference || undefined,
      });
      onClose();
    } catch (err) {
      setError("root", {
        message: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                Record Payment
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <FiX size={18} />
              </button>
            </div>
            <p className="mb-4 text-sm text-slate-500">
              Balance due:{" "}
              <span className="font-medium text-slate-700">
                Rs. {balanceDue.toLocaleString()}
              </span>
            </p>

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
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  Amount (Rs.)
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  max={balanceDue}
                  className={inputClass}
                  {...register("amount", {
                    required: true,
                    min: 0.01,
                    max: {
                      value: balanceDue,
                      message: `Cannot exceed Rs. ${balanceDue}`,
                    },
                    valueAsNumber: true,
                  })}
                />
                {errors.amount && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.amount.message || "A valid amount is required"}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  Method
                </label>
                <select className={inputClass} {...register("method")}>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {(method === "Card" || method === "Bank Transfer") && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-600">
                    Reference / Transaction No.
                  </label>
                  <input className={inputClass} {...register("reference")} />
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-60"
              >
                {isSubmitting ? "Recording..." : "Record Payment"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecordPaymentModal;
