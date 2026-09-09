import { useState, useMemo } from "react";
import { FiChevronLeft, FiChevronRight, FiCalendar, FiClock } from "react-icons/fi";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";

const MonthCalendar = ({
  appointmentsByDay = {},
  selectedDate,
  onSelectDate,
  onMonthChange,
}) => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate || new Date()));

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const changeMonth = (dir) => {
    const next =
      dir === "next" ? addMonths(currentMonth, 1) : subMonths(currentMonth, 1);
    setCurrentMonth(next);
    onMonthChange?.(next);
  };

  const jumpToToday = () => {
    const today = new Date();
    setCurrentMonth(startOfMonth(today));
    onSelectDate(today);
    onMonthChange?.(today);
  };

  return (
    <div className="w-full select-none">
      {/* Calendar Header with Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 shadow-xs">
            <FiCalendar size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">
              {format(currentMonth, "MMMM yyyy")}
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Select date to filter roster
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={jumpToToday}
            className="rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-xs"
          >
            Today
          </button>
          <div className="flex rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-0.5 shadow-xs">
            <button
              type="button"
              onClick={() => changeMonth("prev")}
              className="rounded-md p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
              aria-label="Previous Month"
            >
              <FiChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => changeMonth("next")}
              className="rounded-md p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
              aria-label="Next Month"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Row */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName, i) => (
          <div
            key={i}
            className="py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const count = appointmentsByDay?.[key] || 0;
          const inMonth = isSameMonth(day, currentMonth);
          const selected = isSameDay(day, selectedDate);
          const dayIsToday = isToday(day);

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDate(day)}
              className={`group relative flex h-14 flex-col items-center justify-between rounded-xl p-1.5 text-xs transition-all duration-150 cursor-pointer
                ${
                  selected
                    ? "bg-gradient-to-tr from-blue-600 to-indigo-600 font-bold text-white shadow-md shadow-blue-500/25 scale-[1.03] z-10 ring-2 ring-blue-400 dark:ring-blue-500"
                    : dayIsToday
                    ? "bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800/80 hover:bg-blue-100 dark:hover:bg-blue-900/60"
                    : inMonth
                    ? "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 font-medium"
                    : "text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400"
                }`}
            >
              {/* Day Number and Today Indicator */}
              <div className="flex w-full items-center justify-between px-0.5">
                <span className={`text-[12px] ${selected ? "text-white" : ""}`}>
                  {format(day, "d")}
                </span>
                {dayIsToday && !selected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                )}
              </div>

              {/* Appointment indicator pill */}
              {count > 0 ? (
                <div
                  className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none
                    ${
                      selected
                        ? "bg-white/20 text-white border border-white/30 backdrop-blur-xs"
                        : "bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50"
                    }`}
                >
                  <FiClock size={9} className="shrink-0" />
                  <span>{count}</span>
                </div>
              ) : (
                <span className="h-2.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Calendar Quick Legend */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-3 text-[11px] text-slate-400 dark:text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-600" /> Today
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-400 dark:bg-blue-500" /> Has Appointments
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-400">
          {format(selectedDate, "dd MMM yyyy")}
        </span>
      </div>
    </div>
  );
};

export default MonthCalendar;
