import { useState } from "react";
import { FiCalendar, FiRefreshCw } from "react-icons/fi";

const formatYMD = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getPresetDates = (preset) => {
  const now = new Date();
  let from;
  let to;

  switch (preset) {
    case "today":
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      to = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "7days":
      from = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
      to = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "thisMonth":
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      to = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "lastMonth":
      from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      to = new Date(now.getFullYear(), now.getMonth(), 0);
      break;
    case "yearToDate":
      from = new Date(now.getFullYear(), 0, 1);
      to = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    default:
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      to = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  return {
    dateFrom: formatYMD(from),
    dateTo: formatYMD(to),
  };
};

const ReportDateFilter = ({ dateRange, onDateRangeChange, onRefresh, loading }) => {
  const [activePreset, setActivePreset] = useState("thisMonth");
  const [customFrom, setCustomFrom] = useState(dateRange.dateFrom || formatYMD(new Date()));
  const [customTo, setCustomTo] = useState(dateRange.dateTo || formatYMD(new Date()));

  const handlePreset = (preset) => {
    setActivePreset(preset);
    if (preset !== "custom") {
      const dates = getPresetDates(preset);
      setCustomFrom(dates.dateFrom);
      setCustomTo(dates.dateTo);
      onDateRangeChange(dates);
    }
  };

  const handleCustomApply = (e) => {
    e.preventDefault();
    setActivePreset("custom");
    onDateRangeChange({
      dateFrom: customFrom,
      dateTo: customTo,
    });
  };

  const presets = [
    { id: "today", label: "Today" },
    { id: "7days", label: "Last 7 Days" },
    { id: "thisMonth", label: "This Month" },
    { id: "lastMonth", label: "Last Month" },
    { id: "yearToDate", label: "Year to Date" },
  ];

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 p-4 mb-6 print:hidden backdrop-blur-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <FiCalendar className="text-slate-400" /> Range:
          </span>
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePreset(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePreset === p.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Custom Date Pickers */}
        <form onSubmit={handleCustomApply} className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">From</span>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => {
                setCustomFrom(e.target.value);
                setActivePreset("custom");
              }}
              className="text-xs bg-transparent border-0 p-0 text-slate-800 dark:text-slate-100 font-medium focus:ring-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">To</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => {
                setCustomTo(e.target.value);
                setActivePreset("custom");
              }}
              className="text-xs bg-transparent border-0 p-0 text-slate-800 dark:text-slate-100 font-medium focus:ring-0 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            Apply
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Refresh Data"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-600 dark:text-blue-400" : ""}`} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportDateFilter;
