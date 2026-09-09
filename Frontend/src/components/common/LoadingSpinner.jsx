import { FiActivity } from "react-icons/fi";

const LoadingSpinner = ({ label = "Loading SmartClinic workspace..." }) => {
  return (
    <div
      id="app-loading-screen"
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] w-full flex-col items-center justify-center p-8 text-center"
    >
      <div className="relative mb-4 flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-blue-500/20" />
        
        {/* Rotating border spinner */}
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-500" />
        
        {/* Center icon */}
        <div className="absolute flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/30">
          <FiActivity size={18} className="animate-pulse" />
        </div>
      </div>

      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </p>
      <p className="mt-1 text-xs text-slate-400">
        Initializing secured healthcare environment...
      </p>
    </div>
  );
};

export default LoadingSpinner;
