import React, { ReactNode } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="grid grid-rows-[auto,1fr,auto] min-h-screen bg-primary-special bg-[#f7f7f1]">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
