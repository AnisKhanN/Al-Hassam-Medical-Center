import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

const UNITS = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Injection",
  "Ointment",
  "Drops",
  "Other",
];

const MedicineFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingMedicine,
  categories,
  suppliers,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();
  const isEditMode = Boolean(editingMedicine);

  useEffect(() => {
    if (!isOpen) return;
    reset(
      isEditMode
        ? {
            name: editingMedicine.name,
            genericName: editingMedicine.genericName || "",
            category: editingMedicine.category,
            unit: editingMedicine.unit,
            supplier: editingMedicine.supplier?._id || "",
            unitPrice: editingMedicine.unitPrice,
            reorderLevel: editingMedicine.reorderLevel,
          }
        : { unit: "Tablet", reorderLevel: 20 },
    );
  }, [isOpen, editingMedicine, isEditMode, reset]);

  const submit = async (values) => {
    try {
      await onSubmit({
        name: values.name,
        genericName: values.genericName || undefined,
        category: values.category,
        unit: values.unit,
        supplier: values.supplier || undefined,
        unitPrice: Number(values.unitPrice),
        reorderLevel: Number(values.reorderLevel),
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
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                {isEditMode ? "Edit Medicine" : "Add Medicine"}
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
            {!isEditMode && (
              <p className="mb-4 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-600">
                This registers the catalog entry only. Add stock afterward from
                the medicine's detail page.
              </p>
            )}

            <form
              onSubmit={handleSubmit(submit)}
              noValidate
              className="space-y-4"
            >
              <div>
                <label className={labelClass}>Name</label>
                <input
                  className={inputClass}
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Generic Name</label>
                  <input className={inputClass} {...register("genericName")} />
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <input
                    list="category-options"
                    className={inputClass}
                    {...register("category", {
                      required: "Category is required",
                    })}
                  />
                  <datalist id="category-options">
                    {categories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                  {errors.category && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Unit</label>
                  <select className={inputClass} {...register("unit")}>
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Supplier (optional)</label>
                  <select className={inputClass} {...register("supplier")}>
                    <option value="">None</option>
                    {suppliers.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Unit Price (Rs.)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={inputClass}
                    {...register("unitPrice", {
                      required: "Required",
                      min: 0,
                      valueAsNumber: true,
                    })}
                  />
                  {errors.unitPrice && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.unitPrice.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Reorder Level</label>
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    {...register("reorderLevel", {
                      min: 0,
                      valueAsNumber: true,
                    })}
                  />
                </div>
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
                    : "Add Medicine"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MedicineFormModal;
