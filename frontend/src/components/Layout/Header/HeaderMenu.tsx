import React, { useState } from "react";
// import useIsMobile from "../../../hooks/useIsMobile";
import useUserInfo from "../../../hooks/useUserInfo";
import { Link } from "react-router-dom";
import useScreenSize from "../../../hooks/useScreenSize";
import { FaHamburger } from "react-icons/fa";

const HeaderMenu: React.FC = () => {
  // const isMobile = useIsMobile();
  const { user } = useUserInfo();
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen((prev) => !prev);
  const isSmaller = useScreenSize("lg");

  return (
    <div className={`relative cursor-pointer`} onClick={toggleMenu}>
      {!isSmaller ? (
        <div className="font-semibold text-secondary">
          Hello, {user?.fullName ?? "Guest"}
        </div>
      ) : (
        <FaHamburger className="text-2xl text-white" />
      )}
      {open && (
        <div className="absolute top-10 right-0 p-2 bg-white flex flex-col gap-1 rounded">
          {!user && (
            <>
              <Link className="hover:text-orange" to={"/auth/login"}>
                Login
              </Link>
              <Link className="hover:text-orange" to={"/auth/register"}>
                Register
              </Link>
            </>
          )}

          {user?.isRestaurantOwner && (
            <>
              <Link to={"/restaurants/owner"} className="hover:text-orange">
                My Restaurants
              </Link>
            </>
          )}
          {user && (
            <>
              <Link to="/restaurants/create" className="hover:text-orange">
                Create Restaurant
              </Link>
              <Link to={"/auth/logout"} className="hover:text-error">
                Logout
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderMenu;
