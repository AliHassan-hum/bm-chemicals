// src/app/checkout/page.js
"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const API = "https://bm-chemical-backend.vercel.app";

function CheckoutContent() {
  const router = useRouter();
  const params = useSearchParams();
  const productId = params.get("product");

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`${API}/products/`);
        if (res.ok) {
          const list = await res.json();
          const found = productId
            ? list.find((p) => String(p.id) === String(productId))
            : list[0];
          setProduct(found || null);
        }
      } catch (e) {
        console.error("Product load error:", e);
      } finally {
        setLoadingProduct(false);
      }
    }
    loadProduct();
  }, [productId]);

  const total = product ? product.price * quantity : 0;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id, quantity }),
      });
      const data = await res.json();

      if (res.status === 401) {
        setError("Session expire ho gaya. Please dobara login karein.");
        return;
      }
      if (!res.ok) {
        setError(typeof data.detail === "string" ? data.detail : "Order place nahi ho saka.");
        return;
      }

      // Backend order ke sath token bana deta hai; usay fetch karke dikhate hain
      let tokenCode = null;
      try {
        const tr = await fetch(`${API}/tokens/my-tokens`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (tr.ok) {
          const td = await tr.json();
          const t = (td.tokens || []).find((x) => x.order_id === data.id);
          tokenCode = t ? t.token_code : null;
        }
      } catch (e) {
        console.error("Token fetch error:", e);
      }

      setResult({ orderId: data.id, token: tokenCode, total: data.total_price });
    } catch (err) {
      setError("Server se connect nahi ho saka. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  const outOfStock = product && product.stock <= 0;

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-[1280px] mx-auto w-full px-6 py-12">
        <h1 className="text-3xl font-bold text-[#0d1c2f] tracking-tight">Secure Checkout</h1>
        <p className="text-sm text-[#334155] mt-1">Review your order and confirm your purchase.</p>

        {result ? (
          <div className="mt-10 max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 brand-shadow-lg p-10 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#eff4ff] flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-[#0056b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#0d1c2f]">Order Placed Successfully!</h3>
            <p className="text-sm text-[#334155] mt-2 leading-relaxed">
              Order #{result.orderId} confirm ho gaya (Total: Rs. {result.total}). Aap ka lucky draw token
              Qurandazi scheme mein enroll ho chuka hai.
            </p>
            {result.token && (
              <div className="inline-block bg-[#eff4ff] border border-[#c2c6d4] px-6 py-3 rounded-lg font-mono font-bold text-[#0056b3] text-lg tracking-widest mt-6">
                {result.token}
              </div>
            )}
            <div className="pt-6">
              <Link href="/my-orders" className="text-sm font-semibold text-[#0056b3] hover:underline">
                View My Orders &amp; Issued Tokens →
              </Link>
            </div>
          </div>
        ) : loadingProduct ? (
          <div className="mt-10 bg-white rounded-2xl h-40 animate-pulse border border-slate-200" />
        ) : !product ? (
          <div className="mt-10 bg-white rounded-2xl border border-slate-200 p-10 text-center brand-shadow">
            <p className="text-[#334155] mb-4">Product nahi mila.</p>
            <Link href="/" className="inline-block px-5 py-2.5 bg-[#0056b3] hover:bg-[#003f87] text-white rounded-lg text-sm font-semibold">
              Back to Store
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Item */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-200 brand-shadow p-6 flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="w-20 h-20 rounded-lg bg-[#f8f9ff] flex items-center justify-center shrink-0 border border-slate-100">
                  <svg className="w-9 h-9 text-[#c2c6d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v6l-6 10a1 1 0 001 1.5h16a1 1 0 001-1.5L15 9V3M9 3h6" />
                  </svg>
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-[#0d1c2f]">{product.name}</h3>
                  <p className="text-xs text-[#334155] mt-1">{product.description}</p>
                  <span className="inline-block mt-2 bg-[#eff4ff] text-[#0056b3] text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    Includes 1 Auto Qurandazi Entry
                  </span>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2 shrink-0">
                  <div className="flex items-center border border-slate-200 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 text-[#334155] hover:bg-slate-50"
                    >
                      −
                    </button>
                    <span className="px-3 text-sm font-semibold w-10 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(product.stock || 1, q + 1))}
                      className="px-3 py-1.5 text-[#334155] hover:bg-slate-50"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-[#0d1c2f] text-lg">Rs. {product.price}</span>
                  <span className="text-[11px] text-slate-400">In stock: {product.stock}</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 brand-shadow p-6 h-fit">
              <h3 className="text-lg font-semibold text-[#0d1c2f] mb-5">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#334155]">
                  <span>Subtotal ({quantity} item{quantity > 1 ? "s" : ""})</span>
                  <span>Rs. {total}</span>
                </div>
                <div className="flex justify-between text-[#334155]">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>

              <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between items-baseline">
                <span className="font-semibold text-[#0d1c2f]">Total</span>
                <span className="text-2xl font-bold text-[#0d1c2f]">Rs. {total}</span>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg">
                  {error}{" "}
                  {error.includes("login") && (
                    <Link href="/login" className="font-semibold underline">Login</Link>
                  )}
                </div>
              )}

              <form onSubmit={handlePlaceOrder}>
                <button
                  type="submit"
                  disabled={loading || outOfStock}
                  className="w-full mt-6 bg-[#0056b3] hover:bg-[#003f87] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 text-sm"
                >
                  {outOfStock ? "Out of Stock" : loading ? "Processing Order..." : "Confirm Order & Generate Token"}
                </button>
              </form>

              <div className="mt-5 pt-5 border-t border-slate-100 space-y-2.5 text-xs text-[#334155]">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#0056b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure Transaction (SSL)
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

export default function Checkout() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}