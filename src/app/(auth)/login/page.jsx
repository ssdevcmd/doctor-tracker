"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input } from "@heroui/react";
import {
  Activity,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      });

      if (error) {
        setError(error.message || "Invalid email or password.");
        return;
      }

      if (data) {
        router.replace("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4F7FB] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-[#101D35]/5 lg:grid-cols-2">

        {/* Left section */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#101D35] p-10 text-white lg:flex">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#37BD83]/10 blur-3xl" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="rounded-xl bg-[#182944] p-3">
                <Activity size={26} className="text-[#8DE5B1]" />
              </div>

              <span className="text-xl font-bold">
                Doctor Tracker
              </span>
            </Link>
          </div>

          <div className="relative z-10">
            <div className="mb-6 inline-flex rounded-2xl bg-[#182944] p-4">
              <Stethoscope size={42} className="text-[#8DE5B1]" />
            </div>

            <h1 className="max-w-md text-4xl font-bold leading-tight">
              Better healthcare management starts here.
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
              Manage doctors, organize patient records and
              keep your healthcare operations running smoothly
              from one simple dashboard.
            </p>

            <div className="mt-8 flex items-center gap-3 text-sm text-[#8DE5B1]">
              <ShieldCheck size={20} />
              Secure administrator access
            </div>
          </div>

          <p className="relative z-10 text-xs text-slate-400">
            © {new Date().getFullYear()} Doctor Tracker. All rights reserved.
          </p>
        </div>

        {/* Right section */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-md">

            <div className="mb-8 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="rounded-xl bg-[#101D35] p-2">
                  <Activity size={23} className="text-[#8DE5B1]" />
                </div>

                <span className="text-xl font-bold text-[#101D35]">
                  Doctor Tracker
                </span>
              </Link>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#269B68]">
                Welcome Back
              </p>

              <h2 className="text-3xl font-bold text-[#101D35]">
                Admin Login
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#64748B]">
                Sign in to access your Doctor Tracker dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-[#101D35]"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#94A3B8]"
                  />

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    fullWidth
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-[#101D35]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#94A3B8]"
                  />

                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    fullWidth
                    className="pl-10 pr-12"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-[#94A3B8] hover:text-[#101D35]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                isDisabled={loading || !email || !password}
                className="w-full rounded-xl bg-[#37BD83] py-3 font-semibold text-white transition hover:bg-[#269B68]"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-8 border-t border-[#E8EDF3] pt-6">
              <p className="text-center text-xs leading-6 text-[#94A3B8]">
                <ShieldCheck
                  size={15}
                  className="mr-1 inline text-[#37BD83]"
                />
                Secure access for authorized administrators only.
              </p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
