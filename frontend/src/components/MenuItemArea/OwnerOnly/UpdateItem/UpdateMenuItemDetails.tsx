import React from "react";
import UpdateForm from "../../../RestaurantArea/OwnerOnly/UpdateForm";
import { menuItemService } from "../../../../services/menuItemService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MenuItem,
  MenuItemForm,
  menuItemSchema,
} from "../../../../models/MenuItem";
import Input from "../../../Customs/Input";
import { SQLBoolean } from "../../../../models/SQLBoolean";
import Button from "../../../Customs/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMenuItemCache } from "../../../../utils/queryCacheUpdates/updateMenuItemCache";

type UpdateMenuItemDetailsProps = {
  item: MenuItem;
};

const UpdateMenuItemDetails: React.FC<UpdateMenuItemDetailsProps> = ({
  item,
  // menuItemId,
}) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<MenuItemForm, "image">>({
    resolver: zodResolver(menuItemSchema.omit({ image: true })),
  });

  // const { data: item, isLoading } = useCustomQuery({
  //   queryKey: queryKeys.menuItems.getMenuItemById(menuItemId),
  //   queryFn: () => menuItemService.getMenuItemById(menuItemId),
  // });

  const { mutate } = useMutation({
    mutationFn: menuItemService.updateMenuItemApartFromImg,
    onMutate(variables) {
      const context = updateMenuItemCache.updateMenuItemApartFromImg.onMutate(
        queryClient,
        variables
      );
      return context;
    },
    onError(error, _, context) {
      updateMenuItemCache.updateMenuItemApartFromImg.onError(
        error,
        context,
        queryClient
      );
    },
  });

  const submitForm = handleSubmit((data: Omit<MenuItemForm, "image">) => {
    mutate({
      restaurantId: item.restaurantId,
      ...data,
      extrasAmount: +data.extrasAmount,
      id: item?.id,
    });
  });

  return (
    <UpdateForm formTitle="Update item Details in menu" onSubmit={submitForm}>
      <Input
        label="Name:"
        type="text"
        {...register("name")}
        errMessage={errors.name?.message}
        defaultValue={item.name}
      />
      <Input
        errMessage={errors.description?.message}
        label="description:"
        type="text"
        {...register("description")}
        defaultValue={item.description || ""}
      />
      <Input
        errMessage={errors.extrasAmount?.message}
        label="Choose the number of additional options:"
        type="number"
        {...register("extrasAmount")}
        defaultValue={item.extrasAmount?.toString()}
      />
      <div className="flex flex-col">
        <label>Show sauces available at the restaurant:</label>
        <div className="flex items-center gap-1 ">
          <Input
            id="yes"
            type="radio"
            value={SQLBoolean.true}
            {...register("showSouces")}
            defaultChecked={Boolean(item.showSouces)}
          />
          <label htmlFor="yes">Yes</label>
        </div>
        <div className="flex items-center gap-1">
          <Input
            id="no"
            type="radio"
            value={SQLBoolean.false}
            {...register("showSouces")}
            defaultChecked={Boolean(item.showSouces)}
          />
          <label htmlFor="no" className="h-fit">
            No
          </label>
        </div>
        <div className="text-error">{errors.showSouces?.message}</div>
      </div>

      <Button type="submit" size={"formBtn"} variant={"primary"}>
        Update
      </Button>
    </UpdateForm>
  );
};

export default UpdateMenuItemDetails;
