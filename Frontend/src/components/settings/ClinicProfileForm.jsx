import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiHome,
  FiMapPin,
  FiPhone,
  FiMail,
  FiGlobe,
  FiActivity,
  FiPhoneCall,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import RupeeIcon from "../common/RupeeIcon";
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
        clinicName: settings.clinicName || "",
        tagline: settings.tagline || "",
        address: settings.address || "",
        phone: settings.phone || "",
        emergencyContact: settings.emergencyContact || "",
        email: settings.email || "",
        website: settings.website || "",
        defaultConsultationFee: settings.defaultConsultationFee ?? 0,
      });
    }
  }, [settings, reset]);

  const submit = async (values) => {
    setSaved(false);
    try {
      await updateSettings({
        clinicName: values.clinicName.trim(),
        tagline: values.tagline?.trim() || "",
        address: values.address?.trim() || "",
        phone: values.phone?.trim() || "",
        emergencyContact: values.emergencyContact?.trim() || "",
        email: values.email?.trim() || "",
        website: values.website?.trim() || "",
        defaultConsultationFee: Number(values.defaultConsultationFee) || 0,
      });
      setSaved(true);
    } catch (err) {
      setError("root", {
        message: err.response?.data?.message || "Failed to update clinic settings",
      });
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950/60 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 transition";
  const labelClass =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300";

  if (loading) {
    return (
      <div className="flex h-56 flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs backdrop-blur-md max-w-2xl">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-200 dark:border-blue-900 border-t-blue-600" />
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Loading clinic profile...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-8 shadow-xs backdrop-blur-md">
      <div className="mb-6 flex items-start gap-3.5 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
          <FiHome size={22} />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Clinic Profile &amp; Practice Information
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Official healthcare facility details printed on discharge slips, patient bills, and financial statements.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-2xl border border-red-200/80 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/40 px-4 py-3 text-xs font-semibold text-red-600 dark:text-red-400">
          <FiAlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {errors.root && (
        <div className="mb-5 flex items-center gap-2 rounded-2xl border border-red-200/80 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/40 px-4 py-3 text-xs font-semibold text-red-600 dark:text-red-400">
          <FiAlertCircle size={16} className="shrink-0" />
          <span>{errors.root.message}</span>
        </div>
      )}
      {saved && (
        <div className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/80 dark:bg-emerald-950/40 px-4 py-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <FiCheckCircle size={16} className="shrink-0" />
          <span>✓ Clinic profile details updated and synchronized successfully.</span>
        </div>
      )}

      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
        {/* Clinic Name */}
        <div>
          <label className={labelClass}>Clinic / Center Name *</label>
          <div className="relative">
            <FiHome
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              placeholder="e.g. SmartClinic Healthcare Center"
              className={inputClass}
              {...register("clinicName", { required: "Clinic name is required" })}
            />
          </div>
          {errors.clinicName && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {errors.clinicName.message}
            </p>
          )}
        </div>

        {/* Tagline / Specialty */}
        <div>
          <label className={labelClass}>Tagline / Clinical Specialty</label>
          <div className="relative">
            <FiActivity
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              placeholder="e.g. Modern Outpatient &amp; Comprehensive Healthcare"
              className={inputClass}
              {...register("tagline")}
            />
          </div>
        </div>

        {/* Facility Address */}
        <div>
          <label className={labelClass}>Facility Physical Address</label>
          <div className="relative">
            <FiMapPin
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              placeholder="e.g. Sector F-8 Markaz, Islamabad, Pakistan"
              className={inputClass}
              {...register("address")}
            />
          </div>
        </div>

        {/* Phone & Emergency Contact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Telephone / Mobile</label>
            <div className="relative">
              <FiPhone
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />
              <input
                placeholder="e.g. +92 51 2851234"
                className={inputClass}
                {...register("phone")}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Emergency Helpline</label>
            <div className="relative">
              <FiPhoneCall
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />
              <input
                placeholder="e.g. +92 300 1234567"
                className={inputClass}
                {...register("emergencyContact")}
              />
            </div>
          </div>
        </div>

        {/* Contact Email & Website Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Official Contact Email</label>
            <div className="relative">
              <FiMail
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />
              <input
                type="email"
                placeholder="contact@smartclinic.pk"
                className={inputClass}
                {...register("email")}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Website / Web Portal</label>
            <div className="relative">
              <FiGlobe
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />
              <input
                placeholder="https://smartclinic.health"
                className={inputClass}
                {...register("website")}
              />
            </div>
          </div>
        </div>

        {/* Default Consultation Fee */}
        <div>
          <label className={labelClass}>Default Consultation Fee (PKR)</label>
          <div className="relative">
            <RupeeIcon
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
            />
            <input
              type="number"
              min="0"
              step="50"
              placeholder="e.g. 1500"
              className={inputClass}
              {...register("defaultConsultationFee")}
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
            Pre-fills doctor OPD charges in PKR when creating new patient tokens and appointments.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/25 transition-all hover:shadow-md hover:scale-[1.01] active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? "Saving Profile..." : "Save Clinic Information"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClinicProfileForm;
