import React from "react";
import { Outlet } from "react-router-dom";

const Auth: React.FC = () => {
  return (
    <div className="m-auto">
      <Outlet />
    </div>
  );
};

export default Auth;
