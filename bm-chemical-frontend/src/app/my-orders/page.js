// src/app/my-orders/page.js
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://bm-chemical-backend.vercel.app";

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Error fetching my orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = (order) => {
    const printWindow = window.open("", "_blank");
    const receiptHTML = `
      <html>
        <head>
          <title>Invoice - Order #${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #0056b3; padding-bottom: 10px; }
            .company { font-size: 24px; font-weight: bold; color: #0056b3; }
            .details { margin: 30px 0; font-size: 14px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th, .table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            .table th { background-color: #f2f2f2; }
            .total { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company">BM CHEMICALS</div>
            <p>Official Order Invoice / Receipt</p>
          </div>

          <div class="details">
            <p><strong>Order ID:</strong> #${order.id}</p>
            <p><strong>Status:</strong> ${order.status?.toUpperCase() || "PENDING"}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Chemical Order</td>
                <td>${order.product_id}</td>
                <td>${order.quantity}</td>
                <td>PKR ${order.total_price}</td>
              </tr>
            </tbody>
          </table>

          <div class="total">
            Total Amount Paid: PKR ${order.total_price}
          </div>

          <div class="footer">
            <p>Thank you for doing business with BM Chemicals!</p>
            <p>This is a computer-generated document and does not require a signature.</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-blue-50 text-[#0056b3] border border-blue-200";
      case "shipped":
        return "bg-violet-50 text-violet-700 border border-violet-200";
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-[1000px] mx-auto w-full px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0d1c2f] tracking-tight">My Orders</h1>
            <p className="text-sm text-[#334155] mt-1">
              Track your chemical purchases and download invoices.
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg text-[#334155] transition-colors"
          >
            ← Back to Store
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-24 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl brand-shadow p-12 text-center">
            <p className="text-[#334155] mb-4 text-sm">You haven&apos;t placed any orders yet.</p>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 bg-[#0056b3] hover:bg-[#003f87] text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-slate-200 rounded-2xl brand-shadow p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-[#0056b3] font-bold text-sm">
                      Order #{order.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${getStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </div>
                  <p className="text-sm text-[#334155]">
                    Product ID: <span className="font-semibold text-[#0d1c2f]">{order.product_id}</span> · Quantity:{" "}
                    <span className="font-semibold text-[#0d1c2f]">{order.quantity}</span>
                  </p>
                </div>

                <div className="flex items-center gap-4 text-left md:text-right">
                  <div>
                    <span className="text-xs text-slate-400 block">Total Price</span>
                    <span className="text-lg font-bold text-[#0d1c2f]">
                      Rs. {order.total_price}
                    </span>
                  </div>

                  <button
                    onClick={() => downloadReceipt(order)}
                    className="px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-[#334155] transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H8a2 2 0 01-2-2V5a2 2 0 012-2h6l6 6v11a2 2 0 01-2 2z" />
                    </svg>
                    Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}