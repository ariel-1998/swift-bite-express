import React from "react";
import UpdateForm from "../../RestaurantArea/OwnerOnly/UpdateForm";

type UpdateMenuItemProps = {
  // Define props here
};

const UpdateMenuItem: React.FC<UpdateMenuItemProps> = ({ props }) => {
  return <UpdateForm></UpdateForm>;
};

export default UpdateMenuItem;
