// src/app/page.js
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Storefront() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("https://bm-chemical-backend.vercel.app/products/");
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
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-white border-b border-slate-200 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-[#eff4ff] text-[#0056b3] border border-[#c2c6d4] px-3 py-1.5 rounded-full text-xs font-semibold">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ISO 9001:2015 Certified
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#eff4ff] text-[#334155] px-3 py-1.5 rounded-full text-xs font-semibold">
                Industrial Grade
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-[#0d1c2f] tracking-tight leading-[1.15]">
              Precision Cleaning for Every Home &amp; Industry
            </h1>
            <p className="mt-6 text-base sm:text-lg text-[#334155] leading-relaxed max-w-xl">
              Factory-formulated washing powders, detergents, and industrial cleaning
              chemicals — engineered for uncompromising performance. Every order
              automatically enters you into our Qurandazi lucky draw.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#products"
                className="inline-flex items-center gap-2 bg-[#0056b3] hover:bg-[#003f87] text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors"
              >
                Browse Products
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <Link
                href="/token-entry"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#0056b3] border border-[#0056b3] px-6 py-3 rounded-lg font-semibold text-sm transition-colors"
              >
                Enter Market Token
              </Link>
            </div>

            <div className="mt-14 pt-8 border-t border-slate-200 grid grid-cols-3 gap-6">
              <div>
                <p className="text-2xl font-bold text-[#0056b3]">99.9%</p>
                <p className="text-xs text-[#334155] mt-1">Efficacy Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0056b3]">50+</p>
                <p className="text-xs text-[#334155] mt-1">Cities Served</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0056b3]">24/7</p>
                <p className="text-xs text-[#334155] mt-1">Customer Support</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#0056b3] to-[#003f87] flex items-center justify-center overflow-hidden brand-shadow-lg">
              <svg className="w-32 h-32 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v6l-6 10a1 1 0 001 1.5h16a1 1 0 001-1.5L15 9V3M9 3h6M9 14h6" />
              </svg>
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center gap-2 brand-shadow-lg">
              <svg className="w-4 h-4 text-[#0056b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-xs font-semibold text-[#0d1c2f]">Sustainable Formula</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Competencies */}
      <section className="bg-[#f8f9ff] py-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-3xl font-bold text-[#0d1c2f] tracking-tight">Core Competencies</h2>
          <p className="mt-2 text-[#334155] max-w-2xl">
            Specialized formulations designed to meet rigorous quality standards while
            maximizing everyday cleaning efficiency.
          </p>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 brand-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#eff4ff] flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#0056b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v6l-6 10a1 1 0 001 1.5h16a1 1 0 001-1.5L15 9V3M9 3h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#0d1c2f]">Washing Powders &amp; Detergents</h3>
              <p className="mt-2 text-sm text-[#334155] leading-relaxed">
                Heavy-duty formulations engineered for maximum stain removal and fabric
                care, tested for consistent quality across every batch.
              </p>
              <span className="mt-6 inline-block bg-[#eff4ff] text-[#0056b3] text-xs font-semibold px-3 py-1.5 rounded-full">
                Household Range
              </span>
            </div>

            <div className="grid grid-rows-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 brand-shadow">
                <div className="w-10 h-10 rounded-lg bg-[#eff4ff] flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-[#0056b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#0d1c2f]">Raw Industrial Chemicals</h3>
                <p className="mt-1 text-sm text-[#334155]">
                  Factory-grade compounds for bulk manufacturing and processing needs.
                </p>
              </div>

              <div className="bg-[#003f87] rounded-2xl p-6 text-white">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Qurandazi Lucky Draw</h3>
                <p className="mt-1 text-sm text-white/80">
                  Every online order and market token entry qualifies for our fair,
                  automated lucky draw system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Token Banner */}
      <section className="bg-[#0056b3] py-6 px-6">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Physical Market Token Entry Scheme</h4>
              <p className="text-xs text-white/80 mt-0.5">
                Have a washing powder packet token from your local shop? Register the code to enter the live draw.
              </p>
            </div>
          </div>
          <Link
            href="/token-entry"
            className="text-xs font-semibold text-[#0056b3] bg-white hover:bg-slate-50 px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
          >
            Submit Token Code →
          </Link>
        </div>
      </section>

      {/* Product Catalog */}
      <main id="products" className="max-w-[1280px] mx-auto px-6 py-20 flex-grow w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-slate-200 pb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#0d1c2f] tracking-tight">Product Catalog</h2>
            <p className="text-sm text-[#334155] mt-2">
              Select products to order online. Every order generates an instant Qurandazi token.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeCategory === cat
                    ? "bg-[#0056b3] text-white"
                    : "bg-white text-[#334155] hover:bg-slate-50 border border-slate-200"
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
              <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 brand-shadow">
            <p className="text-[#334155] font-medium text-sm">No products available currently.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:brand-shadow-lg transition-shadow duration-200 flex flex-col"
              >
                <div className="h-48 bg-[#f8f9ff] relative flex items-center justify-center p-6 border-b border-slate-100">
                  {product.image ? (
                    <img
                      src={`https://bm-chemical-backend.vercel.app/${product.image}`}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <svg className="w-16 h-16 text-[#c2c6d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v6l-6 10a1 1 0 001 1.5h16a1 1 0 001-1.5L15 9V3M9 3h6" />
                    </svg>
                  )}
                  <span className="absolute top-3 right-3 bg-[#eff4ff] text-[#0056b3] text-[10px] font-semibold px-2.5 py-1 rounded-full border border-[#c2c6d4]">
                    Auto-Token
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-semibold text-[#0d1c2f] text-base">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#334155] mt-2 line-clamp-2 flex-grow leading-relaxed">
                    {product.description || "High efficiency formulated chemical product."}
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Price</span>
                      <span className="text-lg font-bold text-[#0d1c2f]">Rs. {product.price}</span>
                    </div>
                    <Link
                      href="/checkout"
                      className="bg-[#0056b3] hover:bg-[#003f87] text-white px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors"
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

      {/* Floating AI Agent Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        {!showChat ? (
          <button
            onClick={() => setShowChat(true)}
            className="bg-[#0056b3] hover:bg-[#003f87] text-white px-5 py-3.5 rounded-full flex items-center gap-3 transition-colors brand-shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold leading-none">BM AI Agent</p>
              <p className="text-[10px] text-blue-200 mt-0.5">Online Support</p>
            </div>
          </button>
        ) : (
          <div className="bg-white border border-slate-200 brand-shadow-lg rounded-2xl w-80 sm:w-96 overflow-hidden flex flex-col h-[480px]">
            <div className="bg-[#0056b3] text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-semibold">BM Chemical AI Support</h4>
                  <p className="text-[10px] text-blue-200 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block"></span>
                    Agent Active
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-blue-200 hover:text-white font-bold text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-grow p-4 bg-[#f8f9ff] overflow-y-auto space-y-3 text-xs">
              <div className="bg-white text-[#0d1c2f] p-3.5 rounded-xl border border-slate-200 max-w-[88%] leading-relaxed">
                Hello! I am the BM Chemical AI Assistant. Ask me about chemical formulations, prices, or Qurandazi entries.
              </div>
            </div>

            <div className="p-3.5 bg-white border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder="Ask about products or draw..."
                className="flex-grow border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#0056b3]"
              />
              <button className="bg-[#0056b3] text-white px-4 py-2.5 rounded-lg text-xs font-semibold hover:bg-[#003f87] transition-colors">
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}