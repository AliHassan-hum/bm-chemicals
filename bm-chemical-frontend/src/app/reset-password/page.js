// src/app/reset-password/page.js
"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Reset link is invalid or missing a token.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://bm-chemical-backend.vercel.app/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || "Password reset successfully!");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.detail || "Failed to reset password.");
      }
    } catch (err) {
      setError("Server Error! Check if FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <svg className="w-7 h-7 text-[#0056b3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 2v6l-5 9a2 2 0 002 3h12a2 2 0 002-3l-5-9V2M9 2h6" />
          </svg>
          <span className="text-lg font-bold text-[#0d1c2f]">BM Chemicals</span>
        </Link>

        <div className="bg-white border border-slate-200 rounded-2xl brand-shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#0d1c2f]">Set a new password</h2>
            <p className="text-sm text-[#334155] mt-1">Choose a strong password for your account.</p>
          </div>

          {!token && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4 text-center">
              This reset link is invalid. Please request a new one.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm p-3 rounded-lg mb-4 text-center">
              {success}
            </div>
          )}

          {token && !success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#0056b3] focus:ring-2 focus:ring-[#0056b3]/10 transition-colors"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#0056b3] focus:ring-2 focus:ring-[#0056b3]/10 transition-colors"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0056b3] hover:bg-[#003f87] text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 mt-2"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <p className="text-center text-[#334155] text-sm mt-6">
            <Link href="/login" className="text-[#0056b3] hover:underline font-semibold">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}