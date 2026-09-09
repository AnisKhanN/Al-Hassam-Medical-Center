const StatCard = ({ label, value, accent, icon: Icon, subtitle, trend }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/30">
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${accent || "text-slate-900 dark:text-white"}`}>
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {Icon && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/60 shadow-xs transition-transform group-hover:scale-105">
          <Icon size={20} />
        </div>
      )}
    </div>

    {trend && (
      <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        <span>{trend}</span>
      </div>
    )}
  </div>
);

export default StatCard;
