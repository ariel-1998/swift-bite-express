import React from "react";
import { Outlet } from "react-router-dom";

const Address: React.FC = () => {
  return (
    <div className="m-auto">
      <Outlet />
    </div>
  );
};

export default Address;
