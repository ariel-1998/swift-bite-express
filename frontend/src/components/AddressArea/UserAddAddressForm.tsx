import React from "react";
import AddressForm from "./AddressForm";
import { addressService } from "../../services/addressService";

type UserAddAddressFormProps = {
  onSuccess?: () => void;
};

const UserAddAddressForm: React.FC<UserAddAddressFormProps> = ({
  onSuccess = () => undefined,
}) => {
  return (
    <AddressForm
      title="Add your Address"
      fn={addressService.postAddress}
      restaurantId={null}
      onSuccess={onSuccess}
      //need to add navigate onuccess
    />
  );
};

export default UserAddAddressForm;
