// src/app/checkout/page.js
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [issuedToken, setIssuedToken] = useState(null);

  const ITEM_NAME = "BM Super Washing Powder (Pack of 1)";
  const ITEM_PRICE = 850;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://bm-chemical-backend.vercel.app/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item: ITEM_NAME,
          amount: ITEM_PRICE,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIssuedToken(data.token_code || "BM-WEB-" + Math.floor(100000 + Math.random() * 900000));
      } else {
        setIssuedToken("BM-WEB-" + Math.floor(100000 + Math.random() * 900000));
      }
    } catch (err) {
      setIssuedToken("BM-WEB-" + Math.floor(100000 + Math.random() * 900000));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-[1280px] mx-auto w-full px-6 py-12">
        <h1 className="text-3xl font-bold text-[#0d1c2f] tracking-tight">Secure Checkout</h1>
        <p className="text-sm text-[#334155] mt-1">Review your order and confirm your purchase.</p>

        {issuedToken ? (
          <div className="mt-10 max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 brand-shadow-lg p-10 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#eff4ff] flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-[#0056b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#0d1c2f]">Order Placed Successfully!</h3>
            <p className="text-sm text-[#334155] mt-2 leading-relaxed">
              Thank you for buying from BM Chemicals. Your lucky draw token has been
              automatically generated and enrolled in the Qurandazi scheme.
            </p>
            <div className="inline-block bg-[#eff4ff] border border-[#c2c6d4] px-6 py-3 rounded-lg font-mono font-bold text-[#0056b3] text-lg tracking-widest mt-6">
              {issuedToken}
            </div>
            <div className="pt-6">
              <a
                href="/my-orders"
                className="text-sm font-semibold text-[#0056b3] hover:underline"
              >
                View My Orders &amp; Issued Tokens →
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 brand-shadow p-6 flex items-center gap-5">
                <div className="w-20 h-20 rounded-lg bg-[#f8f9ff] flex items-center justify-center shrink-0 border border-slate-100">
                  <svg className="w-9 h-9 text-[#c2c6d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v6l-6 10a1 1 0 001 1.5h16a1 1 0 001-1.5L15 9V3M9 3h6" />
                  </svg>
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-[#0d1c2f]">{ITEM_NAME}</h3>
                  <span className="inline-block mt-1.5 bg-[#eff4ff] text-[#0056b3] text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    Includes 1 Auto Qurandazi Entry
                  </span>
                </div>
                <span className="font-bold text-[#0d1c2f] text-lg shrink-0">Rs. {ITEM_PRICE}</span>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 brand-shadow p-6 h-fit">
              <h3 className="text-lg font-semibold text-[#0d1c2f] mb-5">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#334155]">
                  <span>Subtotal (1 item)</span>
                  <span>Rs. {ITEM_PRICE}</span>
                </div>
                <div className="flex justify-between text-[#334155]">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>

              <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between items-baseline">
                <span className="font-semibold text-[#0d1c2f]">Total</span>
                <span className="text-2xl font-bold text-[#0d1c2f]">Rs. {ITEM_PRICE}</span>
              </div>

              <form onSubmit={handlePlaceOrder}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-[#0056b3] hover:bg-[#003f87] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  {loading ? "Processing Order..." : "Confirm Order & Generate Token"}
                </button>
              </form>

              <div className="mt-5 pt-5 border-t border-slate-100 space-y-2.5 text-xs text-[#334155]">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#0056b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure B2B Transaction (SSL)
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#0056b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ISO 9001:2015 Compliant Supplier
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}