import { NavLink, Link } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiCreditCard,
  FiPackage,
  FiUserPlus,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiX,
  FiCpu,
  FiActivity,
  FiVideo,
  FiBookOpen,
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "../common/ThemeToggle";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: FiHome,
    roles: ["Admin", "Doctor", "Receptionist", "Pharmacist"],
  },
  {
    label: "Patients",
    path: "/patients",
    icon: FiUsers,
    roles: ["Admin", "Doctor", "Receptionist"],
  },
  {
    label: "Appointments",
    path: "/appointments",
    icon: FiCalendar,
    roles: ["Admin", "Doctor", "Receptionist"],
  },
  {
    label: "Telemedicine",
    path: "/appointments?type=telemedicine",
    icon: FiVideo,
    roles: ["Admin", "Doctor", "Receptionist"],
  },
  {
    label: "Billing",
    path: "/billing",
    icon: FiCreditCard,
    roles: ["Admin", "Receptionist"],
  },
  {
    label: "Pharmacy",
    path: "/pharmacy",
    icon: FiPackage,
    roles: ["Admin", "Pharmacist"],
  },
  {
    label: "Reports",
    path: "/reports",
    icon: FiFileText,
    roles: ["Admin", "Doctor", "Receptionist", "Pharmacist"],
  },
  {
    label: "AI Assistant",
    path: "/ai-assistant",
    icon: FiCpu,
    roles: ["Admin", "Doctor", "Receptionist", "Pharmacist"],
  },
  { label: "Staff", path: "/admin/users", icon: FiUserPlus, roles: ["Admin"] },
  {
    label: "Settings",
    path: "/settings",
    icon: FiSettings,
    roles: ["Admin", "Doctor", "Receptionist", "Pharmacist"],
  },
  {
    label: "Docs & Reports",
    path: "/docs",
    icon: FiBookOpen,
    roles: ["Admin", "Doctor", "Receptionist", "Pharmacist"],
  },
];

const ROLE_STYLES = {
  Admin: "bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800",
  Doctor: "bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
  Receptionist: "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
  Pharmacist: "bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
};

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(user?.role));

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur transition-colors duration-200">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100 dark:border-slate-800/80">
        <Link
          to="/dashboard"
          onClick={onClose}
          className="flex items-center gap-2.5 group cursor-pointer transition-transform hover:scale-[1.02]"
          title="Back to Dashboard"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-sm group-hover:shadow-md group-hover:shadow-blue-500/20 transition-all">
            <FiActivity size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Smart Clinic
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              SaaS &amp; Pharmacy
            </p>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            aria-label="Close Sidebar"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {items.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`
            }
          >
            <Icon size={17} className="shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Profile & Theme Toggle */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Theme Mode
          </span>
          <ThemeToggle showLabel />
        </div>

        <div className="flex items-center gap-3 pt-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
              {user?.name}
            </p>
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${ROLE_STYLES[user?.role] || "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}
            >
              {user?.role}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900/50"
        >
          <FiLogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
