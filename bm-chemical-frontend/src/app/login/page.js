// src/app/login/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const bodyFormData = new FormData();
    bodyFormData.append("username", formData.username);
    bodyFormData.append("password", formData.password);

    try {
      const res = await fetch("https://bm-chemical-backend.vercel.app/login", {
        method: "POST",
        body: bodyFormData,
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", data.role);
        router.push("/dashboard");
      } else {
        setError(data.detail || "Invalid email or password!");
      }
    } catch (err) {
      setError("Server Error! Make sure FastAPI is running.");
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
            <h2 className="text-2xl font-bold text-[#0d1c2f]">Sign in to your account</h2>
            <p className="text-sm text-[#334155] mt-1">Welcome back — please enter your details.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1.5">Email Address</label>
              <input
                type="email"
                required
                className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#0056b3] focus:ring-2 focus:ring-[#0056b3]/10 transition-colors"
                placeholder="user@example.com"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#334155]">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#0056b3] hover:underline font-medium">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                required
                className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#0056b3] focus:ring-2 focus:ring-[#0056b3]/10 transition-colors"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0056b3] hover:bg-[#003f87] text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-[#334155] text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#0056b3] hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}