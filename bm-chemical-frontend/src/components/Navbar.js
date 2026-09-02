// src/components/Navbar.js
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsLoggedIn(!!token);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <svg className="w-7 h-7 text-[#0056b3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 2v6l-5 9a2 2 0 002 3h12a2 2 0 002-3l-5-9V2M9 2h6" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 15h10" />
          </svg>
          <span className="text-lg font-bold text-[#0d1c2f] tracking-tight">
            BM Chemicals
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#334155]">
          <Link href="/#products" className="hover:text-[#0056b3] transition-colors">Products</Link>
          <Link href="/#solutions" className="hover:text-[#0056b3] transition-colors">Solutions</Link>
          <Link href="/#technical" className="hover:text-[#0056b3] transition-colors">Technical Data</Link>
          <Link href="/#sds" className="hover:text-[#0056b3] transition-colors">Safety SDS</Link>
          <Link href="/#about" className="hover:text-[#0056b3] transition-colors">About Us</Link>
          <Link href="/#contact" className="hover:text-[#0056b3] transition-colors">Contact</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/cart" className="relative p-2 text-[#334155] hover:text-[#0056b3] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </Link>

          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="bg-[#0056b3] hover:bg-[#003f87] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              Account
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex text-[#334155] hover:text-[#0056b3] px-3 py-2 text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-[#0056b3] hover:bg-[#003f87] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}