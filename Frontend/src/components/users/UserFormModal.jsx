import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";

const STAFF_ROLES = ["Doctor", "Receptionist", "Pharmacist"];

const UserFormModal = ({ isOpen, onClose, onSubmit, editingUser }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const isEditMode = Boolean(editingUser);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePasswordInEdit, setChangePasswordInEdit] = useState(false);

  const passwordValue = watch("password");

  const availableRoles =
    isEditMode && editingUser?.role === "Admin"
      ? ["Admin", ...STAFF_ROLES]
      : STAFF_ROLES;

  useEffect(() => {
    if (isOpen) {
      setShowPassword(false);
      setShowConfirmPassword(false);
      setChangePasswordInEdit(false);
      reset(
        isEditMode
          ? { name: editingUser.name, role: editingUser.role, password: "", confirmPassword: "" }
          : { name: "", email: "", password: "", confirmPassword: "", role: "Doctor" },
      );
    }
  }, [isOpen, editingUser, isEditMode, reset]);

  const submit = async (formValues) => {
    try {
      const payload = {
        name: formValues.name.trim(),
        role: formValues.role,
      };

      if (!isEditMode) {
        payload.email = formValues.email.trim();
        payload.password = formValues.password;
      } else if (changePasswordInEdit && formValues.password) {
        payload.password = formValues.password;
      }

      await onSubmit(payload);
      onClose();
    } catch (err) {
      setError("root", {
        message: err.response?.data?.message || "Something went wrong while saving staff account",
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Modal Header */}
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                  <FiUser size={20} />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {isEditMode ? "Edit Staff Member" : "Add Staff Member"}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isEditMode
                      ? "Update credentials or role assignment"
                      : "Create a new authenticated clinic staff member"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Error Banner */}
            {errors.root && (
              <div className="mb-4 rounded-xl border border-red-200/80 bg-red-50 p-3 text-xs font-semibold text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                {errors.root.message}
              </div>
            )}

            <form
              onSubmit={handleSubmit(submit)}
              noValidate
              className="space-y-4"
            >
              {/* Full Name Field */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <FiUser className="absolute left-3.5 text-slate-400 pointer-events-none" size={16} />
                  <input
                    type="text"
                    placeholder="e.g. Dr. Amina Khan"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-950 transition-all font-medium"
                    {...register("name", { required: "Full name is required" })}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field (Only on Create) */}
              {!isEditMode && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Staff Email
                  </label>
                  <div className="relative flex items-center">
                    <FiMail className="absolute left-3.5 text-slate-400 pointer-events-none" size={16} />
                    <input
                      type="email"
                      autoComplete="username"
                      placeholder="staff@clinic.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-950 transition-all font-medium"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              )}

              {/* In Edit Mode: Optional Password Reset Switch */}
              {isEditMode && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setChangePasswordInEdit(!changePasswordInEdit)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    <FiLock size={13} />
                    <span>
                      {changePasswordInEdit
                        ? "Cancel password change"
                        : "+ Change / Reset Staff Password"}
                    </span>
                  </button>
                </div>
              )}

              {/* Password Fields with Eye Setting */}
              {(!isEditMode || changePasswordInEdit) && (
                <>
                  {/* Password Input */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {isEditMode ? "New Password" : "Password"}
                    </label>
                    <div className="relative flex items-center">
                      <FiLock className="absolute left-3.5 text-slate-400 pointer-events-none" size={16} />
                      <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="At least 6 characters"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-950 transition-all font-medium"
                        {...register("password", {
                          required: !isEditMode || changePasswordInEdit ? "Password is required" : false,
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 transition-colors cursor-pointer"
                        title={showPassword ? "Hide password" : "Show password"}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        tabIndex={-1}
                      >
                        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs font-medium text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Confirm Password
                    </label>
                    <div className="relative flex items-center">
                      <FiLock className="absolute left-3.5 text-slate-400 pointer-events-none" size={16} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Re-type password to confirm"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-950 transition-all font-medium"
                        {...register("confirmPassword", {
                          required: !isEditMode || changePasswordInEdit ? "Please confirm password" : false,
                          validate: (val) => {
                            if ((!isEditMode || changePasswordInEdit) && val !== passwordValue) {
                              return "Passwords do not match";
                            }
                            return true;
                          },
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 transition-colors cursor-pointer"
                        title={showConfirmPassword ? "Hide password" : "Show password"}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs font-medium text-red-500">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                    {passwordValue && passwordValue.length >= 6 && watch("confirmPassword") === passwordValue && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <FiCheckCircle size={12} />
                        <span>Passwords match</span>
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Role Assignment */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Role Assignment
                </label>
                <div className="relative flex items-center">
                  <FiShield className="absolute left-3.5 text-slate-400 pointer-events-none" size={16} />
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:focus:bg-slate-950 transition-all font-medium cursor-pointer"
                    {...register("role", { required: true })}
                  >
                    {availableRoles.map((r) => (
                      <option key={r} value={r} className="dark:bg-slate-900 dark:text-white">
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 rounded-xl border border-slate-200 bg-white py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:shadow-lg hover:shadow-blue-500/35 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting
                    ? "Saving..."
                    : isEditMode
                      ? "Save Changes"
                      : "Create Staff Member"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserFormModal;
