import { FiAlertTriangle, FiClock } from "react-icons/fi";

const AlertsPanel = ({ lowStock, expiring }) => {
  if (lowStock.length === 0 && expiring.length === 0) return null;

  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-2">
      {lowStock.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-amber-700">
            <FiAlertTriangle size={15} /> {lowStock.length} medicine
            {lowStock.length !== 1 ? "s" : ""} low on stock
          </div>
          <div className="space-y-1 text-xs text-amber-700">
            {lowStock.slice(0, 3).map((m) => (
              <p key={m._id}>
                {m.name} — {m.totalStock} left (reorder at {m.reorderLevel})
              </p>
            ))}
            {lowStock.length > 3 && (
              <p className="text-amber-500">+{lowStock.length - 3} more</p>
            )}
          </div>
        </div>
      )}
      {expiring.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50/60 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-red-700">
            <FiClock size={15} /> {expiring.length} batch
            {expiring.length !== 1 ? "es" : ""} expiring within 30 days
          </div>
          <div className="space-y-1 text-xs text-red-700">
            {expiring.slice(0, 3).map((b) => (
              <p key={b.batchId}>
                {b.medicineName} (batch {b.batchNumber}) — {b.quantity} units,
                expires {new Date(b.expiryDate).toLocaleDateString()}
              </p>
            ))}
            {expiring.length > 3 && (
              <p className="text-red-500">+{expiring.length - 3} more</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;
