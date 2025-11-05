// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout/Design";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import axios from "axios";

const App = () => {
  // 🌗 Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  // 🔐 Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  // 🛒 Products (now fetched from API)
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await axios.get("https://dummyjson.com/products");
        setProducts(res.data.products);
      } catch (err) {
        console.error("Error fetching products:", err);
        setErrorProducts("Failed to load products. Please refresh.");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // 👥 Customers (local)
  const initialCustomers = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com" },
    { id: 2, name: "Bob Smith", email: "bob@example.com" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com" },
    { id: 4, name: "Diana Prince", email: "diana@example.com" },
  ];
  const [customers, setCustomers] = useState(() => {
    const stored = localStorage.getItem("customers");
    return stored ? JSON.parse(stored) : initialCustomers;
  });
  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
  }, [customers]);

  // 📦 Orders (local, editable)
  const initialOrders = [
    {
      id: 1,
      productId: 1,
      customerId: 1,
      quantity: 2,
      total: 199.98,
      date: "2025-10-20",
    },
    {
      id: 2,
      productId: 3,
      customerId: 2,
      quantity: 1,
      total: 89.99,
      date: "2025-10-21",
    },
  ];
  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem("orders");
    return stored ? JSON.parse(stored) : initialOrders;
  });
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // 🧠 Render
  return (
    <BrowserRouter>
      <div
        className={
          isDarkMode
            ? "dark bg-gray-900 text-gray-100 min-h-screen"
            : "bg-gray-100 text-gray-900 min-h-screen"
        }
      >
        <Routes>
          {/* 🔐 Login */}
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />

          {/* 🧭 Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout
                  toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                  isDarkMode={isDarkMode}
                  logout={logout}
                >
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <Dashboard
                          products={products}
                          orders={orders}
                          isDarkMode={isDarkMode}
                        />
                      }
                    />

                    {/* 🛍 Products */}
                    <Route
                      path="/products"
                      element={
                        loadingProducts ? (
                          <div className="p-10 text-center">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="mt-3">Loading products...</p>
                          </div>
                        ) : errorProducts ? (
                          <p className="text-center text-red-500 p-10">
                            {errorProducts}
                          </p>
                        ) : (
                          <Products
                            products={products}
                            setProducts={setProducts}
                            isDarkMode={isDarkMode}
                          />
                        )
                      }
                    />

                    {/* 📦 Orders */}
                    <Route
                      path="/orders"
                      element={
                        <Orders
                          orders={orders}
                          setOrders={setOrders}
                          customers={customers}
                        />
                      }
                    />

                    {/* 👥 Customers */}
                    <Route
                      path="/customers"
                      element={
                        <Customers
                          customers={customers}
                          setCustomers={setCustomers}
                        />
                      }
                    />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
