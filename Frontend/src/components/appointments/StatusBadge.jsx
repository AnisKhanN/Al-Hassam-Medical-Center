const STATUS_STYLES = {
  Scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  Completed: "bg-green-50 text-green-700 border-green-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
  "No-show": "bg-amber-50 text-amber-700 border-amber-200",
};

const StatusBadge = ({ status }) => (
  <span
    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status] || "bg-slate-50 text-slate-600 border-slate-200"}`}
  >
    {status}
  </span>
);

export default StatusBadge;
