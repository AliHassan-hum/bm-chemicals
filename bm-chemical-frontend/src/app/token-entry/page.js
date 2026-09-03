// src/app/token-entry/page.js
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TokenEntry() {
  const [tokenNumber, setTokenNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("https://bm-chemical-backend.vercel.app/tokens/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token_code: tokenNumber,
          customer_name: customerName,
          phone_number: phone,
        }),
      });

      if (res.ok) {
        setStatus({ type: "success", msg: "Token submitted successfully! You are entered in the Lucky Draw." });
        setTokenNumber("");
        setCustomerName("");
        setPhone("");
      } else {
        const errorData = await res.json();
        setStatus({ type: "error", msg: errorData.detail || "Invalid or already used token number." });
      }
    } catch (err) {
      setStatus({ type: "error", msg: "Server connectivity issue. Make sure backend is running." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 brand-shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#eff4ff] text-[#0056b3] rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#0d1c2f]">Enter Market Packet Token</h2>
            <p className="text-sm text-[#334155] mt-2 leading-relaxed">
              Bought BM Chemical washing powder from a physical shop? Enter your scratch
              token code here to join the Qurandazi draw.
            </p>
          </div>

          {status && (
            <div
              className={`p-4 rounded-lg mb-6 text-sm font-medium ${
                status.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {status.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                Token Code Number
              </label>
              <input
                type="text"
                required
                placeholder="e.g. BM-98214"
                value={tokenNumber}
                onChange={(e) => setTokenNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0056b3] focus:ring-2 focus:ring-[#0056b3]/10 transition-colors text-sm font-mono tracking-wider"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                Your Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Ahmed Khan"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0056b3] focus:ring-2 focus:ring-[#0056b3]/10 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="03001234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0056b3] focus:ring-2 focus:ring-[#0056b3]/10 transition-colors text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0056b3] hover:bg-[#003f87] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 text-sm mt-2"
            >
              {loading ? "Submitting Token..." : "Submit Token for Qurandazi"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}