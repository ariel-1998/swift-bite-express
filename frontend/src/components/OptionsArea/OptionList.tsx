import React from "react";
import { Link } from "react-router-dom";

const OptionList: React.FC = () => {
  //////////need to change the list if user is logged in
  return (
    <div className="absolute top-10 left-0 right-0 p-2 bg-secondary flex flex-col gap-1 rounded">
      <Link className="hover:text-orange" to={"/auth/login"}>
        Login
      </Link>
      <Link className="hover:text-orange" to={"/auth/register"}>
        Register
      </Link>
    </div>
  );
};

export default OptionList;
