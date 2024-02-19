import React from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div
      className="flex flex-col cursor-default w-full min-h-screen overflow-y-auto 
      bg-primary-special bg-[#f7f7f1] m-0"
    >
      <Header />
      <div className="grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
