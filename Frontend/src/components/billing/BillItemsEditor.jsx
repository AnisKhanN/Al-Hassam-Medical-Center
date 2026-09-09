import { FiPlus, FiTrash2 } from "react-icons/fi";

const CATEGORIES = [
  "Consultation",
  "Medicine",
  "Lab Test",
  "Procedure",
  "Other",
];

const BillItemsEditor = ({
  fields,
  append,
  remove,
  register,
  watch,
  errors,
}) => {
  const items = watch("items") || [];
  const subtotal = items.reduce(
    (sum, it) =>
      sum + (Number(it?.quantity) || 0) * (Number(it?.unitPrice) || 0),
    0,
  );

  const inputClass =
    "rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          Billable Services &amp; Line Items
        </label>
        <button
          type="button"
          onClick={() =>
            append({
              description: "",
              category: "Other",
              quantity: 1,
              unitPrice: "",
            })
          }
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          <FiPlus size={13} /> Add Line Item
        </button>
      </div>

      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-12 gap-2 items-center rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-2">
            <input
              placeholder="Item description / Service name"
              className={`col-span-5 ${inputClass}`}
              {...register(`items.${index}.description`, { required: true })}
            />
            <select
              className={`col-span-3 ${inputClass}`}
              {...register(`items.${index}.category`)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="dark:bg-slate-900 dark:text-white">
                  {c}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              placeholder="Qty"
              className={`col-span-1 text-center ${inputClass}`}
              {...register(`items.${index}.quantity`, {
                required: true,
                min: 1,
                valueAsNumber: true,
              })}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Unit Price"
              className={`col-span-2 ${inputClass}`}
              {...register(`items.${index}.unitPrice`, {
                required: true,
                min: 0,
                valueAsNumber: true,
              })}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
              className="col-span-1 flex items-center justify-center rounded-xl p-2 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 hover:text-rose-600 dark:hover:text-rose-400 disabled:cursor-not-allowed disabled:opacity-30 transition"
              title="Remove item"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      {errors.items && (
        <p className="mt-1 text-xs text-rose-500 font-medium">
          Every line item requires a description, quantity, and unit price.
        </p>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-sm">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Subtotal before discount
        </span>
        <div className="font-semibold text-slate-800 dark:text-slate-200">
          Subtotal:{" "}
          <span className="text-base font-black text-blue-600 dark:text-blue-400 ml-1">
            Rs. {subtotal.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BillItemsEditor;
