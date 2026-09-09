import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useDashboardStats } from "../../hooks/useDashboardStats";
import StatCard from "../../components/dashboard/StatCard";
import MedicineSalesChart from "../../components/dashboard/MedicineSalesChart";
import AlertsPanel from "../../components/pharmacy/AlertsPanel";
import RevenueDashboard from "../../components/billing/RevenueDashboard";
import ReceptionDeskHub from "../../components/dashboard/ReceptionDeskHub";
import PharmacistStoreHub from "../../components/dashboard/PharmacistStoreHub";
import RupeeIcon from "../../components/common/RupeeIcon";
import useSEO from "../../hooks/useSEO";
import {
  FiUsers,
  FiCalendar,
  FiPackage,
  FiShield,
  FiLogOut,
  FiCheckCircle,
  FiClock,
  FiVideo,
  FiCpu,
  FiFileText,
  FiActivity,
} from "react-icons/fi";

const ROLE_BADGES = {
  Admin:
    "bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  Doctor:
    "bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  Receptionist:
    "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  Pharmacist:
    "bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { stats, loading } = useDashboardStats();
  const [adminActiveTab, setAdminActiveTab] = useState("overview"); // "overview" | "reception" | "pharmacy"
  const role = user?.role || "Staff";

  useSEO({
    title: `${role} Operations Dashboard`,
    description:
      "Role-adaptive executive operations dashboard for SmartClinic healthcare management system.",
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const showClinicStats = ["Admin", "Doctor", "Receptionist"].includes(role);
  const showBilling = ["Admin", "Receptionist"].includes(role);
  const showPharmacy = ["Admin", "Pharmacist"].includes(role);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      {/* Top Welcome Hero Banner */}
      <div className="mb-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-7 shadow-xs backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 font-black text-xl text-white shadow-md shadow-blue-500/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Welcome back, {user?.name || "Healthcare Staff"}
                </h1>
                <span
                  className={`rounded-full border px-3 py-0.5 text-xs font-bold ${
                    ROLE_BADGES[role] ||
                    "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                <span>{currentDate}</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Clinic Operating System Active
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <button
              id="logout-button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/40 px-4 py-2 text-xs sm:text-sm font-bold text-red-600 dark:text-red-400 transition hover:bg-red-100 dark:hover:bg-red-900/60 shadow-xs active:scale-95"
            >
              <FiLogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access Operational Hub */}
      <div className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiActivity className="text-blue-600 dark:text-blue-400" />
            <span>Operational Modules</span>
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Role-Scoped Actions
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Admin", "Doctor", "Receptionist"].includes(role) && (
            <Link
              to="/patients"
              className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500/50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/60 transition group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500">
                <FiUsers size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Patients
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  EHR & Longitudinal Histories
                </p>
              </div>
            </Link>
          )}

          {["Admin", "Doctor", "Receptionist"].includes(role) && (
            <Link
              to="/appointments"
              className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-500/50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60 transition group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500">
                <FiCalendar size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Appointments
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Conflict-Free Calendar & Queue
                </p>
              </div>
            </Link>
          )}

          {["Admin", "Doctor", "Receptionist"].includes(role) && (
            <Link
              to="/appointments?type=telemedicine"
              className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-cyan-400 dark:hover:border-cyan-500/50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-800/60 transition group-hover:bg-cyan-600 group-hover:text-white dark:group-hover:bg-cyan-500">
                <FiVideo size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  Telemedicine
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Encrypted Virtual Rooms
                </p>
              </div>
            </Link>
          )}

          {["Admin", "Receptionist"].includes(role) && (
            <Link
              to="/billing"
              className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500/50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/60 transition group-hover:bg-amber-600 group-hover:text-white dark:group-hover:bg-amber-500">
                <RupeeIcon size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Billing & Invoices
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Thermal Slips & Payments
                </p>
              </div>
            </Link>
          )}

          {["Admin", "Pharmacist"].includes(role) && (
            <Link
              to="/pharmacy"
              className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500/50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60 transition group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-500">
                <FiPackage size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Pharmacy POS
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  FEFO Batches & Barcodes
                </p>
              </div>
            </Link>
          )}

          {role === "Admin" && (
            <Link
              to="/admin/users"
              className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-purple-400 dark:hover:border-purple-500/50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800/60 transition group-hover:bg-purple-600 group-hover:text-white dark:group-hover:bg-purple-500">
                <FiShield size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Staff Accounts
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  RBAC Role Governance
                </p>
              </div>
            </Link>
          )}

          <Link
            to="/ai-assistant"
            className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-cyan-400 dark:hover:border-cyan-500/50"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-800/60 transition group-hover:bg-cyan-600 group-hover:text-white dark:group-hover:bg-cyan-500">
              <FiCpu size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Gemini AI
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Clinical Inquiries & Briefs
              </p>
            </div>
          </Link>

          <Link
            to="/reports"
            className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500/50"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/60 transition group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500">
              <FiFileText size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Analytics Reports
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Export Financial Statements
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Admin Multi-Desk Control Switcher */}
      {role === "Admin" && (
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-2.5 shadow-xs backdrop-blur-md">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setAdminActiveTab("overview")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
                adminActiveTab === "overview"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <FiActivity size={15} /> Executive Overview
            </button>
            <button
              onClick={() => setAdminActiveTab("reception")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
                adminActiveTab === "reception"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <FiUsers size={15} /> Reception Desk Hub
            </button>
            <button
              onClick={() => setAdminActiveTab("pharmacy")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
                adminActiveTab === "pharmacy"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <FiPackage size={15} /> Pharmacist Store Hub
            </button>
          </div>
          <span className="hidden sm:inline text-xs font-semibold text-purple-600 dark:text-purple-400 px-3">
            Admin Command Switcher
          </span>
        </div>
      )}

      {/* Main Content Dashboard Stream */}
      {loading ? (
        <div className="flex h-56 flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-200 dark:border-blue-950 border-t-blue-600" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Loading real-time clinical statistics...
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Reception Desk View: For Receptionist or Admin switching to Reception Desk */}
          {(role === "Receptionist" || (role === "Admin" && adminActiveTab === "reception")) && (
            <div className="space-y-8">
              <ReceptionDeskHub />
              <div className="border-t border-slate-200/80 dark:border-slate-800 pt-8">
                <div className="mb-4">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Front Desk Billing &amp; Fee Receipts
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Patient invoices, co-pays, and settlements collected at reception.
                  </p>
                </div>
                <RevenueDashboard />
              </div>
            </div>
          )}

          {/* Pharmacist Store View: For Pharmacist or Admin switching to Pharmacy */}
          {(role === "Pharmacist" || (role === "Admin" && adminActiveTab === "pharmacy")) && (
            <div className="space-y-8">
              <PharmacistStoreHub />
              <div className="border-t border-slate-200/80 dark:border-slate-800 pt-8">
                <div className="mb-4">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Dispensary Sales Velocity &amp; Analytics
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Dispensing volume, top sold formulations, and sales patterns.
                  </p>
                </div>
                <MedicineSalesChart />
              </div>
            </div>
          )}

          {/* Executive & Doctor Overview */}
          {(role === "Doctor" || (role === "Admin" && adminActiveTab === "overview")) && (
            <div className="space-y-10">
              {/* Clinic Stats */}
              {showClinicStats && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {role === "Doctor"
                        ? "Your Clinical Overview"
                        : "Clinic Key Metrics"}
                    </h2>
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                      Live Database Aggregations
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatCard
                      label="Total Patients"
                      value={stats?.totalPatients ?? 0}
                      icon={FiUsers}
                      subtitle="Registered Profiles"
                    />
                    <StatCard
                      label="Today's Appointments"
                      value={stats?.todayAppointments ?? 0}
                      icon={FiCalendar}
                      subtitle="Scheduled on Calendar"
                    />
                    <StatCard
                      label="In Progress / Scheduled"
                      value={stats?.todayScheduled ?? 0}
                      accent="text-blue-600 dark:text-blue-400"
                      icon={FiClock}
                      subtitle="Awaiting Consultation"
                    />
                    <StatCard
                      label="Completed Consultations"
                      value={stats?.todayCompleted ?? 0}
                      accent="text-emerald-600 dark:text-emerald-400"
                      icon={FiCheckCircle}
                      subtitle="Concluded Today"
                    />
                  </div>
                </div>
              )}

              {/* Billing & Financial Section */}
              {showBilling && (
                <div>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        Billing &amp; Revenue Analytics
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Real-time payment tracking, balances, and multi-channel settlements.
                      </p>
                    </div>
                  </div>
                  <RevenueDashboard />
                </div>
              )}

              {/* Pharmacy & Inventory Section */}
              {showPharmacy && (
                <div>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        Pharmacy &amp; Expiry Radar
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Automated FEFO inventory alerts, low-stock notifications, and counter POS sales.
                      </p>
                    </div>
                  </div>
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
      )}
    </div>
  );
};

export default Dashboard;
