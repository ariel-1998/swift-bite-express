import React, { useState } from "react";
// import useIsMobile from "../../../hooks/useIsMobile";
import useUserInfo from "../../../hooks/useUserInfo";
import { Link } from "react-router-dom";

const HeaderMenu: React.FC = () => {
  // const isMobile = useIsMobile();
  const { user } = useUserInfo();
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen((prev) => !prev);
  return (
    <div className="relative" onClick={toggleMenu}>
      <div className="font-semibold text-secondary cursor-pointer ">
        Hello, {user?.fullName ?? "Guest"}
      </div>
      {open && (
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
              {user.isRestaurantOwner && (
                <Link to={"/restaurants/owner"} className="hover:text-orange">
                  My Restaurants
                </Link>
              )}

              <Link to={"/auth/logout"} className="hover:text-orange">
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
