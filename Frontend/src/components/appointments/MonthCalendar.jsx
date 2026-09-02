import { useState, useMemo } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";

const MonthCalendar = ({
  appointmentsByDay,
  selectedDate,
  onSelectDate,
  onMonthChange,
}) => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));

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

  return (
    <div className="rounded-2xl border border-slate-100 bg-white/70 p-4 shadow-sm backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => changeMonth("prev")}
            className="rounded-lg p-1.5 hover:bg-slate-100"
          >
            <FiChevronLeft size={15} />
          </button>
          <button
            onClick={() => changeMonth("next")}
            className="rounded-lg p-1.5 hover:bg-slate-100"
          >
            <FiChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const count = appointmentsByDay?.[key] || 0;
          const inMonth = isSameMonth(day, currentMonth);
          const selected = isSameDay(day, selectedDate);

          return (
            <button
              key={key}
              onClick={() => onSelectDate(day)}
              className={`flex h-14 flex-col items-center justify-center rounded-lg text-xs transition
                ${selected ? "bg-blue-600 text-white" : inMonth ? "text-slate-700 hover:bg-blue-50" : "text-slate-300"}`}
            >
              <span>{format(day, "d")}</span>
              {count > 0 && (
                <span
                  className={`mt-0.5 h-1.5 w-1.5 rounded-full ${selected ? "bg-white" : "bg-blue-500"}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthCalendar;
