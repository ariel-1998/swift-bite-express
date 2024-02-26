import React, { useState } from "react";
import AddressFormToShow from "./AddressFormToShow";
import HeaderMenu from "./HeaderMenu";
import CurrentAddress from "./CurrentAddress";
import RestaurantSearch from "../../RestaurantArea/RestaurantSearch";
import useScreenSize from "../../../hooks/useScreenSize";
import useUserInfo from "../../../hooks/useUserInfo";
import { Role } from "../../../models/User";

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
          <div className="flex flex-col gap-0 items-center px-3  ">
            <span className="lg:text-lg text-lg font-extrabold mb-0 leading-none">
              SwiftBite
            </span>
            <span className="text-lg font-bold leading-none">express</span>
          </div>
          {!isSmaller && (user?.role === Role.user || !user) && (
            <CurrentAddress onClick={toggleAddressForm} />
          )}
        </div>
      )}
      <div
        className={`flex justify-around gap-6 lg:gap-10 ${
          isSmaller && openSearch && "grow"
        }`}
      >
        {/* {(user?.role === Role.user || !user) && ( */}
        <RestaurantSearch
          openSearch={openSearch}
          toggleOpenSearch={toggleOpenSearch}
        />
        {/* )} */}
        {isSmaller && openSearch ? null : <HeaderMenu />}
      </div>
      {showAddressForm && (user?.role === Role.user || !user) && (
        <AddressFormToShow toggleAddressForm={toggleAddressForm} />
      )}
    </div>
  );
};

export default Header;
