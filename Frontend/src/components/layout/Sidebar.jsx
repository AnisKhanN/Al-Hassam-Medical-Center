import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiCreditCard,
  FiPackage,
  FiUserPlus,
  FiSettings,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";

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
  { label: "Staff", path: "/admin/users", icon: FiUserPlus, roles: ["Admin"] },
  {
    label: "Settings",
    path: "/settings",
    icon: FiSettings,
    roles: ["Admin", "Doctor", "Receptionist", "Pharmacist"],
  },
];

const ROLE_STYLES = {
  Admin: "bg-purple-50 text-purple-700",
  Doctor: "bg-blue-50 text-blue-700",
  Receptionist: "bg-emerald-50 text-emerald-700",
  Pharmacist: "bg-amber-50 text-amber-700",
};

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(user?.role));

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-100 bg-white/80 backdrop-blur">
      <div className="flex items-center justify-between px-5 py-5">
        <div>
          <p className="text-base font-semibold text-slate-800">Smart Clinic</p>
          <p className="text-xs text-slate-400">&amp; Pharmacy Management</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 md:hidden"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-700">
              {user?.name}
            </p>
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_STYLES[user?.role] || "bg-slate-100 text-slate-600"}`}
            >
              {user?.role}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600"
        >
          <FiLogOut size={16} /> Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
