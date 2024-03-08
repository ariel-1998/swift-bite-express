import React, { useState } from "react";
import UpdateForm from "../../../../RestaurantArea/OwnerOnly/UpdateForm";
import useCustomQuery from "../../../../../hooks/useCustomQuery";
import queryKeys from "../../../../../utils/queryKeys";
import { menuItemService } from "../../../../../services/menuItemService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MenuItemForm,
  MenuItemJoinedWCategory,
  menuItemSchema,
} from "../../../../../models/MenuItem";
import Input from "../../../../Customs/Input";
import { SQLBoolean } from "../../../../../models/SQLBoolean";
import { Category } from "../../../../../models/Category";
import AddCategoryToItem from "../../AddCategoryToItem";
import Button from "../../../../Customs/Button";

type UpdateMenuItemDetailsProps = {
  restaurantId: number;
};

const UpdateMenuItemDetails: React.FC<UpdateMenuItemDetailsProps> = ({
  restaurantId,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<MenuItemForm, "image">>({
    resolver: zodResolver(menuItemSchema.omit({ image: true })),
  });

  // const {} = useCustomQuery({
  //   queryKey: queryKeys.menuItems.getMenuItemById()
  // })

  return (
    <UpdateForm formTitle="Update item Details in menu">
      <Input
        label="Name:"
        type="text"
        {...register("name")}
        errMessage={errors.name?.message}
      />
      <Input
        errMessage={errors.description?.message}
        label="description:"
        type="text"
        {...register("description")}
      />
      <Input
        errMessage={errors.extrasAmount?.message}
        label="Choose the number of additional options:"
        type="number"
        {...register("extrasAmount")}
      />
      <div className="flex flex-col">
        <label>Show sauces available at the restaurant:</label>
        <div className="flex items-center gap-1 ">
          <Input
            id="yes"
            type="radio"
            value={SQLBoolean.true}
            {...register("showSouces")}
          />
          <label htmlFor="yes">Yes</label>
        </div>
        <div className="flex items-center gap-1">
          <Input
            id="no"
            type="radio"
            value={SQLBoolean.false}
            {...register("showSouces")}
          />
          <label htmlFor="no" className="h-fit">
            No
          </label>
        </div>
        <div className="text-error">{errors.showSouces?.message}</div>
      </div>
      <AddCategoryToItem
        setSelectedCategories={setSelectedCategories}
        selectedCategories={selectedCategories}
        restaurantId={restaurantId}
      />
      <Button
        type="submit"
        size={"formBtn"}
        variant={"primary"}
        // disabled={categoryPending || menuItemPending}
      >
        Create
      </Button>
    </UpdateForm>
  );
};

export default UpdateMenuItemDetails;
