import React, { useState } from "react";
import AddressFormToShow from "./AddressFormToShow";
import HeaderMenu from "./HeaderMenu";
import CurrentAddress from "./CurrentAddress";

const Header: React.FC = () => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const toggleAddressForm = () => {
    setShowAddressForm(!showAddressForm);
  };

  return (
    <div className="bg-brown h-16 w-full flex p-2 px-20 justify-between items-center">
      <div className="flex justify-around gap-36 text-secondary">
        <div className="flex flex-col gap-0 items-center px-3  ">
          <span className="text-lg font-extrabold mb-0 leading-none">
            SwiftBite
          </span>
          <span className="text-lg font-bold leading-none">express</span>
        </div>
        <CurrentAddress onClick={toggleAddressForm} />
      </div>
      <div className="flex justify-around gap-36">
        <div>
          <input />
        </div>
        <HeaderMenu />
      </div>
      {showAddressForm && (
        <AddressFormToShow toggleAddressForm={toggleAddressForm} />
      )}
    </div>
  );
};

export default Header;
