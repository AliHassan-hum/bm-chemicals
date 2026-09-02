// src/components/Footer.js
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#eff4ff] border-t border-slate-200 mt-auto">
      <div className="max-w-[1280px] mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-6 h-6 text-[#0056b3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 2v6l-5 9a2 2 0 002 3h12a2 2 0 002-3l-5-9V2M9 2h6" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 15h10" />
            </svg>
            <span className="text-lg font-bold text-[#0d1c2f]">BM Chemicals</span>
          </div>
          <p className="text-sm text-[#334155] leading-relaxed">
            © {new Date().getFullYear()} BM Chemicals Manufacturing.<br />
            All Rights Reserved.<br />
            ISO 9001:2015 Certified.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[#0d1c2f] mb-3">Products & Solutions</h4>
          <ul className="space-y-2 text-sm text-[#334155]">
            <li><Link href="/#products" className="hover:text-[#0056b3]">Product Catalog</Link></li>
            <li><Link href="/#sds" className="hover:text-[#0056b3]">Safety Data Sheets</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[#0d1c2f] mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-[#334155]">
            <li><Link href="/#about" className="hover:text-[#0056b3]">Sustainability</Link></li>
            <li><Link href="/#about" className="hover:text-[#0056b3]">Certifications</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[#0d1c2f] mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-[#334155]">
            <li><Link href="/terms" className="hover:text-[#0056b3]">Terms of Sale</Link></li>
            <li><Link href="/privacy" className="hover:text-[#0056b3]">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}