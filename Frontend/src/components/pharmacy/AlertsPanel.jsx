import { FiAlertTriangle, FiClock } from "react-icons/fi";

const AlertsPanel = ({ lowStock = [], expiring = [] }) => {
  if (lowStock.length === 0 && expiring.length === 0) return null;

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2">
      {lowStock.length > 0 && (
        <div className="rounded-2xl border border-amber-300/80 dark:border-amber-800/80 bg-amber-50/80 dark:bg-amber-950/40 p-4 shadow-xs backdrop-blur-md">
          <div className="mb-2.5 flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-300">
            <FiAlertTriangle size={17} className="shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              {lowStock.length} medicine{lowStock.length !== 1 ? "s" : ""} low on stock
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-amber-900/90 dark:text-amber-200">
            {lowStock.slice(0, 3).map((m) => (
              <p key={m._id} className="truncate">
                <strong className="font-semibold">{m.name}</strong> — {m.totalStock} remaining{" "}
                <span className="text-amber-700 dark:text-amber-400">(reorder at {m.reorderLevel})</span>
              </p>
            ))}
            {lowStock.length > 3 && (
              <p className="pt-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                +{lowStock.length - 3} more low stock items
              </p>
            )}
          </div>
        </div>
      )}

      {expiring.length > 0 && (
        <div className="rounded-2xl border border-rose-300/80 dark:border-rose-800/80 bg-rose-50/80 dark:bg-rose-950/40 p-4 shadow-xs backdrop-blur-md">
          <div className="mb-2.5 flex items-center gap-2 text-sm font-bold text-rose-800 dark:text-rose-300">
            <FiClock size={17} className="shrink-0 text-rose-600 dark:text-rose-400" />
            <span>
              {expiring.length} batch{expiring.length !== 1 ? "es" : ""} expiring within 30 days
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-rose-900/90 dark:text-rose-200">
            {expiring.slice(0, 3).map((b) => (
              <p key={b.batchId} className="truncate">
                <strong className="font-semibold">{b.medicineName}</strong> (Batch: {b.batchNumber}) —{" "}
                {b.quantity} units, exp: {new Date(b.expiryDate).toLocaleDateString()}
              </p>
            ))}
            {expiring.length > 3 && (
              <p className="pt-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                +{expiring.length - 3} more batches expiring soon
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;
