"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
  });

  const API_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products/`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
  console.error("Products fetch error:", err);
} finally {
  setLoading(false);
}
  };

  const fetchOrders = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
      let res = await fetch(`${API_URL}/orders/all`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) {
        res = await fetch(`${API_URL}/orders/`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
      }

      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Orders fetch error:", err);
    }
  };

  // Update Order Status Handler
  const handleStatusChange = async (orderId, newStatus) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Optimistically update UI
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        alert("Failed to update order status.");
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("stock", newProduct.stock);
    if (newProduct.image) {
      formData.append("image", newProduct.image);
    }

    try {
      const res = await fetch(`${API_URL}/products/`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert("Chemical added successfully!");
        setIsModalOpen(false);
        setNewProduct({ name: "", description: "", price: "", stock: "", image: null });
        fetchProducts();
      } else {
        alert("Failed to add chemical.");
      }
    } catch (err) {
      console.error("Add product error:", err);
    }
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
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <Link href="/">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-8 cursor-pointer">
              BM CHEMICALS
            </h2>
          </Link>

          <nav className="space-y-2">
            <button
              onClick={() => { setActiveTab("dashboard"); fetchOrders(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                activeTab === "dashboard"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              📊 Dashboard Overview
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                activeTab === "products"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              🧪 Products
            </button>

            <button
              onClick={() => { setActiveTab("orders"); fetchOrders(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                activeTab === "orders"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              📦 Orders
            </button>

            <button
              onClick={() => setActiveTab("clients")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                activeTab === "clients"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              👥 Clients
            </button>
          </nav>
        </div>

        <Link
          href="/"
          className="w-full text-center py-2.5 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition"
        >
          Exit Dashboard
        </Link>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold capitalize">
            {activeTab === "dashboard" && "Dashboard Overview"}
            {activeTab === "products" && "Product Catalog Management"}
            {activeTab === "orders" && "Customer Orders"}
            {activeTab === "clients" && "Client Directory"}
          </h1>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition"
          >
            + Add New Chemical
          </button>
        </div>

        {/* OVERVIEW & PRODUCTS TAB */}
        {(activeTab === "dashboard" || activeTab === "products") && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-slate-400 text-sm font-medium">Total Chemical Products</span>
                <p className="text-3xl font-extrabold text-blue-400 mt-2">{products.length}</p>
              </div>
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-slate-400 text-sm font-medium">Total Placed Orders</span>
                <p className="text-3xl font-extrabold text-amber-400 mt-2">{orders.length}</p>
              </div>
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-slate-400 text-sm font-medium">Low Stock Items</span>
                <p className="text-3xl font-extrabold text-rose-400 mt-2">
                  {products.filter((p) => p.stock < 10).length}
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6">Chemical Inventory</h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="pb-3">Chemical Name</th>
                    <th className="pb-3">Stock</th>
                    <th className="pb-3">Price (PKR)</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-sm">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-4 font-semibold">{p.name}</td>
                      <td className="py-4">{p.stock}</td>
                      <td className="py-4">Rs. {p.price}</td>
                      <td className="py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            p.stock > 0
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-rose-500/10 text-rose-400"
                          }`}
                        >
                          {p.stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="px-3 py-1 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded text-xs transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS TAB WITH STATUS UPDATE */}
        {activeTab === "orders" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Live Customer Orders</h3>
              <button
                onClick={fetchOrders}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg text-slate-300"
              >
                🔄 Refresh Orders
              </button>
            </div>

            {orders.length === 0 ? (
              <p className="text-slate-400 py-6 text-center">No orders placed yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Product ID</th>
                      <th className="pb-3">Qty</th>
                      <th className="pb-3">Total Price</th>
                      <th className="pb-3">Phone</th>
                      <th className="pb-3">Address</th>
                      <th className="pb-3">Current Status</th>
                      <th className="pb-3 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-sm">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-4 font-mono text-blue-400">#{o.id}</td>
                        <td className="py-4">{o.product_id}</td>
                        <td className="py-4 font-semibold">{o.quantity}</td>
                        <td className="py-4 text-emerald-400 font-bold">Rs. {o.total_price}</td>
                        <td className="py-4 text-slate-300">{o.phone || o.contact || "N/A"}</td>
                        <td className="py-4 text-slate-300 max-w-xs truncate">{o.address || "N/A"}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(o.status)}`}>
                            {o.status || "Pending"}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <select
                            value={o.status || "Pending"}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* CLIENTS TAB */}
        {activeTab === "clients" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center py-12">
            <h3 className="text-xl font-bold mb-2">Registered Clients Directory</h3>
            <p className="text-slate-400 text-sm">
              All registered buyers & businesses will appear here.
            </p>
          </div>
        )}
      </main>

      {/* Add Chemical Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Chemical Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Chemical Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Description</label>
                <textarea
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Price (PKR)</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}