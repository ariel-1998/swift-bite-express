import React, { useState } from "react";
import useUserInfo from "../../../hooks/useUserInfo";
import { Link } from "react-router-dom";
import useScreenSize from "../../../hooks/useScreenSize";
import { FaHamburger } from "react-icons/fa";
import { Role } from "../../../models/User";
import ProtectedComp from "../../ProtectedComponent.tsx/ProtectedComp";

//maybe add check of current page with use location and remove the link from the list if im in the same page as the link points
const HeaderMenu: React.FC = () => {
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
        <div className="absolute top-10 right-0 p-2 bg-white flex flex-col gap-1 rounded divide-y divide-solid ">
          <ProtectedComp condition={!user}>
            <Link to={"/"} className="hover:text-orange">
              Restaurants
            </Link>
            <Link className="hover:text-orange" to={"/auth/login"}>
              Login
            </Link>
            <Link className="hover:text-orange" to={"/auth/register"}>
              Register
            </Link>
          </ProtectedComp>

          <ProtectedComp condition={user?.role === Role.user}>
            <Link to={"/"} className="hover:text-orange">
              Restaurants
            </Link>
          </ProtectedComp>

          <ProtectedComp condition={user?.role === Role.owner}>
            <Link to={"/"} className="hover:text-orange">
              My Restaurants
            </Link>
            <Link to="/restaurants/create" className="hover:text-orange">
              Create Restaurant
            </Link>
          </ProtectedComp>

          <ProtectedComp
            condition={user?.role === Role.owner || user?.role === Role.user}
          >
            <Link to={"/user/update/membership"} className="hover:text-error">
              Update Membership
            </Link>
          </ProtectedComp>

          <ProtectedComp condition={!!user}>
            <Link to={"/auth/logout"} className="hover:text-error">
              Logout
            </Link>
          </ProtectedComp>
        </div>
      )}
    </div>
  );
};

export default HeaderMenu;
