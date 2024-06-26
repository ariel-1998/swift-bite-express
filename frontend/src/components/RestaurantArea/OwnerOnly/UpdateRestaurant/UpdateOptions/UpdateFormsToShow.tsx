import React from "react";
import { NestedRestaurantAndAddress } from "../../../../../models/Restaurant";
import useActiveRestaurantForm from "../../../../../hooks/useActiveRestaurantForm";
import UpdateOptions from "./FormOptions";
import ActiveFormOptions from "./ActiveFormOptions";
import AddRestaurantAddress from "../AddRestaurantAddress";
import UpdateRestaurantAddress from "../UpdateRestaurantAddress";
import UpdateRestaurantName from "../UpdateRestaurantName";
import UpdateRestaurantLogo from "../UpdateRestaurantLogo";
import UpdateRestaurantImage from "../UpdateRestaurantImage";
import AddCategory from "../../../../CategoryArea/AddCategory";
import UpdateCategory from "../../../../CategoryArea/UpdateCategory";
import CreateMenuItem from "../../../../MenuItemArea/OwnerOnly/CreateMenuItem";
import UpdateItem from "../../../../MenuItemArea/OwnerOnly/UpdateItem/UpdateItem";

type UpdateFormsToShowProps = {
  data: NestedRestaurantAndAddress;
};

const UpdateFormsToShow: React.FC<UpdateFormsToShowProps> = ({ data }) => {
  const { activeForm } = useActiveRestaurantForm();
  function GenerateForm(): JSX.Element | null {
    switch (activeForm.name) {
      case "restaurant": {
        if (activeForm.active === "Update Name")
          return <UpdateRestaurantName restaurant={data} />;
        if (activeForm.active === "Update Logo")
          return <UpdateRestaurantLogo restaurant={data} />;
        if (activeForm.active === "Update Image")
          return <UpdateRestaurantImage restaurant={data} />;
        return null;
      }

      case "address": {
        if (activeForm.active === "Create Address")
          return <AddRestaurantAddress restaurant={data} />;
        if (activeForm.active === "Update Address")
          return <UpdateRestaurantAddress restaurant={data} />;
        return null;
      }

      case "category": {
        if (activeForm.active === "Create Category")
          return <AddCategory restaurantId={data.id} />;
        if (activeForm.active === "Update Category")
          return <UpdateCategory restaurantId={data.id} />;
        return null;
      }

      case "menu item": {
        if (activeForm.active === "Create Menu item")
          return <CreateMenuItem restaurantId={data.id} />;
        if (activeForm.active === "Update Menu item")
          return <UpdateItem restaurantId={data.id} />;
        // if (activeForm.active === "Update Menu item Image")
        //   return <UpdateItem restaurantId={data.id} update="image" />;
        // if (activeForm.active === "Menu Item - Category Association")
        //   return <UpdateItem restaurantId={data.id} update="association" />;
        return null;
      }

      default:
        return null;
    }
  }

  return (
    <div className="rounded m-auto my-5 shadow-md border-secondary border-2 p-5 flex flex-col w-[95vw] sm:w-[500px]  bg-white">
      <UpdateOptions data={data} />
      <ActiveFormOptions />
      <GenerateForm />
    </div>
  );
};

export default UpdateFormsToShow;
