import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiTruck } from "react-icons/fi";

const SupplierFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingSupplier,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();
  const isEditMode = Boolean(editingSupplier);

  useEffect(() => {
    if (!isOpen) return;
    reset(
      isEditMode
        ? {
            name: editingSupplier.name,
            contactPerson: editingSupplier.contactPerson || "",
            phone: editingSupplier.phone || "",
            address: editingSupplier.address || "",
          }
        : {
            name: "",
            contactPerson: "",
            phone: "",
            address: "",
          },
    );
  }, [isOpen, editingSupplier, isEditMode, reset]);

  const submit = async (values) => {
    try {
      await onSubmit({
        name: values.name.trim(),
        contactPerson: values.contactPerson?.trim() || undefined,
        phone: values.phone?.trim() || undefined,
        address: values.address?.trim() || undefined,
      });
      onClose();
    } catch (err) {
      setError("root", {
        message: err.response?.data?.message || "Failed to save supplier",
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
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40">
                  <FiTruck size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {isEditMode ? "Edit Supplier" : "Register Supplier"}
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Procurement & pharmaceutical distribution
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
                <label className={labelClass}>Supplier / Company Name *</label>
                <input
                  className={inputClass}
                  placeholder="e.g. Pfizer Pharmaceuticals Ltd."
                  {...register("name", {
                    required: "Supplier company name is required",
                  })}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Point of Contact Person</label>
                <input
                  className={inputClass}
                  placeholder="e.g. Ali Ahmed (Regional Rep)"
                  {...register("contactPerson")}
                />
              </div>

              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  className={inputClass}
                  placeholder="e.g. 0300-1234567"
                  {...register("phone")}
                />
              </div>

              <div>
                <label className={labelClass}>Distribution / Warehouse Address</label>
                <textarea
                  rows={2}
                  className={inputClass}
                  placeholder="Street, City, Warehouse location"
                  {...register("address")}
                />
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
                  {isSubmitting
                    ? "Saving..."
                    : isEditMode
                      ? "Save Changes"
                      : "Add Supplier"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SupplierFormModal;
