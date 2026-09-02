import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

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
                {isEditMode ? "Edit Supplier" : "Add Supplier"}
              </h2>
              <button
                onClick={onClose}
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
                <label className={labelClass}>Supplier / Company Name</label>
                <input
                  className={inputClass}
                  placeholder="e.g. Pfizer Pharmaceuticals"
                  {...register("name", {
                    required: "Supplier name is required",
                  })}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Contact Person</label>
                <input
                  className={inputClass}
                  placeholder="e.g. Ali Ahmed"
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
                <label className={labelClass}>Address</label>
                <textarea
                  rows={2}
                  className={inputClass}
                  placeholder="Warehouse / Office address"
                  {...register("address")}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                    ? "Save Changes"
                    : "Add Supplier"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SupplierFormModal;
