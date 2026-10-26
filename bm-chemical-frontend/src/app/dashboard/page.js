// src/app/dashboard/page.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
  });

  const API_URL = "https://bm-chemical-backend.vercel.app";

  useEffect(() => {
    // Login guard: bina token ke dashboard nahi khulna chahiye
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
    setIsAdmin(role === "admin");
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
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product. Admin access required.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
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
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });
      if (res.ok) {
        alert("Chemical added successfully!");
        setIsModalOpen(false);
        setNewProduct({ name: "", description: "", price: "", stock: "", image: null });
        fetchProducts();
      } else {
        alert("Failed to add chemical. Admin access required.");
      }
    } catch (err) {
      console.error("Add product error:", err);
    }
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
    <div className="flex min-h-screen bg-[#f8f9ff] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-10">
            <svg className="w-7 h-7 text-[#0056b3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 2v6l-5 9a2 2 0 002 3h12a2 2 0 002-3l-5-9V2M9 2h6" />
            </svg>
            <span className="text-lg font-bold text-[#0d1c2f]">BM Chemicals</span>
          </Link>

          <nav className="space-y-1.5">
            <button
              onClick={() => { setActiveTab("dashboard"); fetchOrders(); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                activeTab === "dashboard"
                  ? "bg-[#0056b3] text-white"
                  : "text-[#334155] hover:bg-slate-50"
              }`}
            >
              Dashboard Overview
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                activeTab === "products"
                  ? "bg-[#0056b3] text-white"
                  : "text-[#334155] hover:bg-slate-50"
              }`}
            >
              Products
            </button>

            {isAdmin && (
              <button
                onClick={() => { setActiveTab("orders"); fetchOrders(); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === "orders"
                    ? "bg-[#0056b3] text-white"
                    : "text-[#334155] hover:bg-slate-50"
                }`}
              >
                Orders
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => setActiveTab("clients")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === "clients"
                    ? "bg-[#0056b3] text-white"
                    : "text-[#334155] hover:bg-slate-50"
                }`}
              >
                Clients
              </button>
            )}
          </nav>
        </div>

        <Link
          href="/"
          className="w-full text-center py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[#334155] text-sm font-medium hover:bg-slate-100 transition-colors"
        >
          Exit Dashboard
        </Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#0d1c2f]">
            {activeTab === "dashboard" && "Dashboard Overview"}
            {activeTab === "products" && "Product Catalog Management"}
            {activeTab === "orders" && "Customer Orders"}
            {activeTab === "clients" && "Client Directory"}
          </h1>

          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-[#0056b3] hover:bg-[#003f87] text-white rounded-lg text-sm font-semibold transition-colors"
            >
              + Add New Chemical
            </button>
          )}
        </div>

        {(activeTab === "dashboard" || activeTab === "products") && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-white border border-slate-200 rounded-2xl brand-shadow">
                <span className="text-[#334155] text-sm font-medium">Total Chemical Products</span>
                <p className="text-3xl font-bold text-[#0056b3] mt-2">{products.length}</p>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-2xl brand-shadow">
                <span className="text-[#334155] text-sm font-medium">Total Placed Orders</span>
                <p className="text-3xl font-bold text-[#0056b3] mt-2">{orders.length}</p>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-2xl brand-shadow">
                <span className="text-[#334155] text-sm font-medium">Low Stock Items</span>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {products.filter((p) => p.stock < 10).length}
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl brand-shadow p-6">
              <h3 className="text-lg font-semibold text-[#0d1c2f] mb-6">Chemical Inventory</h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[#334155] text-xs uppercase tracking-wider">
                    <th className="pb-3">Chemical Name</th>
                    <th className="pb-3">Stock</th>
                    <th className="pb-3">Price (PKR)</th>
                    <th className="pb-3">Status</th>
                    {isAdmin && <th className="pb-3 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="py-4 font-semibold text-[#0d1c2f]">{p.name}</td>
                      <td className="py-4 text-[#334155]">{p.stock}</td>
                      <td className="py-4 text-[#334155]">Rs. {p.price}</td>
                      <td className="py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            p.stock > 0
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {p.stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "orders" && isAdmin && (
          <div className="bg-white border border-slate-200 rounded-2xl brand-shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-[#0d1c2f]">Live Customer Orders</h3>
              <button
                onClick={fetchOrders}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold rounded-lg text-[#334155] transition-colors"
              >
                Refresh Orders
              </button>
            </div>

            {orders.length === 0 ? (
              <p className="text-[#334155] py-6 text-center text-sm">No orders placed yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-[#334155] text-xs uppercase">
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
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td className="py-4 font-mono text-[#0056b3] font-semibold">#{o.id}</td>
                        <td className="py-4 text-[#334155]">{o.product_id}</td>
                        <td className="py-4 font-semibold text-[#0d1c2f]">{o.quantity}</td>
                        <td className="py-4 text-emerald-700 font-bold">Rs. {o.total_price}</td>
                        <td className="py-4 text-[#334155]">{o.phone || o.contact || "N/A"}</td>
                        <td className="py-4 text-[#334155] max-w-xs truncate">{o.address || "N/A"}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(o.status)}`}>
                            {o.status || "Pending"}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <select
                            value={o.status || "Pending"}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            className="bg-white border border-slate-200 text-[#0d1c2f] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#0056b3] cursor-pointer"
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

        {activeTab === "clients" && isAdmin && (
          <div className="bg-white border border-slate-200 rounded-2xl brand-shadow p-6 text-center py-12">
            <h3 className="text-lg font-semibold text-[#0d1c2f] mb-2">Registered Clients Directory</h3>
            <p className="text-[#334155] text-sm">
              All registered buyers &amp; businesses will appear here.
            </p>
          </div>
        )}
      </main>

      {/* Add Chemical Modal */}
      {isModalOpen && isAdmin && (
        <div className="fixed inset-0 bg-[#0d1c2f]/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#0d1c2f] mb-4">Add New Chemical Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#334155] block mb-1.5">Chemical Name</label>
                <input
                  type="text"
                  required
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#0056b3]"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#334155] block mb-1.5">Description</label>
                <textarea
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#0056b3]"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#334155] block mb-1.5">Price (PKR)</label>
                  <input
                    type="number"
                    required
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#0056b3]"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#334155] block mb-1.5">Stock</label>
                  <input
                    type="number"
                    required
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#0056b3]"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#334155] block mb-1.5">Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                  className="w-full text-xs text-[#334155] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#0056b3] file:text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 text-[#334155] rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0056b3] hover:bg-[#003f87] text-white rounded-lg text-sm font-semibold transition-colors"
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