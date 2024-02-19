import React from "react";
import RestaurantAddressForm from "../AddressArea/RestaurantAddressForm";
import { NestedRestaurantAndAddress } from "../../models/Restaurant";

type AddRestaurantAddressProps = {
  restaurant: NestedRestaurantAndAddress;
};
const AddRestaurantAddress: React.FC<AddRestaurantAddressProps> = ({
  restaurant,
}) => {
  return <RestaurantAddressForm restaurant={restaurant} method="create" />;
};

export default AddRestaurantAddress;
