import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = ({ products = [], orders = [], isDarkMode }) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0).toFixed(2);
  const totalOrders = orders.length;
  const totalCustomers = [...new Set(orders.map((o) => o.customerId))].length;
  const growth = totalOrders
    ? ((totalOrders / (totalOrders || 1)) * 100).toFixed(0)
    : 0;

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStock, setSelectedStock] = useState("All");

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const stockOptions = ["All", "Active", "Low Stock", "Out of Stock"];

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const categoryMatch =
      selectedCategory === "All" || p.category === selectedCategory;
    const stockMatch = selectedStock === "All" || p.status === selectedStock;
    return categoryMatch && stockMatch;
  });

  // Charts Data
  // Stock Status
  const stockData = [
    {
      status: "Active",
      count: products.filter((p) => p.status === "Active").length,
    },
    {
      status: "Low Stock",
      count: products.filter((p) => p.status === "Low Stock").length,
    },
    {
      status: "Out of Stock",
      count: products.filter((p) => p.status === "Out of Stock").length,
    },
  ];

  // Revenue per Product
  const revenueData = filteredProducts.map((p) => {
    const total = orders
      .filter((o) => o.productId === p.id)
      .reduce((sum, o) => sum + o.total, 0);
    return { name: p.name, revenue: total };
  });

  // Orders over time
  const ordersOverTime = useMemo(() => {
    const counts = {};
    orders.forEach((o) => {
      const date = o.date || "Unknown";
      counts[date] = (counts[date] || 0) + o.total;
    });
    return Object.entries(counts).map(([date, total]) => ({ date, total }));
  }, [orders]);

  // Category Distribution Pie Chart
  const categoryData = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [products]);

  const COLORS = ["#4ade80", "#facc15", "#f87171", "#60a5fa", "#a78bfa"];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Total Revenue
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ${totalRevenue}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Orders
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalOrders}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Customers
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalCustomers}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Growth
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {growth}%
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-100"
        >
          {categories.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={selectedStock}
          onChange={(e) => setSelectedStock(e.target.value)}
          className="border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-100"
        >
          {stockOptions.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Products
        </h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr
                key={p.id}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="p-3 text-gray-900 dark:text-gray-100">
                  {p.name}
                </td>
                <td className="p-3 text-gray-900 dark:text-gray-100">
                  {p.category}
                </td>
                <td className="p-3 text-gray-900 dark:text-gray-100">
                  ${p.price.toFixed(2)}
                </td>
                <td className="p-3 text-gray-900 dark:text-gray-100">
                  {p.stock}
                </td>
                <td className="p-3 text-gray-900 dark:text-gray-100">
                  {p.status}
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="p-5 text-center text-gray-500 dark:text-gray-400"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Stock Status
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stockData}>
              <XAxis dataKey="status" stroke={isDarkMode ? "#fff" : "#000"} />
              <YAxis stroke={isDarkMode ? "#fff" : "#000"} />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1f2937" : "#fff",
                  border: "none",
                }}
                itemStyle={{ color: isDarkMode ? "#fff" : "#000" }}
                labelStyle={{ color: isDarkMode ? "#fff" : "#000" }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ color: isDarkMode ? "#fff" : "#000" }}>
                    {value}
                  </span>
                )}
              />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue*/}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Revenue per Product
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <XAxis dataKey="name" stroke={isDarkMode ? "#fff" : "#000"} />
              <YAxis stroke={isDarkMode ? "#fff" : "#000"} />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1f2937" : "#fff",
                  border: "none",
                }}
                itemStyle={{ color: isDarkMode ? "#fff" : "#000" }}
                labelStyle={{ color: isDarkMode ? "#fff" : "#000" }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ color: isDarkMode ? "#fff" : "#000" }}>
                    {value}
                  </span>
                )}
              />
              <Bar dataKey="revenue" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders / time*/}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Orders Over Time
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={ordersOverTime}>
              <XAxis dataKey="date" stroke={isDarkMode ? "#fff" : "#000"} />
              <YAxis stroke={isDarkMode ? "#fff" : "#000"} />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1f2937" : "#fff",
                  border: "none",
                }}
                itemStyle={{ color: isDarkMode ? "#fff" : "#000" }}
                labelStyle={{ color: isDarkMode ? "#fff" : "#000" }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ color: isDarkMode ? "#fff" : "#000" }}>
                    {value}
                  </span>
                )}
              />
              <Line type="monotone" dataKey="total" stroke="#facc15" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category*/}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Category Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span style={{ color: isDarkMode ? "#fff" : "#000" }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
