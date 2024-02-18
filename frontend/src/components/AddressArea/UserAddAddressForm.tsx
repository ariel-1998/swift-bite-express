import React from "react";
import UserAddressForm from "./UserAddressForm";
import { addressService } from "../../services/addressService";

type UserAddAddressFormProps = {
  onSuccess?: () => void;
};

const UserAddAddressForm: React.FC<UserAddAddressFormProps> = ({
  onSuccess = () => undefined,
}) => {
  return (
    <UserAddressForm
      title="Add your Address"
      fn={addressService.postAddress}
      onSuccess={onSuccess}
    />
  );
};

export default UserAddAddressForm;
