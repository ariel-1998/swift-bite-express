import React from "react";
import useUserInfo from "../../../hooks/useUserInfo";
import { FaLocationDot } from "react-icons/fa6";

type CurrentAddressProps = {
  onClick(): void;
};

const CurrentAddress: React.FC<CurrentAddressProps> = ({ onClick }) => {
  const { address } = useUserInfo();
  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex items-center gap-2 border py-1 px-2"
    >
      <i className="bg-white p-1 rounded-full">
        <FaLocationDot className="text-brown" />
      </i>
      <span className="font-semibold">Address: </span>
      {address && (
        <span>
          {address.street} {address.building}, {address.city}
        </span>
      )}
      {!address && <span>Add address</span>}
    </div>
  );
};

export default CurrentAddress;
