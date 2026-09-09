import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useClinicSettings } from "../../hooks/useClinicSettings";

const ClinicProfileForm = () => {
  const { settings, loading, error, updateSettings } = useClinicSettings();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      reset({
        clinicName: settings.clinicName,
        address: settings.address || "",
        phone: settings.phone || "",
        email: settings.email || "",
      });
    }
  }, [settings, reset]);

  const submit = async (values) => {
    setSaved(false);
    try {
      await updateSettings(values);
      setSaved(true);
    } catch (err) {
      setError("root", {
        message: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950/60 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 transition";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300";

  if (loading) {
    return (
      <div className="flex h-56 flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs backdrop-blur-md max-w-xl">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-200 dark:border-blue-900 border-t-blue-600" />
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Loading clinic profile...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-8 shadow-xs backdrop-blur-md">
      <div className="mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Clinic Profile &amp; Practice Information
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Official healthcare facility details printed on discharge slips, patient bills, and financial statements.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-200/80 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/40 px-4 py-3 text-xs font-semibold text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      {errors.root && (
        <div className="mb-5 rounded-2xl border border-red-200/80 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/40 px-4 py-3 text-xs font-semibold text-red-600 dark:text-red-400">
          {errors.root.message}
        </div>
      )}
      {saved && (
        <div className="mb-5 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/80 dark:bg-emerald-950/40 px-4 py-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          ✓ Clinic profile details updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
        <div>
          <label className={labelClass}>Clinic / Center Name</label>
          <input
            placeholder="e.g. SmartClinic Central Medical Hub"
            className={inputClass}
            {...register("clinicName", { required: "Clinic name is required" })}
          />
          {errors.clinicName && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {errors.clinicName.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Facility Address</label>
          <input
            placeholder="e.g. Main Healthcare Boulevard, Sanghar, Sindh"
            className={inputClass}
            {...register("address")}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Telephone / Mobile</label>
            <input
              placeholder="e.g. +92 300 1234567"
              className={inputClass}
              {...register("phone")}
            />
          </div>
          <div>
            <label className={labelClass}>Contact Email</label>
            <input
              type="email"
              placeholder="clinic@smartclinic.pk"
              className={inputClass}
              {...register("email")}
            />
          </div>
        </div>
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/25 transition-all hover:shadow-md hover:scale-[1.01] active:scale-95 disabled:opacity-60"
          >
            {isSubmitting ? "Saving Profile..." : "Save Clinic Information"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClinicProfileForm;
