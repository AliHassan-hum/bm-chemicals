// src/app/page.js
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Storefront() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://127.0.0.1:8000/products/");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const categories = ["All", "Washing Powders", "Raw Chemicals", "Cleaners"];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-500 selection:text-white relative">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-md">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></span>
              ISO Certified Chemical Standards
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.15]">
              High Performance <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                Chemical Formulations
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Discover superior washing powders and industrial cleaning solutions. Order online to automatically get your Qurandazi Lucky Draw entry, or register scratch codes from physical market packets!
            </p>
            <div className="mt-10 flex flex-wrap gap-4 items-center">
              <a
                href="#products"
                className="bg-blue-600 hover:bg-blue-500 text-white px-7 py-3.5 rounded-xl font-bold transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 text-sm"
              >
                Browse Products &rarr;
              </a>
              <Link
                href="/token-entry"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3.5 rounded-xl font-bold transition-all shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:-translate-y-0.5 text-sm flex items-center gap-2"
              >
                🎟️ Enter Market Token
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative">
              <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-6 text-3xl border border-blue-500/20">
                🧪
              </div>
              <h3 className="text-xl font-extrabold text-white">BM Quality & Transparency</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Direct factory-formulated raw detergents & washing powders. Integrated AI-driven Qurandazi draw system for guaranteed fair physical & digital token verification.
              </p>
              <div className="mt-6 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Lab Certified</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  ✓ 100% Verified Pure
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-b border-slate-200/80 py-6 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex items-center justify-center gap-4 p-2">
            <span className="text-3xl p-2.5 bg-blue-50 rounded-2xl text-blue-600">🚚</span>
            <div className="text-left">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Nationwide Shipping</h5>
              <p className="text-[11px] text-slate-500 mt-0.5">Quick dispatch across Pakistan</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 p-2">
            <span className="text-3xl p-2.5 bg-emerald-50 rounded-2xl text-emerald-600">🧪</span>
            <div className="text-left">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Factory Formulated</h5>
              <p className="text-[11px] text-slate-500 mt-0.5">Tested for maximum detergent efficiency</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 p-2">
            <span className="text-3xl p-2.5 bg-amber-50 rounded-2xl text-amber-600">🎁</span>
            <div className="text-left">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Dual Qurandazi Draw</h5>
              <p className="text-[11px] text-slate-500 mt-0.5">Physical & online automatic tokens</p>
            </div>
          </div>
        </div>
      </section>

      {/* Token Banner */}
      <section className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white py-5 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 bg-emerald-500/20 rounded-xl">🎟️</span>
            <div>
              <h4 className="font-bold text-sm text-emerald-300">Physical Market Token Entry Scheme</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Have a washing powder packet token from local shop? Register code to enter live lucky draw!
              </p>
            </div>
          </div>
          <Link
            href="/token-entry"
            className="text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-emerald-400/20 whitespace-nowrap"
          >
            Submit Token Code &rarr;
          </Link>
        </div>
      </section>

      {/* Catalog */}
      <main id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-slate-200 pb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Chemical Product Catalog</h2>
            <p className="text-sm text-slate-500 mt-1">Select products to order online. Every order generates an instant Qurandazi token.</p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-80 animate-pulse border border-slate-200 p-4" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-4xl block mb-3">🧼</span>
            <p className="text-slate-600 font-bold text-sm">No products available currently.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
              >
                <div className="h-52 bg-slate-50 relative flex items-center justify-center p-6 border-b border-slate-100">
                  {product.image ? (
                    <img
                      src={`http://127.0.0.1:8000/${product.image}`}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">🧼</span>
                  )}
                  <span className="absolute top-3 right-3 bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-200/80 shadow-sm">
                    Auto-Token
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 flex-grow leading-relaxed">
                    {product.description || "High efficiency formulated chemical product."}
                  </p>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Price</span>
                      <span className="text-lg font-black text-slate-900">Rs. {product.price}</span>
                    </div>
                    <Link
                      href="/checkout"
                      className="bg-slate-900 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-blue-600/30"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating AI Agent Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!showChat ? (
          <button
            onClick={() => setShowChat(true)}
            className="bg-slate-900 hover:bg-blue-600 text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-3 transition-all hover:scale-105 border border-slate-700 group"
          >
            <span className="text-2xl">🤖</span>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold leading-none">BM AI Agent</p>
              <p className="text-[10px] text-emerald-400 mt-0.5">Online Support</p>
            </div>
          </button>
        ) : (
          <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl w-80 sm:w-96 overflow-hidden flex flex-col h-[480px]">
            {/* Chat Header */}
            <div className="bg-slate-950 text-white p-4 flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 bg-blue-500/20 rounded-xl">🤖</span>
                <div>
                  <h4 className="text-xs font-extrabold">BM Chemical AI Support</h4>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse"></span>
                    LangGraph Agent Active
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-slate-400 hover:text-white font-bold text-sm p-1"
              >
                ✕
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-grow p-4 bg-slate-50 overflow-y-auto space-y-3 text-xs">
              <div className="bg-white text-slate-800 p-3.5 rounded-2xl border border-slate-200/80 shadow-sm max-w-[88%] leading-relaxed">
                Hello! 👋 I am the BM Chemical AI Assistant. Ask me about chemical formulations, prices, or Qurandazi entries!
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-3.5 bg-white border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder="Ask about products or draw..."
                className="flex-grow border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
              <button className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-md">
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-10 px-4 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 BM Chemical Platform. All Rights Reserved.</p>
          <div className="flex gap-6 text-slate-400 font-semibold">
            <Link href="/" className="hover:text-white transition-colors">Storefront</Link>
            <Link href="/token-entry" className="hover:text-white transition-colors">Token Entry</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Admin Panel</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}