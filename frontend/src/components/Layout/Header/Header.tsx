import React, { useState } from "react";
import AddressFormToShow from "./UserOnly/AddressFormToShow";
import HeaderMenu from "./HeaderMenu";
import CurrentAddress from "./UserOnly/CurrentAddress";
import RestaurantSearch from "../../RestaurantArea/UserOnly/RestaurantSearch";
import useScreenSize from "../../../hooks/useScreenSize";
import useUserInfo from "../../../hooks/useUserInfo";
import { Role } from "../../../models/User";
import ProtectedComp from "../../ProtectedComponent.tsx/ProtectedComp";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const toggleAddressForm = () => {
    setShowAddressForm(!showAddressForm);
  };
  const isSmaller = useScreenSize("lg");
  const { user } = useUserInfo();
  const toggleOpenSearch = () => {
    if (isSmaller) setOpenSearch((prev) => !prev);
  };

  return (
    <div
      className={`bg-brown h-16 w-full flex  p-2 px-4 lg:px-20 justify-between items-center z-50  grow-0 sticky top-0  `}
    >
      {isSmaller && openSearch ? null : (
        <div className="flex justify-around gap-6 lg:gap-10 text-secondary">
          <Link to="/" className="flex flex-col gap-0 items-center px-3  ">
            <span className="lg:text-lg text-lg font-extrabold mb-0 leading-none">
              SwiftBite
            </span>
            <span className="text-lg font-bold leading-none">express</span>
          </Link>

          <ProtectedComp condition={user?.role === Role.user || !user}>
            {!isSmaller && <CurrentAddress onClick={toggleAddressForm} />}
            {/**
             * isSmaller
             * need to add location Icon that that will show the current Address with in a modal
             * also show a button to open updateAddressForm component
             * */}
          </ProtectedComp>
        </div>
      )}
      <div
        className={`flex justify-around gap-6 lg:gap-10 ${
          isSmaller && openSearch && "grow"
        }`}
      >
        <ProtectedComp condition={user?.role === Role.user || !user}>
          <RestaurantSearch
            openSearch={openSearch}
            toggleOpenSearch={toggleOpenSearch}
          />
        </ProtectedComp>

        {isSmaller && openSearch ? null : <HeaderMenu />}
      </div>

      <ProtectedComp condition={user?.role === Role.user || !user}>
        {showAddressForm && (
          <AddressFormToShow toggleAddressForm={toggleAddressForm} />
        )}
      </ProtectedComp>
    </div>
  );
};

export default Header;
