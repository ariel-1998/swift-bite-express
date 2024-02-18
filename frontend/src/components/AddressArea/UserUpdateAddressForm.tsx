import React from "react";
import useUserInfo from "../../hooks/useUserInfo";
import AddressForm from "./UserAddressForm";
import { addressService } from "../../services/addressService";

type UserUpdateAddressFormProps = {
  onSuccess: () => void;
};

const UserUpdateAddressForm: React.FC<UserUpdateAddressFormProps> = ({
  onSuccess = () => undefined,
}) => {
  const { address } = useUserInfo();
  return (
    <AddressForm
      title="Update your Address"
      address={address}
      fn={addressService.updateAddress}
      onSuccess={onSuccess}
      //need to add navigate onuccess
    />
  );
};

export default UserUpdateAddressForm;
