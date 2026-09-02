// Simple component to show role in colored pill:
const ROLE_STYLES = {
  Admin: "bg-purple-50 text-purple-700 border-purple-200",
  Doctor: "bg-blue-50 text-blue-700 border-blue-200",
  Receptionist: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pharmacist: "bg-amber-50 text-amber-700 border-amber-200",
};

const RoleBadge = ({ role }) => (
  <span
    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${ROLE_STYLES[role] || "bg-slate-50 text-slate-600 border-slate-200"}`}
  >
    {role}
  </span>
);

export default RoleBadge;
