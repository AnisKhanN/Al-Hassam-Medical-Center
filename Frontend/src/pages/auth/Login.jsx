import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiActivity,
  FiUserCheck,
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth.js";
import ThemeToggle from "../../components/common/ThemeToggle";
import useSEO from "../../hooks/useSEO";

const QUICK_ROLES = [
  {
    role: "Admin",
    name: "Anis Khan Niazi",
    email: "admin@clinic.com",
    password: "ChangeMe123",
    badge:
      "bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  },
  {
    role: "Doctor",
    name: "Dr. Amina",
    email: "amina@clinic.com",
    password: "Doctor123",
    badge:
      "bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  {
    role: "Receptionist",
    name: "Reception Desk",
    email: "receptionist@clinic.com",
    password: "Recep123",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },
  {
    role: "Pharmacist",
    name: "Pharmacy Store",
    email: "pharmacist@clinic.com",
    password: "Pharmacist123",
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  },
];

const Login = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "admin@clinic.com",
      password: "ChangeMe123",
    },
  });
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Admin");

  useSEO({
    title: "Sign In & Authentication",
    description:
      "Secure role-based staff authentication portal for SmartClinic administrative, clinical, and pharmacy personnel.",
  });

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleQuickSelect = (item) => {
    setSelectedRole(item.role);
    setValue("email", item.email, { shouldValidate: true });
    setValue("password", item.password, { shouldValidate: true });
    setServerError("");
  };

  const onSubmit = async ({ email, password }) => {
    setServerError("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          "Login failed. Please check your email and password.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/80 px-4 py-12 transition-colors duration-200">
      {/* Top action bar with back button & theme toggle */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-white/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3.5 py-2 backdrop-blur-sm shadow-sm transition-all"
        >
          <FiArrowLeft size={15} />
          <span>Back to Landing Page</span>
        </Link>
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg rounded-3xl border border-white/80 dark:border-slate-800 bg-white/85 dark:bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl"
      >
        <Link
          to="/"
          className="flex items-center gap-3 mb-4 group cursor-pointer"
          title="Back to Home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
            <FiActivity size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              SmartClinic Portal
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Healthcare SaaS &amp; Pharmacy Management
            </p>
          </div>
        </Link>

        {/* Quick Role Selector for Easy Testing & Chrome Password Saving */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FiUserCheck size={14} className="text-blue-500" />
              1-Click Role Switcher:
            </span>
            <span className="text-[10px] text-slate-400">
              Autofills credentials
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {QUICK_ROLES.map((item) => (
              <button
                key={item.role}
                type="button"
                onClick={() => handleQuickSelect(item)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-semibold border transition-all ${
                  selectedRole === item.role
                    ? "border-blue-500 ring-2 ring-blue-500/30 bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span>{item.role}</span>
              </button>
            ))}
          </div>
        </div>

        {serverError && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 px-3.5 py-2.5 text-xs text-red-600 dark:text-red-300">
            <FiAlertCircle className="shrink-0" size={16} />
            <span>{serverError}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Staff Email
            </label>
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-950/80 px-3.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
              <FiMail className="text-slate-400 shrink-0" size={16} />
              <input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="admin@clinic.com"
                className="w-full bg-transparent px-2.5 py-2.5 text-xs sm:text-sm outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-950/80 px-3.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
              <FiLock className="text-slate-400 shrink-0" size={16} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-transparent px-2.5 py-2.5 text-xs sm:text-sm outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                title={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {submitting ? "Signing in..." : `Sign In as ${selectedRole}`}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
