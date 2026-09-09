import { useState } from "react";
import { useForm } from "react-hook-form";
import { useChangePassword } from "../../hooks/useChangePassword";

const ChangePasswordForm = () => {
  const { changePassword } = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();
  const [saved, setSaved] = useState(false);
  const newPassword = watch("newPassword");

  const submit = async (values) => {
    setSaved(false);
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setSaved(true);
      reset();
    } catch (err) {
      setError("root", {
        message: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950/60 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 transition";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300";

  return (
    <div className="max-w-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-8 shadow-xs backdrop-blur-md">
      <div className="mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Security &amp; Password Management
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Ensure your account is protected with a resilient, salted password conforming to clinical data governance policies.
        </p>
      </div>

      {errors.root && (
        <div className="mb-5 rounded-2xl border border-red-200/80 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/40 px-4 py-3 text-xs font-semibold text-red-600 dark:text-red-400">
          {errors.root.message}
        </div>
      )}
      {saved && (
        <div className="mb-5 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/80 dark:bg-emerald-950/40 px-4 py-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          ✓ Password credentials updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
        <div>
          <label className={labelClass}>Current Password</label>
          <input
            type="password"
            placeholder="••••••••••••"
            className={inputClass}
            {...register("currentPassword", {
              required: "Current password is required",
            })}
          />
          {errors.currentPassword && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {errors.currentPassword.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>New Password</label>
          <input
            type="password"
            placeholder="At least 6 characters"
            className={inputClass}
            {...register("newPassword", {
              required: "New password is required",
              minLength: { value: 6, message: "At least 6 characters" },
            })}
          />
          {errors.newPassword && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {errors.newPassword.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Confirm New Password</label>
          <input
            type="password"
            placeholder="Re-type new password"
            className={inputClass}
            {...register("confirmPassword", {
              required: "Please confirm the new password",
              validate: (v) => v === newPassword || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/25 transition-all hover:shadow-md hover:scale-[1.01] active:scale-95 disabled:opacity-60"
          >
            {isSubmitting ? "Updating Credentials..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
