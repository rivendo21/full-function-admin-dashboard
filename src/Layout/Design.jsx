import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Layout = ({ children, toggleDarkMode, isDarkMode, logout }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
          logout={logout}
        />
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
