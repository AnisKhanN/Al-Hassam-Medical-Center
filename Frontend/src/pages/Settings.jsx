import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import ChangePasswordForm from "../components/settings/ChangePasswordForm";
import ClinicProfileForm from "../components/settings/ClinicProfileForm";

const Settings = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const TABS = isAdmin ? ["Security", "Clinic Profile"] : ["Security"];
  const [tab, setTab] = useState("Security");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40 p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-500">
          Manage your account and clinic preferences.
        </p>
      </div>

      {TABS.length > 1 && (
        <div className="mb-5 flex w-fit gap-1 rounded-lg border border-slate-100 bg-white/70 p-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${tab === t ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {tab === "Security" && <ChangePasswordForm />}
      {tab === "Clinic Profile" && isAdmin && <ClinicProfileForm />}
    </div>
  );
};

export default Settings;
