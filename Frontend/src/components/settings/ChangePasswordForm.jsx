import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const submit = async (values) => {
    setSaved(false);
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setSaved(true);
      reset();
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (err) {
      setError("root", {
        message: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950/60 pl-10 pr-10 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 transition";
  const labelClass =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300";

  return (
    <div className="max-w-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-8 shadow-xs backdrop-blur-md">
      <div className="mb-6 flex items-start gap-3.5 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
          <FiShield size={22} />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Security &amp; Password Management
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Ensure your account is protected with a resilient, salted password conforming to clinical data governance policies.
          </p>
        </div>
      </div>

      {errors.root && (
        <div className="mb-5 flex items-center gap-2 rounded-2xl border border-red-200/80 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/40 px-4 py-3 text-xs font-semibold text-red-600 dark:text-red-400">
          <FiAlertCircle size={16} className="shrink-0" />
          <span>{errors.root.message}</span>
        </div>
      )}
      {saved && (
        <div className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/80 dark:bg-emerald-950/40 px-4 py-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <FiCheckCircle size={16} className="shrink-0" />
          <span>✓ Password credentials updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
        {/* Current Password Field */}
        <div>
          <label className={labelClass}>Current Password</label>
          <div className="relative">
            <FiLock
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              type={showCurrentPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••••••"
              className={inputClass}
              {...register("currentPassword", {
                required: "Current password is required",
              })}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
              title={showCurrentPassword ? "Hide current password" : "Show current password"}
              tabIndex={-1}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              {showCurrentPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password Field */}
        <div>
          <label className={labelClass}>New Password</label>
          <div className="relative">
            <FiLock
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              type={showNewPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              className={inputClass}
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 6, message: "At least 6 characters required" },
              })}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              aria-label={showNewPassword ? "Hide new password" : "Show new password"}
              title={showNewPassword ? "Hide new password" : "Show new password"}
              tabIndex={-1}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              {showNewPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm New Password Field */}
        <div>
          <label className={labelClass}>Confirm New Password</label>
          <div className="relative">
            <FiLock
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-type new password"
              className={inputClass}
              {...register("confirmPassword", {
                required: "Please confirm the new password",
                validate: (v) => v === newPassword || "Passwords do not match",
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
              title={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
              tabIndex={-1}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
          {!errors.confirmPassword &&
            confirmPassword &&
            newPassword &&
            confirmPassword === newPassword && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <FiCheckCircle size={14} />
                <span>Passwords match</span>
              </p>
            )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/25 transition-all hover:shadow-md hover:scale-[1.01] active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? "Updating Credentials..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
