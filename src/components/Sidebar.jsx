import { NavLink } from "react-router-dom";
const Sidebar = () => {
  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Orders", path: "/orders" },
    { name: "Customers", path: "/customers" },
  ];

  return (
    <div className="w-64 h-full bg-white dark:bg-gray-800  border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 shadow-md">
      <div className="p-6 text-xl font-bold border-b border-gray-200 dark:border-gray-700">
        Store Admin
      </div>
      <nav className="mt-4 flex flex-col gap-2 px-4">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded capitalize transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                isActive ? "bg-gray-200 dark:bg-gray-700 font-semibold" : ""
              }`
            }
            aria-current={({ isActive }) => (isActive ? "page" : undefined)}
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
