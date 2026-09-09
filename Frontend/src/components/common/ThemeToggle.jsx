import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = ({ showLabel = false, className = "" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Dark Mode"
      className={`group relative inline-flex items-center gap-1.5 rounded-xl p-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
        isDark
          ? "bg-slate-800/90 text-amber-300 hover:bg-slate-700 hover:text-amber-200 border border-slate-700 shadow-sm"
          : "bg-white text-slate-700 hover:bg-slate-100 hover:text-blue-600 border border-slate-200/90 shadow-sm"
      } ${className}`}
    >
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-lg transition-all ${
          isDark
            ? "bg-amber-400/15 text-amber-300 group-hover:bg-amber-400/25"
            : "bg-amber-50 text-amber-500 group-hover:bg-amber-100"
        }`}
      >
        {isDark ? (
          <FiMoon className="h-3.5 w-3.5 transition-transform duration-300 rotate-0 scale-100" />
        ) : (
          <FiSun className="h-3.5 w-3.5 transition-transform duration-300 rotate-0 scale-100" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-bold pr-1.5 select-none">
          {isDark ? "Dark Mode" : "Light Mode"}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
