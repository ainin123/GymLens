"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Shield,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Google Icon ─────────────────────────────────────────────────────────── */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* ─── Input Field ─────────────────────────────────────────────────────────── */
interface InputProps {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  error?: string;
  rightElement?: React.ReactNode;
  autoComplete?: string;
}

function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
  error,
  rightElement,
  autoComplete,
}: InputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">{icon}</div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn(
            "w-full bg-white/5 border rounded-xl px-10 py-3 text-white placeholder-gray-600 text-sm outline-none",
            "focus:ring-2 focus:ring-violet-500/40 transition-all duration-200",
            error ? "border-red-500/50 focus:border-red-500/80" : "border-white/10 focus:border-violet-500/50"
          )}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 text-red-400 text-xs"
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </motion.div>
      )}
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    // In production: handle auth response
    setErrors({ general: "Invalid email or password. Please try again." });
  };

  return (
    <div className="min-h-dvh bg-gray-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background orbs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -30, 15, 0], y: [0, 30, -20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, 20, -10, 0], y: [0, -15, 25, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-purple-700/10 blur-[100px]"
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(139,92,246,0.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Glow border */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-violet-600/30 via-purple-600/20 to-indigo-600/30 rounded-3xl blur-sm" />

        <div className="relative backdrop-blur-2xl bg-gray-950/90 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center gap-2.5 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-xl p-2.5">
                  <Dumbbell className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                GymLens AI
              </span>
            </Link>
            <h1 className="text-2xl font-black text-white">Welcome back</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to continue to GymLens AI</p>
          </div>

          {/* Social login buttons */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 text-sm font-semibold hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
              <GoogleIcon className="w-5 h-5 flex-shrink-0" />
              Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 text-sm font-semibold hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
              <Shield className="w-5 h-5 flex-shrink-0 text-gray-400" />
              Continue with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-500 text-xs font-medium px-2">or continue with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* General error */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4"
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm">{errors.general}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Email address"
              type="email"
              value={email}
              onChange={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: undefined })); }}
              placeholder="you@example.com"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email}
              autoComplete="email"
            />

            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined })); }}
              placeholder="Enter your password"
              icon={<Lock className="w-4 h-4" />}
              error={errors.password}
              autoComplete="current-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-300 transition-colors p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 flex-shrink-0",
                    rememberMe
                      ? "bg-violet-600 border-violet-600"
                      : "border-white/20 bg-white/5 group-hover:border-white/30"
                  )}
                >
                  {rememberMe && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className="text-gray-400 text-xs">Remember me</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-violet-400 hover:text-violet-300 text-xs font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "relative w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-white font-bold text-sm overflow-hidden transition-all duration-300",
                "hover:scale-[1.02] active:scale-[0.98]",
                loading
                  ? "cursor-not-allowed opacity-80"
                  : "shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
              )}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
              <span className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
