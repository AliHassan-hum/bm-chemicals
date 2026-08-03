'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientsPage() {
  const router = useRouter();

  const [clients] = useState([
    { id: 1, name: 'Alpha Pharma Ltd', contact: '+92 300 1234567', email: 'contact@alphapharma.com', orders: 15 },
    { id: 2, name: 'National Textile Corp', contact: '+92 321 9876543', email: 'info@nationaltextile.com', orders: 28 },
    { id: 3, name: 'Apex Chemicals Supply', contact: '+92 333 5554433', email: 'sales@apexchem.com', orders: 7 },
  ]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-blue-500 mb-8">BM CHEMICALS</h2>
          <nav className="space-y-4">
            <a href="/dashboard" className="block px-4 py-2 text-slate-400 hover:bg-slate-700 rounded-lg">📊 Dashboard</a>
            <a href="/dashboard/orders" className="block px-4 py-2 text-slate-400 hover:bg-slate-700 rounded-lg">📦 Orders</a>
            <a href="/dashboard/clients" className="block px-4 py-2 bg-blue-600 rounded-lg font-medium">👥 Clients</a>
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
        <h1 className="text-2xl font-bold mb-6">Clients Directory</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div key={client.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-white mb-2">{client.name}</h3>
              <div className="text-sm text-slate-400 space-y-2">
                <p>📞 {client.contact}</p>
                <p>✉️ {client.email}</p>
                <p className="pt-2 text-blue-400 font-medium">Total Orders: {client.orders}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}