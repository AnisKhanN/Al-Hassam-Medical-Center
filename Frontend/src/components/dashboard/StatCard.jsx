const StatCard = ({ label, value, accent }) => (
  <div className="rounded-2xl border border-slate-100 bg-white/70 p-5 shadow-sm backdrop-blur">
    <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
    <p className={`mt-1 text-2xl font-semibold ${accent || "text-slate-800"}`}>
      {value}
    </p>
  </div>
);

export default StatCard;
