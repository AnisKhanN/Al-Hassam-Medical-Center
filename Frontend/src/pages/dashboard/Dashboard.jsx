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
import DoctorConsultationQueue from "../../components/dashboard/DoctorConsultationQueue";
import SpecialistDoctorsRoster from "../../components/dashboard/SpecialistDoctorsRoster";
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
  FiLayers,
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

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10">
        {/* Top Welcome Hero Banner */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-8 shadow-xs backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 font-black text-xl sm:text-2xl text-white shadow-md shadow-blue-500/20">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500 animate-pulse" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
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
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 flex flex-wrap items-center gap-2">
                  <span>{currentDate}</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Clinical Outpatient OS Online
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-center">
              <button
                id="logout-button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/40 px-4 py-2.5 text-xs sm:text-sm font-bold text-red-600 dark:text-red-400 transition hover:bg-red-100 dark:hover:bg-red-900/60 shadow-xs active:scale-95 cursor-pointer"
              >
                <FiLogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Quick Access Operational Hub */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
              <FiActivity className="text-blue-600 dark:text-blue-400" />
              <span>Operational Modules</span>
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
              Scoped Permissions
            </span>
          </div>

          <div className="grid gap-3.5 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            {["Admin", "Doctor", "Receptionist"].includes(role) && (
              <Link
                to="/patients"
                className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-4.5 shadow-2xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500/50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/60 transition group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500">
                  <FiUsers size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Patients
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    EHR & Longitudinal History
                  </p>
                </div>
              </Link>
            )}

            {["Admin", "Doctor", "Receptionist"].includes(role) && (
              <Link
                to="/appointments"
                className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-4.5 shadow-2xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-500/50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60 transition group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500">
                  <FiCalendar size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Appointments
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    Conflict-Free Calendar
                  </p>
                </div>
              </Link>
            )}

            {["Admin", "Doctor", "Receptionist"].includes(role) && (
              <Link
                to="/appointments?type=telemedicine"
                className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-4.5 shadow-2xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-cyan-400 dark:hover:border-cyan-500/50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-800/60 transition group-hover:bg-cyan-600 group-hover:text-white dark:group-hover:bg-cyan-500">
                  <FiVideo size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    Telemedicine
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    Encrypted Video Rooms
                  </p>
                </div>
              </Link>
            )}

            {["Admin", "Receptionist"].includes(role) && (
              <Link
                to="/billing"
                className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-4.5 shadow-2xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500/50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/60 transition group-hover:bg-amber-600 group-hover:text-white dark:group-hover:bg-amber-500">
                  <RupeeIcon size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    Billing &amp; Invoices
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    Thermal Slips &amp; Receipts
                  </p>
                </div>
              </Link>
            )}

            {["Admin", "Pharmacist"].includes(role) && (
              <Link
                to="/pharmacy"
                className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-4.5 shadow-2xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500/50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60 transition group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-500">
                  <FiPackage size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Pharmacy POS
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    FEFO Batches &amp; Barcode
                  </p>
                </div>
              </Link>
            )}

            {role === "Admin" && (
              <Link
                to="/admin/users"
                className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-4.5 shadow-2xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-purple-400 dark:hover:border-purple-500/50"
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
              className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-4.5 shadow-2xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-cyan-400 dark:hover:border-cyan-500/50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-800/60 transition group-hover:bg-cyan-600 group-hover:text-white dark:group-hover:bg-cyan-500">
                <FiCpu size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  AI Assistant
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Clinical Inquiries &amp; Briefs
                </p>
              </div>
            </Link>

            <Link
              to="/reports"
              className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-4.5 shadow-2xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500/50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/60 transition group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500">
                <FiFileText size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Reports
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Financials &amp; Outpatient Logs
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Admin Multi-Desk Control Switcher */}
        {role === "Admin" && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-2.5 sm:p-3 shadow-xs backdrop-blur-md">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              <button
                onClick={() => setAdminActiveTab("overview")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition cursor-pointer ${
                  adminActiveTab === "overview"
                    ? "bg-purple-600 text-white shadow-sm shadow-purple-500/25"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <FiActivity size={15} /> Executive Overview
              </button>
              <button
                onClick={() => setAdminActiveTab("roster")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition cursor-pointer ${
                  adminActiveTab === "roster"
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <FiUsers size={15} /> 7 Specialties Roster
              </button>
              <button
                onClick={() => setAdminActiveTab("reception")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition cursor-pointer ${
                  adminActiveTab === "reception"
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/25"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <FiUsers size={15} /> Reception Desk Hub
              </button>
              <button
                onClick={() => setAdminActiveTab("pharmacy")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition cursor-pointer ${
                  adminActiveTab === "pharmacy"
                    ? "bg-amber-600 text-white shadow-sm shadow-amber-500/25"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <FiPackage size={15} /> Pharmacist Store Hub
              </button>
            </div>
            <span className="hidden sm:inline text-xs font-bold text-purple-600 dark:text-purple-400 px-3">
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
          <div className="space-y-10 sm:space-y-12">
            {/* 7 Medical Specialties Roster View: For Admin switching to Roster */}
            {role === "Admin" && adminActiveTab === "roster" && (
              <div className="space-y-6">
                <SpecialistDoctorsRoster />
              </div>
            )}

            {/* Reception Desk View: For Receptionist or Admin switching to Reception Desk */}
            {(role === "Receptionist" ||
              (role === "Admin" && adminActiveTab === "reception")) && (
              <div className="space-y-8 sm:space-y-10">
                <ReceptionDeskHub />
                <div className="border-t border-slate-200/80 dark:border-slate-800 pt-8 sm:pt-10">
                  <div className="mb-4">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      Front Desk Billing &amp; Fee Receipts
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Patient invoices, consultation fees, and settlement
                      receipts collected at reception.
                    </p>
                  </div>
                  <RevenueDashboard />
                </div>
              </div>
            )}

            {/* Pharmacist Store View: For Pharmacist or Admin switching to Pharmacy */}
            {(role === "Pharmacist" ||
              (role === "Admin" && adminActiveTab === "pharmacy")) && (
              <div className="space-y-8 sm:space-y-10">
                <PharmacistStoreHub />
                <div className="border-t border-slate-200/80 dark:border-slate-800 pt-8 sm:pt-10">
                  <div className="mb-4">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      Dispensary Sales Velocity &amp; Analytics
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Dispensing volume, top sold formulations, and peak
                      dispensing hours.
                    </p>
                  </div>
                  <MedicineSalesChart />
                </div>
              </div>
            )}

            {/* Doctor Dedicated Workstation View */}
            {role === "Doctor" && (
              <div className="space-y-8 sm:space-y-10">
                {/* Doctor Key Consultation Stat Cards */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      Your Clinical Key Metrics
                    </h2>
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                      Live Clinic Flow
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:gap-5 sm:grid-cols-4">
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

                {/* Doctor Consultation Queue & Launchpad */}
                <DoctorConsultationQueue />
              </div>
            )}

            {/* Admin Executive Overview View */}
            {role === "Admin" && adminActiveTab === "overview" && (
              <div className="space-y-10 sm:space-y-12">
                {/* Clinic Key Metrics */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      Clinic Executive Key Metrics
                    </h2>
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                      Live Database Aggregations
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:gap-5 sm:grid-cols-4">
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

                {/* Billing & Financial Section */}
                <div>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                        Billing &amp; Revenue Analytics
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Real-time payment tracking, balances, and multi-channel
                        settlements.
                      </p>
                    </div>
                  </div>
                  <RevenueDashboard />
                </div>

                {/* Pharmacy & Inventory Section */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      Pharmacy &amp; Expiry Radar
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Automated FEFO inventory alerts, low-stock notifications,
                      and counter POS sales.
                    </p>
                  </div>
                  <AlertsPanel
                    lowStock={stats?.lowStock || []}
                    expiring={stats?.expiring || []}
                  />
                  <MedicineSalesChart />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
