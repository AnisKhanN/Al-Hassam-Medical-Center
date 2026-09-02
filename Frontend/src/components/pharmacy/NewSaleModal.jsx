import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import MedicineSearchSelect from "../common/MedicineSearchSelect";

const emptyRow = () => ({ medicine: null, quantity: 1, unitPrice: "" });

const NewSaleModal = ({ isOpen, onClose, onSubmit }) => {
  const [rows, setRows] = useState([emptyRow()]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const close = () => {
    setRows([emptyRow()]);
    reset();
    onClose();
  };

  const updateRow = (index, patch) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  };

  const selectMedicine = (index, medicine) => {
    updateRow(index, {
      medicine,
      unitPrice: medicine ? medicine.unitPrice : "",
    });
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);
  const removeRow = (index) =>
    setRows((prev) => prev.filter((_, i) => i !== index));

  const subtotal = rows.reduce(
    (sum, r) => sum + (Number(r.quantity) || 0) * (Number(r.unitPrice) || 0),
    0,
  );

  const submit = async (values) => {
    const incomplete = rows.some(
      (r) => !r.medicine || !r.quantity || r.quantity <= 0,
    );
    if (incomplete) {
      setError("root", {
        message: "Select a medicine and a valid quantity for every row",
      });
      return;
    }
    try {
      await onSubmit({
        items: rows.map((r) => ({
          medicine: r.medicine._id,
          quantity: Number(r.quantity),
          unitPrice: r.unitPrice !== "" ? Number(r.unitPrice) : undefined,
        })),
        customerName: values.customerName || undefined,
        customerPhone: values.customerPhone || undefined,
      });
      close();
    } catch (err) {
      // surfaces the backend's 409 "insufficient stock" message directly
      setError("root", {
        message: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400";

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
              <h2 className="text-lg font-semibold text-slate-800">New Sale</h2>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-600">
                    Customer Name (optional)
                  </label>
                  <input className={inputClass} {...register("customerName")} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-600">
                    Customer Phone (optional)
                  </label>
                  <input
                    className={inputClass}
                    {...register("customerPhone")}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-600">
                    Items
                  </label>
                  <button
                    type="button"
                    onClick={addRow}
                    className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                  >
                    <FiPlus size={13} /> Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {rows.map((row, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 items-start gap-2"
                    >
                      <div className="col-span-6">
                        <MedicineSearchSelect
                          value={row.medicine}
                          onChange={(m) => selectMedicine(index, m)}
                        />
                      </div>
                      <input
                        type="number"
                        min="1"
                        max={row.medicine?.totalStock || undefined}
                        placeholder="Qty"
                        value={row.quantity}
                        onChange={(e) =>
                          updateRow(index, { quantity: e.target.value })
                        }
                        className={`col-span-2 ${inputClass}`}
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Price"
                        value={row.unitPrice}
                        onChange={(e) =>
                          updateRow(index, { unitPrice: e.target.value })
                        }
                        className={`col-span-3 ${inputClass}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        disabled={rows.length === 1}
                        className="col-span-1 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-2 text-right text-sm text-slate-500">
                  Total:{" "}
                  <span className="font-medium text-slate-700">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {isSubmitting ? "Recording..." : "Record Sale"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewSaleModal;
