import { FiPlus, FiTrash2 } from "react-icons/fi";

const CATEGORIES = [
  "Consultation",
  "Medicine",
  "Lab Test",
  "Procedure",
  "Other",
];

// Tightly coupled to CreateBillModal's useFieldArray instance — not meant
// to be a standalone reusable form, just split out for readability.
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

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-slate-600">Items</label>
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
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
        >
          <FiPlus size={13} /> Add Item
        </button>
      </div>

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-12 gap-2">
            <input
              placeholder="Description"
              className="col-span-5 rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              {...register(`items.${index}.description`, { required: true })}
            />
            <select
              className="col-span-3 rounded-lg border border-slate-200 px-2 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              {...register(`items.${index}.category`)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              placeholder="Qty"
              className="col-span-1 rounded-lg border border-slate-200 px-2 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
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
              placeholder="Price"
              className="col-span-2 rounded-lg border border-slate-200 px-2 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
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
              className="col-span-1 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      {errors.items && (
        <p className="mt-1 text-xs text-red-500">
          Every item needs a description, quantity, and price.
        </p>
      )}

      <div className="mt-2 text-right text-sm text-slate-500">
        Subtotal:{" "}
        <span className="font-medium text-slate-700">
          Rs. {subtotal.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default BillItemsEditor;
