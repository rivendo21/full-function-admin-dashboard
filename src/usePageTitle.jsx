import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const routeTitles = {
  "/": "Home",
  "/products": "Products",
  "/orders": "Orders",
  "/customers": "Customers",
};

const usePageTitle = () => {
  const { pathname } = useLocation();
  //here condition is set for pathname
  useEffect(() => {
    const title = routeTitles[pathname] || "Store admin";
    document.title = `${title} | Admin Panel`;
  }, [pathname]);
};

export default usePageTitle;
