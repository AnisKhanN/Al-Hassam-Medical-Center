import { format } from "date-fns";

const isExpiringSoon = (date) => {
  const days = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24);
  return days <= 30 && days >= 0;
};
const isExpired = (date) => new Date(date) < new Date();

const BatchTable = ({ batches }) => {
  if (!batches || batches.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-slate-400">
        No batches yet — add stock to get started.
      </p>
    );
  }

  const sorted = [...batches].sort(
    (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate),
  );

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
          <th className="py-2">Batch #</th>
          <th className="py-2 text-right">Quantity</th>
          <th className="py-2 text-right">Cost Price</th>
          <th className="py-2">Expiry</th>
          <th className="py-2">Received</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((b) => (
          <tr key={b._id} className="border-b border-slate-50 last:border-0">
            <td className="py-2 font-mono text-xs text-slate-500">
              {b.batchNumber}
            </td>
            <td
              className={`py-2 text-right ${b.quantity === 0 ? "text-slate-300" : "text-slate-700"}`}
            >
              {b.quantity}
            </td>
            <td className="py-2 text-right text-slate-500">
              Rs. {b.costPrice}
            </td>
            <td
              className={`py-2 ${isExpired(b.expiryDate) ? "font-medium text-red-600" : isExpiringSoon(b.expiryDate) ? "text-amber-600" : "text-slate-500"}`}
            >
              {format(new Date(b.expiryDate), "dd MMM yyyy")}
              {isExpired(b.expiryDate) && " (expired)"}
            </td>
            <td className="py-2 text-slate-400">
              {format(new Date(b.receivedDate), "dd MMM yyyy")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BatchTable;
