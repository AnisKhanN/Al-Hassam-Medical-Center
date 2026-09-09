import { format } from "date-fns";
import { FiClock, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

const isExpiringSoon = (date) => {
  const days = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24);
  return days <= 60 && days >= 0;
};

const isExpired = (date) => new Date(date) < new Date();

const BatchTable = ({ batches }) => {
  if (!batches || batches.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
          <FiClock size={20} />
        </div>
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          No stock batches registered
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
          Click "Receive New Batch" to add lot numbers and expiry dates.
        </p>
      </div>
    );
  }

  const sorted = [...batches].sort(
    (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate),
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
            <th className="px-4 py-3">Batch / Lot #</th>
            <th className="px-4 py-3 text-right">Available Qty</th>
            <th className="px-4 py-3 text-right">Cost Price</th>
            <th className="px-4 py-3">Expiry Date (FEFO)</th>
            <th className="px-4 py-3">Received On</th>
            <th className="px-4 py-3 text-center">Batch Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {sorted.map((b, idx) => {
            const expired = isExpired(b.expiryDate);
            const expiringSoon = isExpiringSoon(b.expiryDate);
            const isDepleted = b.quantity === 0;

            return (
              <tr
                key={b._id || idx}
                className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors"
              >
                <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white text-xs">
                  {b.batchNumber}
                </td>
                <td className="px-4 py-3 text-right font-bold text-slate-800 dark:text-slate-200">
                  <span
                    className={
                      isDepleted
                        ? "text-slate-300 dark:text-slate-600 line-through"
                        : "text-slate-900 dark:text-white"
                    }
                  >
                    {b.quantity}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Rs. {(b.costPrice || 0).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-xs font-medium">
                  <span
                    className={
                      expired
                        ? "font-bold text-rose-600 dark:text-rose-400"
                        : expiringSoon
                        ? "font-bold text-amber-600 dark:text-amber-400"
                        : "text-slate-700 dark:text-slate-300"
                    }
                  >
                    {format(new Date(b.expiryDate), "dd MMM yyyy")}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500">
                  {format(new Date(b.receivedDate), "dd MMM yyyy")}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      isDepleted
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        : expired
                        ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60"
                        : expiringSoon
                        ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                        : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                    }`}
                  >
                    {isDepleted ? (
                      "Depleted"
                    ) : expired ? (
                      <>
                        <FiAlertTriangle size={11} /> Expired
                      </>
                    ) : expiringSoon ? (
                      <>
                        <FiClock size={11} /> Expiring Soon
                      </>
                    ) : (
                      <>
                        <FiCheckCircle size={11} /> Active FEFO
                      </>
                    )}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BatchTable;
