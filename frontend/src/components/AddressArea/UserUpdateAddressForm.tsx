import React from "react";
import useUserInfo from "../../hooks/useUserInfo";
import AddressForm from "./AddressForm";
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
      restaurantId={null}
      address={address}
      fn={addressService.updateAddress}
      onSuccess={onSuccess}
      //need to add navigate onuccess
    />
  );
};

export default UserUpdateAddressForm;
