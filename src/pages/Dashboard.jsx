import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
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

//  Custom Tooltip Component
const CustomTooltip = ({ active, payload, label, isDarkMode }) => {
  if (!active || !payload || payload.length === 0) return null;

  const textColor = isDarkMode ? "#fff" : "#000";
  const bgColor = isDarkMode ? "rgba(31,41,55,0.95)" : "#fff";

  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: "8px",
        padding: "8px 12px",
        boxShadow: isDarkMode
          ? "0 0 8px rgba(255,255,255,0.1)"
          : "0 0 8px rgba(0,0,0,0.1)",
      }}
    >
      {label && (
        <p style={{ fontWeight: "bold", marginBottom: "4px" }}>{label}</p>
      )}
      {payload.map((entry, i) => (
        <p key={i} style={{ margin: 0 }}>
          {entry.name}:{" "}
          <span style={{ fontWeight: "600" }}>
            {entry.value.toLocaleString()}
          </span>
        </p>
      ))}
    </div>
  );
};

const Dashboard = ({ orders = [], isDarkMode }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBar, setActiveBar] = useState(null);
  const [activeLine, setActiveLine] = useState(false);

  //  Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://dummyjson.com/products?limit=100");
        const mapped = res.data.products.map((p) => ({
          id: p.id,
          name: p.title,
          category: p.category,
          price: p.price,
          stock: p.stock,
          status:
            p.stock === 0
              ? "Out of Stock"
              : p.stock < 20
              ? "Low Stock"
              : "Active",
        }));
        setProducts(mapped);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  //  Stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0).toFixed(2);
  const totalOrders = orders.length;
  const totalCustomers = [...new Set(orders.map((o) => o.customerId))].length;
  const growth = totalOrders
    ? ((totalOrders / (totalOrders || 1)) * 100).toFixed(0)
    : 0;

  //  Data for charts
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

  const revenueData = useMemo(() => {
    return products.slice(0, 8).map((p) => ({
      name: p.name,
      revenue: p.price * (Math.floor(Math.random() * 40) + 1),
    }));
  }, [products]);

  const ordersOverTime = useMemo(() => {
    const counts = {};
    orders.forEach((o) => {
      const date = o.date || "Unknown";
      counts[date] = (counts[date] || 0) + o.total;
    });
    return Object.entries(counts).map(([date, total]) => ({ date, total }));
  }, [orders]);

  const categoryData = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [products]);

  const COLORS = [
    "#4ade80",
    "#facc15",
    "#f87171",
    "#60a5fa",
    "#a78bfa",
    "#34d399",
    "#fbbf24",
  ];

  const hoverDarken = (color) => {
    const darkened = color.replace(/[\d.]+\)/, "0.7)");
    return darkened.includes("rgba") ? darkened : color;
  };

  return (
    <div
      className={`space-y-8 transform transition-all duration-700 ease-out ${
        loading ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"
      }`}
    >
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Total Revenue", value: `$${totalRevenue}` },
              { title: "Orders", value: totalOrders },
              { title: "Customers", value: totalCustomers },
              { title: "Growth", value: `${growth}%` },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 hover:scale-[1.02] transition-transform duration-300"
              >
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  {card.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stock Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 hover:scale-[1.01] transition-transform duration-300">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Stock Status
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stockData}>
                  <XAxis
                    dataKey="status"
                    stroke={isDarkMode ? "#fff" : "#000"}
                  />
                  <YAxis stroke={isDarkMode ? "#fff" : "#000"} />
                  {/*  Remove hover background */}
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    content={<CustomTooltip isDarkMode={isDarkMode} />}
                  />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#8884d8"
                    animationDuration={1200}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue per Product */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 hover:scale-[1.01] transition-transform duration-300">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Revenue per Product
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueData} barSize={30}>
                  <XAxis dataKey="name" hide />
                  <YAxis />
                  {/*  Remove hover background */}
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    content={<CustomTooltip isDarkMode={isDarkMode} />}
                  />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    onMouseEnter={(_, i) => setActiveBar(i)}
                    onMouseLeave={() => setActiveBar(null)}
                    animationDuration={1200}
                  >
                    {revenueData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={
                          activeBar === i ? hoverDarken("#60a5fa") : "#60a5fa"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Orders Over Time */}
            <div
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 hover:scale-[1.01] transition-transform duration-300"
              onMouseEnter={() => setActiveLine(true)}
              onMouseLeave={() => setActiveLine(false)}
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Orders Over Time
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={ordersOverTime}>
                  <XAxis dataKey="date" stroke={isDarkMode ? "#fff" : "#000"} />
                  <YAxis stroke={isDarkMode ? "#fff" : "#000"} />
                  <Tooltip
                    cursor={{ stroke: "transparent", fill: "transparent" }}
                    content={<CustomTooltip isDarkMode={isDarkMode} />}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke={activeLine ? "#d97706" : "#facc15"}
                    strokeWidth={3}
                    dot={false}
                    isAnimationActive
                    animationDuration={1200}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 hover:scale-[1.01] transition-transform duration-300">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
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
                    isAnimationActive
                    animationDuration={1200}
                  >
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(v) => (
                      <span style={{ color: isDarkMode ? "#fff" : "#000" }}>
                        {v}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
