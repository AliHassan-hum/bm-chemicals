// src/components/Navbar.js
"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 text-white font-bold flex items-center justify-center rounded-lg text-xl shadow-md">
            BM
          </div>
          <div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight block leading-none">
              BM Chemical
            </span>
            <span className="text-xs text-blue-600 font-semibold tracking-wider uppercase">
              Smart Solutions
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="#products" className="hover:text-blue-600 transition-colors">
            Chemical Products
          </Link>
          <Link href="/token-entry" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Enter Qurandazi Token
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Qurandazi Quick CTA */}
          <Link
            href="/token-entry"
            className="hidden sm:inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-semibold hover:bg-emerald-100 transition-all"
          >
            🎟️ Submit Market Token
          </Link>

          {/* Cart Icon */}
          <Link href="/cart" className="relative p-2 text-gray-600 hover:text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Login / Profile */}
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow"
          >
            Sign In
          </Link>
        </div>

      </div>
    </header>
  );
}