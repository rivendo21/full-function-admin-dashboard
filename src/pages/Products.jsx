import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API_BASE = "https://dummyjson.com";

const Spinner = ({ size = 6 }) => (
  <svg
    className={`animate-spin h-${size} w-${size} inline-block`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

const Products = ({ isDarkMode }) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);
  const debounceRef = useRef(null);

  const axiosInstance = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
  });

  const formatProduct = (p) => ({
    id: p.id,
    name: p.title ?? p.name ?? "Untitled",
    category: p.category ?? "general",
    price: p.price ?? 0,
    stock: p.stock ?? Math.floor(Math.random() * 50),
    status:
      (p.stock ?? 1) === 0
        ? "Out of Stock"
        : (p.stock ?? 1) < 5
        ? "Low Stock"
        : "Active",
  });

  const fetchProducts = async ({ q = "", pageNumber = 1 } = {}) => {
    setLoading(true);
    try {
      const skip = (pageNumber - 1) * pageSize;
      let url =
        q && q.trim().length > 0
          ? `/products/search?q=${encodeURIComponent(
              q
            )}&limit=${pageSize}&skip=${skip}`
          : `/products?limit=${pageSize}&skip=${skip}`;
      const res = await axiosInstance.get(url);
      const data = res.data;
      const items = (data.products || []).map(formatProduct);
      setProducts(items);
      setTotal(data.total ?? items.length);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to fetch products. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts({ q: query, pageNumber: page });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    setPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchProducts({ q: query, pageNumber: 1 });
    }, 400);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.category) {
      alert("Please provide name and category.");
      return;
    }
    try {
      setActionLoading(true);
      const body = {
        title: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price) || 0,
        stock: Number(newProduct.stock) || 0,
      };
      const res = await axiosInstance.post("/products/add", body);
      const item = formatProduct(res.data);
      if (page === 1) {
        setProducts((prev) => [item, ...prev].slice(0, pageSize));
      } else {
        fetchProducts({ q: query, pageNumber: page });
      }
      setTotal((t) => t + 1);
      setNewProduct({ name: "", category: "", price: "", stock: "" });
    } catch (err) {
      console.error("Add error:", err);
      alert("Failed to add product.");
    } finally {
      setActionLoading(false);
    }
  };

  const startEdit = (product) => {
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
    });
  };

  const saveEdit = async () => {
    if (!editingProductId) return;
    try {
      setActionLoading(true);
      const body = {
        title: form.name,
        category: form.category,
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
      };
      const res = await axiosInstance.put(
        `/products/${editingProductId}`,
        body
      );
      const item = formatProduct(res.data);
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProductId ? item : p))
      );
      setEditingProductId(null);
    } catch (err) {
      console.error("Save edit error:", err);
      alert("Failed to save edits.");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      setActionLoading(true);
      await axiosInstance.delete(`/products/${id}`);
      const willBeEmpty = products.length === 1 && page > 1;
      if (willBeEmpty) {
        setPage((p) => Math.max(1, p - 1));
      } else {
        fetchProducts({ q: query, pageNumber: page });
      }
      setTotal((t) => Math.max(0, t - 1));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product.");
    } finally {
      setActionLoading(false);
    }
  };

  const cancelEdit = () => setEditingProductId(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "Low Stock":
        return "bg-yellow-400";
      case "Out of Stock":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Products Management (Live API)
        </h2>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-100"
        />
      </div>

      {/* Add product */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Add New Product
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
          <input
            type="text"
            placeholder="Enter product name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="border px-3 py-2 rounded dark:bg-gray-700 dark:text-gray-100"
          />
          <input
            type="text"
            placeholder="Enter category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="border px-3 py-2 rounded dark:bg-gray-700 dark:text-gray-100"
          />
          <input
            type="number"
            placeholder="Enter price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            className="border px-3 py-2 rounded dark:bg-gray-700 dark:text-gray-100"
          />
          <input
            type="number"
            placeholder="Enter stock quantity"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: e.target.value })
            }
            className="border px-3 py-2 rounded dark:bg-gray-700 dark:text-gray-100"
          />
          <div className="flex gap-2">
            <button
              onClick={addProduct}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              {actionLoading ? <Spinner size={5} /> : null}
              Add Product
            </button>
            <button
              onClick={() =>
                setNewProduct({ name: "", category: "", price: "", stock: "" })
              }
              className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow p-5">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size={10} />
            <span className="ml-3 text-gray-600 dark:text-gray-300">
              Loading products...
            </span>
          </div>
        ) : (
          <>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                  <th className="p-3">Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-5 text-center text-gray-500 dark:text-gray-400"
                    >
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <td className="p-3 text-gray-900 dark:text-gray-100">
                        {editingProductId === p.id ? (
                          <input
                            type="text"
                            placeholder="Enter name"
                            value={form.name}
                            onChange={(e) =>
                              setForm({ ...form, name: e.target.value })
                            }
                            className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-100 w-full"
                          />
                        ) : (
                          p.name
                        )}
                      </td>
                      <td className="p-3 text-gray-900 dark:text-gray-100">
                        {editingProductId === p.id ? (
                          <input
                            type="text"
                            placeholder="Enter category"
                            value={form.category}
                            onChange={(e) =>
                              setForm({ ...form, category: e.target.value })
                            }
                            className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-100 w-full"
                          />
                        ) : (
                          p.category
                        )}
                      </td>
                      <td className="p-3 text-gray-900 dark:text-gray-100">
                        {editingProductId === p.id ? (
                          <input
                            type="number"
                            placeholder="Enter price"
                            value={form.price}
                            onChange={(e) =>
                              setForm({ ...form, price: e.target.value })
                            }
                            className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-100 w-full"
                          />
                        ) : (
                          `$${p.price}`
                        )}
                      </td>
                      <td className="p-3 text-gray-900 dark:text-gray-100">
                        {editingProductId === p.id ? (
                          <input
                            type="number"
                            placeholder="Enter stock quantity"
                            value={form.stock}
                            onChange={(e) =>
                              setForm({ ...form, stock: e.target.value })
                            }
                            className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-100 w-full"
                          />
                        ) : (
                          p.stock
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-white px-2 py-1 rounded ${getStatusColor(
                            p.status
                          )}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {editingProductId === p.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={saveEdit}
                              disabled={actionLoading}
                              className="px-3 py-1 bg-green-500 text-white rounded flex items-center gap-2"
                            >
                              {actionLoading ? <Spinner size={4} /> : null}
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 bg-gray-500 text-white rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(p)}
                              className="px-3 py-1 bg-blue-500 text-white rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="px-3 py-1 bg-red-500 text-white rounded"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Showing page {page} of {totalPages || 1} — {total} items total
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1 || loading}
                  className="px-3 py-1 rounded border disabled:opacity-50"
                >
                  First
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className="px-3 py-1 rounded border disabled:opacity-50"
                >
                  Prev
                </button>

                <div className="px-3 py-1 border rounded">
                  <input
                    type="number"
                    min={1}
                    max={totalPages || 1}
                    value={page}
                    onChange={(e) => {
                      const v = Number(e.target.value) || 1;
                      setPage(Math.min(Math.max(1, v), totalPages || 1));
                    }}
                    className="w-12 bg-transparent text-center outline-none"
                  />
                </div>

                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages || 1, p + 1))
                  }
                  disabled={page === totalPages || loading}
                  className="px-3 py-1 rounded border disabled:opacity-50"
                >
                  Next
                </button>

                <button
                  onClick={() => setPage(totalPages || 1)}
                  disabled={page === totalPages || loading}
                  className="px-3 py-1 rounded border disabled:opacity-50"
                >
                  Last
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
