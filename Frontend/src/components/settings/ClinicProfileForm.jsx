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
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400";
  const labelClass = "mb-1 block text-sm font-medium text-slate-600";

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-lg rounded-2xl border border-slate-100 bg-white/70 p-6 shadow-sm backdrop-blur">
      <h2 className="mb-4 text-base font-semibold text-slate-800">
        Clinic Profile
      </h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}
      {errors.root && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {errors.root.message}
        </div>
      )}
      {saved && (
        <div className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
          Clinic profile updated.
        </div>
      )}

      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
        <div>
          <label className={labelClass}>Clinic Name</label>
          <input
            className={inputClass}
            {...register("clinicName", { required: "Clinic name is required" })}
          />
          {errors.clinicName && (
            <p className="mt-1 text-xs text-red-500">
              {errors.clinicName.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Address</label>
          <input className={inputClass} {...register("address")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Phone</label>
            <input className={inputClass} {...register("phone")} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" className={inputClass} {...register("email")} />
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ClinicProfileForm;
