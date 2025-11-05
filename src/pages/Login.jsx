import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // prevent page reload
    // Mock credentials
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true"); // keep logged in
      navigate("/"); // redirect to dashboard
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleLogin} // handle enter key
        className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-80 space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
          Admin Login
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-gray-100"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-gray-100"
        />

        <button
          type="submit" // ensures form submit triggers this button
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
