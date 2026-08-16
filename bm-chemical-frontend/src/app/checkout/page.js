// src/app/checkout/page.js
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [issuedToken, setIssuedToken] = useState(null);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulating Order Placement to FastAPI Backend
      const res = await fetch("http://https://bm-chemical-backend.vercel.app:8000/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item: "BM Washing Powder 1KG",
          amount: 850,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Server generates and returns an auto-assigned Qurandazi Token
        setIssuedToken(data.token_code || "BM-WEB-" + Math.floor(100000 + Math.random() * 900000));
      } else {
        // Fallback demo token for immediate feedback
        setIssuedToken("BM-WEB-" + Math.floor(100000 + Math.random() * 900000));
      }
    } catch (err) {
      setIssuedToken("BM-WEB-" + Math.floor(100000 + Math.random() * 900000));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto w-full py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Complete Online Purchase</h2>

          {issuedToken ? (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 text-center space-y-4">
              <span className="text-4xl">🎉</span>
              <h3 className="text-xl font-extrabold text-emerald-950">Order Placed Successfully!</h3>
              <p className="text-xs text-emerald-700">
                Thank you for buying from BM Chemical. Your lucky draw token has been automatically generated and enrolled in the Qurandazi scheme:
              </p>
              <div className="inline-block bg-white border border-emerald-300 px-6 py-3 rounded-xl shadow-inner font-mono font-bold text-emerald-800 text-lg tracking-widest">
                {issuedToken}
              </div>
              <div className="pt-2">
                <a
                  href="/my-orders"
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  View My Orders & Issued Tokens &rarr;
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center text-sm">
                <div>
                  <p className="font-bold text-gray-800">BM Super Washing Powder (Pack of 1)</p>
                  <p className="text-xs text-emerald-600 font-medium">Includes 1 Auto Qurandazi Entry</p>
                </div>
                <span className="font-extrabold text-gray-900">Rs. 850</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-md disabled:opacity-50 text-sm"
              >
                {loading ? "Processing Order..." : "Confirm Order & Generate Token"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}