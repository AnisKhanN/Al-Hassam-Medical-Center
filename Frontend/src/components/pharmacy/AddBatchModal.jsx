import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiLayers } from "react-icons/fi";

const AddBatchModal = ({ isOpen, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const submit = async (values) => {
    try {
      await onSubmit({
        batchNumber: values.batchNumber.trim(),
        quantity: Number(values.quantity),
        costPrice: Number(values.costPrice),
        expiryDate: values.expiryDate,
      });
      reset();
      onClose();
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40">
                  <FiLayers size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Receive New Batch
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Restock medicine inventory with expiry
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
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
                <label className={labelClass}>Batch / Lot Number *</label>
                <input
                  className={inputClass}
                  placeholder="e.g. LOT-2026-X09"
                  {...register("batchNumber", {
                    required: "Batch number is required",
                  })}
                />
                {errors.batchNumber && (
                  <p className="mt-1 text-xs text-red-500 font-medium">
                    {errors.batchNumber.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Received Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Units"
                    className={inputClass}
                    {...register("quantity", { required: "Required", min: 1 })}
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
                      Min 1 unit
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Cost Price (Rs.) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Unit cost"
                    className={inputClass}
                    {...register("costPrice", { required: "Required", min: 0 })}
                  />
                  {errors.costPrice && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
                      Required
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass}>Batch Expiry Date (FEFO) *</label>
                <input
                  type="date"
                  min={today}
                  className={inputClass}
                  {...register("expiryDate", {
                    required: "Expiry date is required",
                  })}
                />
                {errors.expiryDate && (
                  <p className="mt-1 text-xs text-red-500 font-medium">
                    {errors.expiryDate.message}
                  </p>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 shadow-md shadow-blue-500/25 disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? "Receiving..." : "Receive Stock"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddBatchModal;
