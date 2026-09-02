import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth.js";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async ({ email, password }) => {
    setServerError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl border border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur-lg"
      >
        <h1 className="mb-1 text-2xl font-semibold text-slate-800">
          Welcome back
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          Sign in to your clinic dashboard
        </p>

        {serverError && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            <FiAlertCircle /> {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Email
            </label>
            <div className="flex items-center rounded-lg border border-slate-200 bg-white/80 px-3 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
              <FiMail className="text-slate-400" />
              <input
                type="email"
                placeholder="you@clinic.com"
                className="w-full bg-transparent px-2 py-2.5 text-sm outline-none"
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
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Password
            </label>
            <div className="flex items-center rounded-lg border border-slate-200 bg-white/80 px-3 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
              <FiLock className="text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent px-2 py-2.5 text-sm outline-none"
                {...register("password", { required: "Password is required" })}
              />
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
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
