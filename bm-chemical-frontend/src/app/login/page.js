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
      // FIXED: Direct Production Backend URL
      const res = await fetch("https://bm-chemical-backend.vercel.app/login", {
        method: "POST",
        body: bodyFormData,
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        alert("Login successful!");
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            BM CHEMICALS
          </h2>
          <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
              placeholder="user@example.com"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-sm transition duration-200 disabled:opacity-50 mt-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}