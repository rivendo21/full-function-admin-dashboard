import React, { useState, useEffect } from "react";
import axios from "axios";

const Orders = ({ customers }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [newOrder, setNewOrder] = useState({
    productId: "",
    productName: "",
    customerId: customers[0]?.id || 1,
    quantity: 1,
  });

  //  Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://dummyjson.com/products?limit=100");
        setProducts(res.data.products);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products for live search dropdown
  useEffect(() => {
    if (productSearch.trim() === "") {
      setFilteredProducts([]);
    } else {
      const matches = products.filter((p) =>
        p.title.toLowerCase().includes(productSearch.toLowerCase())
      );
      setFilteredProducts(matches.slice(0, 10)); // show top 10 matches
    }
  }, [productSearch, products]);

  //  Add new order
  const handleAddOrder = () => {
    const product = products.find((p) => p.id === newOrder.productId);
    const customer = customers.find((c) => c.id === newOrder.customerId);
    if (!product || !customer || newOrder.quantity < 1) return;

    const total = +(product.price * newOrder.quantity).toFixed(2);
    const id = orders.length ? Math.max(...orders.map((o) => o.id)) + 1 : 1;
    const date = new Date().toISOString().split("T")[0];

    setOrders([
      ...orders,
      {
        id,
        productId: product.id,
        customerId: customer.id,
        quantity: newOrder.quantity,
        total,
        date,
      },
    ]);

    setNewOrder({ ...newOrder, quantity: 1, productId: "", productName: "" });
    setProductSearch("");
  };

  //  Search orders by customer or product
  const filteredOrders = orders.filter((order) => {
    const product = products.find((p) => p.id === order.productId);
    const customer = customers.find((c) => c.id === order.customerId);
    const term = search.toLowerCase();
    return (
      (product?.title?.toLowerCase().includes(term) ?? false) ||
      (customer?.name?.toLowerCase().includes(term) ?? false)
    );
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Orders Management
      </h2>

      {/* Search orders */}
      <input
        type="text"
        placeholder="Search orders by product or customer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-gray-100 w-full sm:w-1/2"
      />

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Add Order */}
      {!loading && (
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mt-3 relative">
          {/* Customer Select */}
          <select
            value={newOrder.customerId}
            onChange={(e) =>
              setNewOrder({ ...newOrder, customerId: parseInt(e.target.value) })
            }
            className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-gray-100"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Product Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search product..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-gray-100 w-full"
            />
            {filteredProducts.length > 0 && (
              <ul className="absolute bg-white dark:bg-gray-700 border rounded mt-1 w-full max-h-60 overflow-y-auto z-10">
                {filteredProducts.map((p) => (
                  <li
                    key={p.id}
                    onClick={() => {
                      setNewOrder({
                        ...newOrder,
                        productId: p.id,
                        productName: p.title,
                      });
                      setProductSearch(p.title);
                      setFilteredProducts([]);
                    }}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {p.title} (${p.price})
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quantity */}
          <input
            type="number"
            min="1"
            value={newOrder.quantity}
            onChange={(e) =>
              setNewOrder({ ...newOrder, quantity: parseInt(e.target.value) })
            }
            className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-gray-100 w-24"
          />

          {/* Add Button */}
          <button
            onClick={handleAddOrder}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Order
          </button>
        </div>
      )}

      {/* Orders Table */}
      {!loading && (
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-700 text-left">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Product</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Total</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const product =
                  products.find((p) => p.id === order.productId) || {};
                const customer =
                  customers.find((c) => c.id === order.customerId) || {};
                return (
                  <tr
                    key={order.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="p-3">{customer.name}</td>
                    <td className="p-3">{product.title}</td>
                    <td className="p-3">{order.quantity}</td>
                    <td className="p-3">${order.total.toFixed(2)}</td>
                    <td className="p-3">{order.date}</td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-5 text-center text-gray-500 dark:text-gray-400"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
