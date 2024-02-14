import React from "react";
import { Link } from "react-router-dom";
import useUserInfo from "../../hooks/useUserInfo";

const OptionList: React.FC = () => {
  //////////need to change the list if user is logged in
  const { user } = useUserInfo();
  return (
    <div className="absolute top-10 left-0 right-0 p-2 bg-white flex flex-col gap-1 rounded">
      {!user ? (
        <>
          <Link className="hover:text-orange" to={"/auth/login"}>
            Login
          </Link>
          <Link className="hover:text-orange" to={"/auth/register"}>
            Register
          </Link>
        </>
      ) : (
        <>
          <Link to={"/auth/logout"} className="hover:text-orange">
            Logout
          </Link>
        </>
      )}
    </div>
  );
};

export default OptionList;
