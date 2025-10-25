import React, { useState } from "react";

const Products = ({ products, setProducts, isDarkMode }) => {
  const [editingProductId, setEditingProductId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: 0,
    stock: 0,
  });

  const startEdit = (product) => {
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
    });
  };

  const saveEdit = () => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === editingProductId
          ? {
              ...p,
              name: form.name,
              category: form.category,
              price: form.price,
              stock: form.stock,
            }
          : p
      )
    );
    setEditingProductId(null);
  };

  const cancelEdit = () => {
    setEditingProductId(null);
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Products Management
      </h2>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow p-5">
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
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="p-3 text-gray-900 dark:text-gray-100">
                  {editingProductId === p.id ? (
                    <input
                      type="text"
                      value={form.name}
                      className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-100 w-full"
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  ) : (
                    p.name
                  )}
                </td>
                <td className="p-3 text-gray-900 dark:text-gray-100">
                  {editingProductId === p.id ? (
                    <input
                      type="text"
                      value={form.category}
                      className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-100 w-full"
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                    />
                  ) : (
                    p.category
                  )}
                </td>
                <td className="p-3 text-gray-900 dark:text-gray-100">
                  {editingProductId === p.id ? (
                    <input
                      type="number"
                      value={form.price}
                      className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-100 w-full"
                      onChange={(e) =>
                        setForm({ ...form, price: parseFloat(e.target.value) })
                      }
                    />
                  ) : (
                    `$${p.price.toFixed(2)}`
                  )}
                </td>
                <td className="p-3 text-gray-900 dark:text-gray-100">
                  {editingProductId === p.id ? (
                    <input
                      type="number"
                      value={form.stock}
                      className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-100 w-full"
                      onChange={(e) =>
                        setForm({ ...form, stock: parseInt(e.target.value) })
                      }
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
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
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
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="p-5 text-center text-gray-500 dark:text-gray-400"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
