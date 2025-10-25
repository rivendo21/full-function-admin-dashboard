import React from "react";

const Navbar = ({ toggleDarkMode, isDarkMode, logout }) => {
  return (
    <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-[22px] shadow">
      <div className="flex items-center gap-7">
        <button
          onClick={toggleDarkMode}
          className="px-3 py-1 border rounded border-gray-800 dark:border-gray-400 "
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div>
        <button
          onClick={logout}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
