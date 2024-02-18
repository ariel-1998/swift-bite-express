import React from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="grid grid-rows-[auto,1fr,auto] min-h-screen bg-primary-special bg-[#f7f7f1]">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
