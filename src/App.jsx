import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout/Design";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated"); // optional: persist login state
  };

  // Products
  const initialProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      category: "Electronics",
      price: 99.99,
      stock: 120,
      status: "Active",
    },
    {
      id: 2,
      name: "Smartwatch Pro",
      category: "Wearables",
      price: 149.99,
      stock: 80,
      status: "Active",
    },
    {
      id: 3,
      name: "Gaming Keyboard",
      category: "Accessories",
      price: 89.99,
      stock: 40,
      status: "Low Stock",
    },
    {
      id: 4,
      name: "USB-C Charger",
      category: "Accessories",
      price: 19.99,
      stock: 300,
      status: "Active",
    },
    {
      id: 5,
      name: "Bluetooth Speaker",
      category: "Audio",
      price: 59.99,
      stock: 0,
      status: "Out of Stock",
    },
    {
      id: 6,
      name: "Laptop Stand",
      category: "Accessories",
      price: 39.99,
      stock: 50,
      status: "Active",
    },
    {
      id: 7,
      name: "4K Monitor",
      category: "Electronics",
      price: 299.99,
      stock: 25,
      status: "Low Stock",
    },
    {
      id: 8,
      name: "Gaming Mouse",
      category: "Accessories",
      price: 49.99,
      stock: 100,
      status: "Active",
    },
    {
      id: 9,
      name: "Smartphone Case",
      category: "Accessories",
      price: 14.99,
      stock: 200,
      status: "Active",
    },
    {
      id: 10,
      name: "Noise Cancelling Earbuds",
      category: "Audio",
      price: 129.99,
      stock: 0,
      status: "Out of Stock",
    },
    {
      id: 11,
      name: "Action Camera",
      category: "Electronics",
      price: 199.99,
      stock: 30,
      status: "Low Stock",
    },
    {
      id: 12,
      name: "Portable SSD 1TB",
      category: "Electronics",
      price: 119.99,
      stock: 70,
      status: "Active",
    },
  ];
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem("products");
    return stored ? JSON.parse(stored) : initialProducts;
  });
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  //  Customers
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

  //  Orders
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
    {
      id: 3,
      productId: 5,
      customerId: 3,
      quantity: 3,
      total: 179.97,
      date: "2025-10-22",
    },
    {
      id: 4,
      productId: 7,
      customerId: 4,
      quantity: 1,
      total: 299.99,
      date: "2025-10-23",
    },
    {
      id: 5,
      productId: 12,
      customerId: 1,
      quantity: 2,
      total: 239.98,
      date: "2025-10-23",
    },
  ];
  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem("orders");
    return stored ? JSON.parse(stored) : initialOrders;
  });
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  //  Dark Mode Persist
  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  //  Authentication Persist
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

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
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout
                  toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                  isDarkMode={isDarkMode}
                  logout={logout}
                  setIsAuthenticated={setIsAuthenticated}
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
                    <Route
                      path="/products"
                      element={
                        <Products
                          products={products}
                          setProducts={setProducts}
                        />
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <Orders
                          orders={orders}
                          setOrders={setOrders}
                          products={products}
                          customers={customers}
                        />
                      }
                    />
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
