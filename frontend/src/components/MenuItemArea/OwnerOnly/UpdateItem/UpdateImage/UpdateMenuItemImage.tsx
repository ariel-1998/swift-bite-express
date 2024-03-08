import React from "react";
import UpdateForm from "../../../../RestaurantArea/OwnerOnly/UpdateForm";

type UpdateMenuItemImageProps = {
  // Define props here
};

const UpdateMenuItemImage: React.FC<UpdateMenuItemImageProps> = ({ props }) => {
  return <UpdateForm formTitle="Update item image in menu"></UpdateForm>;
};

export default UpdateMenuItemImage;
