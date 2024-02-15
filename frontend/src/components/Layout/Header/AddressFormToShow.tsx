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
  const { address, user } = useUserInfo();

  const updateAddressForm = (
    <UserUpdateAddressForm onSuccess={toggleAddressForm} />
  );
  const createAddressForm = (
    <UserAddAddressForm onSuccess={toggleAddressForm} />
  );
  return (
    <div
      className={`fixed inset-0 flex  justify-end bg-black bg-opacity-50 z-50`}
      onClick={toggleAddressForm}
    >
      {!user
        ? address
          ? updateAddressForm
          : createAddressForm
        : user.primaryAddressId
        ? updateAddressForm
        : createAddressForm}
    </div>
  );
};

export default AddressFormToShow;
