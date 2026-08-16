// src/app/token-entry/page.js
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";

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
      // Direct FastApi backend call to register physical market token
      const res = await fetch("http://https://bm-chemical-backend.vercel.app:8000/tokens/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token_code: tokenNumber,
          customer_name: customerName,
          phone_number: phone,
        }),
      });

      if (res.ok) {
        setStatus({ type: "success", msg: "🎉 Token Submitted Successfully! You are entered in the Lucky Draw." });
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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl shadow-inner">
              🎟️
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Enter Market Packet Token</h2>
            <p className="text-xs text-gray-500 mt-2">
              Bought BM Chemical washing powder from physical shop? Enter your scratch token code here to join the Qurandazi draw!
            </p>
          </div>

          {status && (
            <div
              className={`p-4 rounded-xl mb-6 text-xs font-semibold ${
                status.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {status.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Token Code Number
              </label>
              <input
                type="text"
                required
                placeholder="e.g. BM-98214"
                value={tokenNumber}
                onChange={(e) => setTokenNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm font-mono tracking-wider"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Ahmed Khan"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="03001234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm mt-2"
            >
              {loading ? "Submitting Token..." : "Submit Token for Qurandazi"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}