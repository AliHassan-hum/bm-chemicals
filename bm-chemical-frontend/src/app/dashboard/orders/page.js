'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const router = useRouter();

  const [orders] = useState([
    { id: 'ORD-101', client: 'Alpha Pharma Ltd', chemical: 'Ethanol 99.9%', qty: '500 L', status: 'Pending', total: '$42,500' },
    { id: 'ORD-102', client: 'National Textile Corp', chemical: 'Sulfuric Acid 98%', qty: '1,200 L', status: 'Completed', total: '$60,000' },
    { id: 'ORD-103', client: 'Apex Chemicals', chemical: 'Hydrochloric Acid', qty: '800 L', status: 'Processing', total: '$36,000' },
  ]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-blue-500 mb-8">BM CHEMICALS</h2>
          <nav className="space-y-4">
            <a href="/dashboard" className="block px-4 py-2 text-slate-400 hover:bg-slate-700 rounded-lg">📊 Dashboard</a>
            <a href="/dashboard/orders" className="block px-4 py-2 bg-blue-600 rounded-lg font-medium">📦 Orders</a>
            <a href="/dashboard/clients" className="block px-4 py-2 text-slate-400 hover:bg-slate-700 rounded-lg">👥 Clients</a>
          </nav>
        </div>

        <button
          onClick={() => router.push('/')}
          className="w-full py-2 bg-slate-700 hover:bg-red-600 rounded-lg text-sm font-medium transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Chemical</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-700/30 transition">
                  <td className="py-3.5 px-4 font-semibold text-blue-400">{ord.id}</td>
                  <td className="py-3.5 px-4 text-white">{ord.client}</td>
                  <td className="py-3.5 px-4">{ord.chemical}</td>
                  <td className="py-3.5 px-4">{ord.qty}</td>
                  <td className="py-3.5 px-4 font-medium">{ord.total}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      ord.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      ord.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}