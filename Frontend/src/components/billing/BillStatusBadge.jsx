const STATUS_STYLES = {
  Unpaid: "bg-red-50 text-red-700 border-red-200",
  "Partially Paid": "bg-amber-50 text-amber-700 border-amber-200",
  Paid: "bg-green-50 text-green-700 border-green-200",
  Cancelled: "bg-slate-100 text-slate-500 border-slate-200",
};

const BillStatusBadge = ({ status }) => (
  <span
    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status] || "bg-slate-50 text-slate-600 border-slate-200"}`}
  >
    {status}
  </span>
);

export default BillStatusBadge;
