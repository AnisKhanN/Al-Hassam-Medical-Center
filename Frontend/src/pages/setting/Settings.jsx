import { useState } from "react";
import {
  FiSliders,
  FiShield,
  FiUser,
  FiCheckCircle,
  FiLock,
  FiHome,
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { useClinicSettings } from "../../hooks/useClinicSettings";
import ChangePasswordForm from "../../components/settings/ChangePasswordForm";
import ClinicProfileForm from "../../components/settings/ClinicProfileForm";
import StatCard from "../../components/dashboard/StatCard";
import useSEO from "../../hooks/useSEO";

const Settings = () => {
  const { user } = useAuth();
  const { settings } = useClinicSettings();
  const isAdmin = user?.role === "Admin";

  const TABS = [
    { name: "Security", icon: FiLock },
    ...(isAdmin ? [{ name: "Clinic Profile", icon: FiHome }] : []),
  ];
  const [tab, setTab] = useState("Security");

  useSEO({
    title: "Account Settings & Clinic Profile",
    description:
      "Manage your credentials, clinic operating preferences, and security settings.",
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 transition-colors duration-200 space-y-6 pb-12">
      {/* Top Welcome Hero Operations Banner */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-7 shadow-xs backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-black text-white shadow-md shadow-blue-500/20">
              <FiSliders size={28} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Account Settings &amp; Clinic Profile
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/60 px-3 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Tenancy Config Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Manage authorization credentials, multi-tier security standards, and clinic administrative metadata.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Tenancy Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Security Protocol"
          value="Bcrypt Hash"
          icon={FiShield}
          accent="text-purple-600 dark:text-purple-400"
          subtitle="12-Round Password Salt"
        />
        <StatCard
          label="Active Clinic Tenancy"
          value={settings?.clinicName ? (settings.clinicName.length > 14 ? settings.clinicName.substring(0, 14) + "..." : settings.clinicName) : "Smart Clinic"}
          icon={FiSliders}
          accent="text-blue-600 dark:text-blue-400"
          subtitle={settings?.phone || "Sanghar Central"}
        />
        <StatCard
          label="Operator Profile"
          value={user?.name ? (user.name.length > 14 ? user.name.substring(0, 14) + "..." : user.name) : "Staff Member"}
          icon={FiUser}
          subtitle={`${user?.role || "Staff"} Privileges`}
        />
        <StatCard
          label="Security Clearance"
          value="Verified JWT"
          icon={FiCheckCircle}
          accent="text-emerald-600 dark:text-emerald-400"
          subtitle="Session Active"
        />
      </div>

      {/* Navigation Segmented Tabs */}
      {TABS.length > 1 && (
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-1.5 backdrop-blur-md w-fit">
          {TABS.map((t) => {
            const isActive = tab === t.name;
            const Icon = t.icon;
            return (
              <button
                key={t.name}
                onClick={() => setTab(t.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon size={14} />
                <span>{t.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Tab Panels */}
      <div>
        {tab === "Security" && <ChangePasswordForm />}
        {tab === "Clinic Profile" && isAdmin && <ClinicProfileForm />}
      </div>
    </div>
  );
};

export default Settings;
