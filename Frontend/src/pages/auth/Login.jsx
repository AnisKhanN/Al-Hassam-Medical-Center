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
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth.js";
import ThemeToggle from "../../components/common/ThemeToggle";
import useSEO from "../../hooks/useSEO";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        className="w-full max-w-md rounded-3xl border border-white/80 dark:border-slate-800 bg-white/85 dark:bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl"
      >
        <Link
          to="/"
          className="flex items-center gap-3 mb-6 group cursor-pointer"
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

        <div className="mb-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Staff Sign In
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Enter your credentials to access your clinic workspace.
          </p>
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
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Staff Email
            </label>
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-950/80 px-3.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition">
              <FiMail className="text-slate-400 shrink-0" size={16} />
              <input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="Enter your staff email"
                className="w-full bg-transparent px-3 py-2.5 text-sm font-medium outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
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
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-950/80 px-3.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition">
              <FiLock className="text-slate-400 shrink-0" size={16} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-transparent px-3 py-2.5 text-sm font-medium outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                aria-label={showPassword ? "Hide password" : "Show password"}
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
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 py-3 text-sm font-bold tracking-wide text-white shadow-md shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
