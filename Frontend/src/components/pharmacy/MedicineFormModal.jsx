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
    setValue,
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
            barcode: editingMedicine.barcode || "",
            genericName: editingMedicine.genericName || "",
            category: editingMedicine.category,
            unit: editingMedicine.unit,
            supplier: editingMedicine.supplier?._id || "",
            unitPrice: editingMedicine.unitPrice,
            reorderLevel: editingMedicine.reorderLevel,
          }
        : { unit: "Tablet", reorderLevel: 20, barcode: "" },
    );
  }, [isOpen, editingMedicine, isEditMode, reset]);

  const submit = async (values) => {
    try {
      await onSubmit({
        name: values.name,
        barcode: values.barcode ? values.barcode.trim() : undefined,
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
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {isEditMode ? "Edit Medicine" : "Register New Medicine"}
              </h2>
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
            {!isEditMode && (
              <p className="mb-4 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 px-3.5 py-2 text-xs text-blue-700 dark:text-blue-300">
                This registers the formulation entry in the catalog. Add stock batches afterward from the medicine details ledger.
              </p>
            )}

            <form
              onSubmit={handleSubmit(submit)}
              noValidate
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <div className="flex items-center justify-between">
                    <label className={labelClass}>Barcode / SKU (optional)</label>
                    <button
                      type="button"
                      onClick={() => {
                        const randomBarcode = "896" + Math.floor(100000000 + Math.random() * 900000000);
                        setValue("barcode", randomBarcode);
                      }}
                      className="text-[11px] text-blue-600 hover:underline"
                    >
                      Generate Barcode
                    </button>
                  </div>
                  <input
                    className={inputClass}
                    placeholder="e.g. 8964000123456"
                    {...register("barcode")}
                  />
                </div>
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
                      : "Add Medicine"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MedicineFormModal;
