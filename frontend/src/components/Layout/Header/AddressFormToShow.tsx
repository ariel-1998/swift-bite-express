import React from "react";
import useUserInfo from "../../../hooks/useUserInfo";
import UserUpdateAddressForm from "../../AddressArea/UserUpdateAddressForm";
import UserAddAddressForm from "../../AddressArea/UserAddAddressForm";

type AddressFormToShowProps = {
  toggleAddressForm: () => void;
};

const AddressFormToShow: React.FC<AddressFormToShowProps> = ({
  toggleAddressForm,
}) => {
  const { address } = useUserInfo();

  return (
    <div
      className={`fixed inset-0 flex  justify-end bg-black bg-opacity-50 z-50`}
      onClick={toggleAddressForm}
    >
      {address ? (
        <UserUpdateAddressForm onSuccess={toggleAddressForm} />
      ) : (
        <UserAddAddressForm onSuccess={toggleAddressForm} />
      )}
    </div>
  );
};

export default AddressFormToShow;
