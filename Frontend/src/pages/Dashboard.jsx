import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDashboardStats } from "../hooks/useDashboardStats";
import StatCard from "../components/dashboard/StatCard";
import MedicineSalesChart from "../components/dashboard/MedicineSalesChart";
import AlertsPanel from "../components/pharmacy/AlertsPanel";
import RevenueDashboard from "../components/billing/RevenueDashboard";
import {
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiPackage,
  FiShield,
  FiLogOut,
} from "react-icons/fi";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { stats, loading } = useDashboardStats();
  const role = user?.role || "Staff";

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const showClinicStats = ["Admin", "Doctor", "Receptionist"].includes(role);
  const showBilling = ["Admin", "Receptionist"].includes(role);
  const showPharmacy = ["Admin", "Pharmacist"].includes(role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40 p-6 md:p-8">
      {/* Top Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 font-semibold text-white shadow-md shadow-blue-500/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">
                Welcome, {user?.name || "User"}
              </h1>
              <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                {role}
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Here's what's happening at the clinic today.
            </p>
          </div>
        </div>

        <button
          id="logout-button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50/80 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 hover:text-red-700 shadow-sm"
        >
          <FiLogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Quick Navigation Modules */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          Quick Access
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Admin", "Doctor", "Receptionist"].includes(role) && (
            <Link
              to="/patients"
              className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm backdrop-blur transition hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <FiUsers size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600">
                  Patients
                </h3>
                <p className="text-xs text-slate-400">Records & Medical History</p>
              </div>
            </Link>
          )}

          {["Admin", "Doctor", "Receptionist"].includes(role) && (
            <Link
              to="/appointments"
              className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm backdrop-blur transition hover:border-emerald-200 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                <FiCalendar size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800 group-hover:text-emerald-600">
                  Appointments
                </h3>
                <p className="text-xs text-slate-400">Queue & Calendar</p>
              </div>
            </Link>
          )}

          {["Admin", "Receptionist"].includes(role) && (
            <Link
              to="/billing"
              className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm backdrop-blur transition hover:border-amber-200 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 transition group-hover:bg-amber-600 group-hover:text-white">
                <FiDollarSign size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800 group-hover:text-amber-600">
                  Billing
                </h3>
                <p className="text-xs text-slate-400">Invoices & Payments</p>
              </div>
            </Link>
          )}

          {["Admin", "Pharmacist"].includes(role) && (
            <Link
              to="/pharmacy"
              className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm backdrop-blur transition hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                <FiPackage size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">
                  Pharmacy
                </h3>
                <p className="text-xs text-slate-400">Stock & POS Sales</p>
              </div>
            </Link>
          )}

          {role === "Admin" && (
            <Link
              to="/admin/users"
              className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm backdrop-blur transition hover:border-purple-200 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 transition group-hover:bg-purple-600 group-hover:text-white">
                <FiShield size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800 group-hover:text-purple-600">
                  Staff
                </h3>
                <p className="text-xs text-slate-400">Manage Accounts & Roles</p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Main Content Areas */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>
      ) : (
        <div className="space-y-10">
          {/* Clinic Stats: Admin, Doctor, Receptionist */}
          {showClinicStats && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-slate-700">
                {role === "Doctor" ? "Your Day Overview" : "Clinic Overview"}
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard
                  label="Total Patients"
                  value={stats?.totalPatients ?? 0}
                />
                <StatCard
                  label="Today's Appointments"
                  value={stats?.todayAppointments ?? 0}
                />
                <StatCard
                  label="Scheduled Today"
                  value={stats?.todayScheduled ?? 0}
                  accent="text-blue-600"
                />
                <StatCard
                  label="Completed Today"
                  value={stats?.todayCompleted ?? 0}
                  accent="text-green-600"
                />
              </div>
            </div>
          )}

          {/* Billing Section: Admin, Receptionist */}
          {showBilling && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-700">
                  Billing & Revenue Summary
                </h2>
                <div className="w-fit">
                  <StatCard
                    label="Unpaid Bills"
                    value={stats?.unpaidBills ?? 0}
                    accent="text-red-600"
                  />
                </div>
              </div>
              <RevenueDashboard />
            </div>
          )}

          {/* Pharmacy Section: Admin, Pharmacist */}
          {showPharmacy && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-slate-700">
                Pharmacy & Inventory Overview
              </h2>
              <AlertsPanel
                lowStock={stats?.lowStock || []}
                expiring={stats?.expiring || []}
              />
              <MedicineSalesChart />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
