import React from "react";
import { NestedRestaurantAndAddress } from "../../../../models/Restaurant";
import RestaurantAddressForm from "../../../AddressArea/RestaurantAddressForm";

type UpdateRestaurantAddressProps = {
  restaurant: NestedRestaurantAndAddress;
};

const UpdateRestaurantAddress: React.FC<UpdateRestaurantAddressProps> = ({
  restaurant,
}) => {
  return (
    <RestaurantAddressForm
      restaurant={restaurant}
      method="update"
      formTitle="Update restaurant's address"
    />
  );
};

export default UpdateRestaurantAddress;
