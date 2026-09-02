import { format } from "date-fns";
import { FiXCircle } from "react-icons/fi";

const STATUS_BADGES = {
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Voided: "bg-red-50 text-red-700 border-red-200",
};

const SalesTable = ({ sales = [], onVoid, canVoid = false }) => {
  if (sales.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-400">
        No sales recorded.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Sale ID / Date</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Items Sold</th>
            <th className="px-4 py-3">Total Amount</th>
            <th className="px-4 py-3">Sold By</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {sales.map((s) => {
            const isCompleted = s.status === "Completed";
            return (
              <tr
                key={s._id}
                className="transition hover:bg-slate-50/60"
              >
                <td className="px-4 py-3">
                  <span className="font-mono font-medium text-slate-800">
                    {s.saleId}
                  </span>
                  <p className="text-xs text-slate-400">
                    {format(new Date(s.createdAt), "dd MMM yyyy, h:mm a")}
                  </p>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  <p className="font-medium text-slate-800">
                    {s.customerName || "Walk-in Customer"}
                  </p>
                  {s.customerPhone && (
                    <p className="text-xs text-slate-400">{s.customerPhone}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <div className="max-w-xs truncate text-xs text-slate-600">
                    {s.items?.map((it, idx) => (
                      <span key={idx}>
                        {it.medicineName} (x{it.quantity})
                        {idx < s.items.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-800">
                  Rs. {s.totalAmount?.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {s.soldBy?.name || "Staff"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                      STATUS_BADGES[s.status] || "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    {s.status}
                  </span>
                  {s.status === "Voided" && s.voidReason && (
                    <p className="mt-0.5 text-[11px] text-red-500 italic truncate max-w-[150px]" title={s.voidReason}>
                      {s.voidReason}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {canVoid && isCompleted && onVoid && (
                    <button
                      onClick={() => onVoid(s)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      title="Void Sale"
                    >
                      <FiXCircle size={13} /> Void
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;
