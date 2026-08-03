"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://127.0.0.1:8000";

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
        return "bg-blue-500/10 text-blue-400 border border-blue-500/30";
      case "shipped":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/30";
      case "delivered":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
      case "cancelled":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/30";
      default:
        return "bg-amber-500/10 text-amber-400 border border-amber-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              My Orders
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Track your chemical purchases and download invoices.
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg text-slate-300 transition"
          >
            ← Back to Store
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-400 text-center py-12">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <p className="text-slate-400 mb-4">You haven't placed any orders yet.</p>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-blue-400 font-bold">
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
                  <p className="text-sm text-slate-300">
                    Product ID: <span className="font-semibold text-white">{order.product_id}</span> | Quantity:{" "}
                    <span className="font-semibold text-white">{order.quantity}</span>
                  </p>
                </div>

                <div className="flex items-center gap-4 text-left md:text-right">
                  <div>
                    <span className="text-xs text-slate-400 block">Total Price</span>
                    <span className="text-lg font-extrabold text-emerald-400">
                      Rs. {order.total_price}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => downloadReceipt(order)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 transition flex items-center gap-1.5"
                  >
                    📄 Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}