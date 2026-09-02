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
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400";
  const labelClass = "mb-1 block text-sm font-medium text-slate-600";

  return (
    <div className="max-w-lg rounded-2xl border border-slate-100 bg-white/70 p-6 shadow-sm backdrop-blur">
      <h2 className="mb-4 text-base font-semibold text-slate-800">
        Change Password
      </h2>

      {errors.root && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {errors.root.message}
        </div>
      )}
      {saved && (
        <div className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
          Password updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
        <div>
          <label className={labelClass}>Current Password</label>
          <input
            type="password"
            className={inputClass}
            {...register("currentPassword", {
              required: "Current password is required",
            })}
          />
          {errors.currentPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.currentPassword.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>New Password</label>
          <input
            type="password"
            className={inputClass}
            {...register("newPassword", {
              required: "New password is required",
              minLength: { value: 6, message: "At least 6 characters" },
            })}
          />
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.newPassword.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Confirm New Password</label>
          <input
            type="password"
            className={inputClass}
            {...register("confirmPassword", {
              required: "Please confirm the new password",
              validate: (v) => v === newPassword || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
