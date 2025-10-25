// src/pages/Orders.jsx
import React, { useState } from "react";

const Orders = ({ orders, setOrders, products, customers }) => {
  const [search, setSearch] = useState("");
  const [newOrder, setNewOrder] = useState({
    productId: products[0]?.id || 1,
    customerId: customers[0]?.id || 1,
    quantity: 1,
  });

  // Filter orders for search
  const filtered = orders.filter((o) => {
    const product = products.find((p) => p.id === o.productId);
    const customer = customers.find((c) => c.id === o.customerId);

    if (!product || !customer) return false; // remove unknown

    const productName = product.name.toLowerCase();
    const customerName = customer.name.toLowerCase();
    const searchLower = search.toLowerCase();

    return (
      productName.includes(searchLower) || customerName.includes(searchLower)
    );
  });

  // Add new order
  const handleAddOrder = () => {
    const product = products.find(
      (p) => Number(p.id) === Number(newOrder.productId)
    );
    const customer = customers.find(
      (c) => Number(c.id) === Number(newOrder.customerId)
    );
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

    // Reset new order quantity
    setNewOrder({ ...newOrder, quantity: 1 });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Orders Management
      </h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search orders by product or customer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-gray-100 w-full sm:w-1/2"
      />

      {/* Add Order */}
      <div className="flex flex-col sm:flex-row gap-3 items-center mt-3">
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

        <select
          value={newOrder.productId}
          onChange={(e) =>
            setNewOrder({ ...newOrder, productId: parseInt(e.target.value) })
          }
          className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-gray-100"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={newOrder.quantity}
          onChange={(e) =>
            setNewOrder({ ...newOrder, quantity: parseInt(e.target.value) })
          }
          className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-gray-100 w-24"
        />

        <button
          onClick={handleAddOrder}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Order
        </button>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-700 text-left sticky top-0 z-10">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Product</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Total</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => {
              const productName =
                products.find((p) => Number(p.id) === Number(order.productId))
                  ?.name || "Unknown Product";
              const customerName =
                customers.find((c) => Number(c.id) === Number(order.customerId))
                  ?.name || "Unknown Customer";
              return (
                <tr
                  key={order.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="p-3 text-gray-900 dark:text-gray-100">
                    {customerName}
                  </td>
                  <td className="p-3 text-gray-900 dark:text-gray-100">
                    {productName}
                  </td>
                  <td className="p-3 text-gray-900 dark:text-gray-100">
                    {order.quantity}
                  </td>
                  <td className="p-3 text-gray-900 dark:text-gray-100">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="p-3 text-gray-900 dark:text-gray-100">
                    {order.date}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
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
    </div>
  );
};

export default Orders;
