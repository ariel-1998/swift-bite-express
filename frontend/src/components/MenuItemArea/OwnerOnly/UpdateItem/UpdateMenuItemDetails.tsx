import React from "react";
import UpdateForm from "../../../RestaurantArea/OwnerOnly/UpdateForm";
import { menuItemService } from "../../../../services/menuItemService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MenuItemForm,
  MenuItemWPreparationStyles,
  menuItemSchema,
} from "../../../../models/MenuItem";
import Input from "../../../Customs/Input";
import { SQLBoolean } from "../../../../models/SQLBoolean";
import Button from "../../../Customs/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMenuItemCache } from "../../../../utils/queryCacheUpdates/updateMenuItemCache";

type UpdateMenuItemDetailsProps = {
  item: MenuItemWPreparationStyles;
};

const UpdateMenuItemDetails: React.FC<UpdateMenuItemDetailsProps> = ({
  item,
}) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<MenuItemForm, "image">>({
    resolver: zodResolver(menuItemSchema.omit({ image: true })),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: menuItemService.updateMenuItemApartFromImg,
    onMutate(variables) {
      const context = updateMenuItemCache.updateMenuItemApartFromImg.onMutate(
        queryClient,
        { ...item, ...variables }
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

  const submitForm = handleSubmit(
    ({
      optionalSideDishes,
      price,
      drinksAmount,
      ...rest
    }: Omit<MenuItemForm, "image">) => {
      mutate({
        drinksAmount: +drinksAmount,
        restaurantId: item.restaurantId,
        optionalSideDishes: +optionalSideDishes,
        price: +price,
        id: item.id,
        ...rest,
      });
    }
  );

  return (
    <UpdateForm formTitle="Update item Details in menu" onSubmit={submitForm}>
      <Input
        label="Name:"
        type="text"
        {...register("name")}
        errMessage={errors.name?.message}
        defaultValue={item.name}
        disabled={isPending}
      />
      <Input
        errMessage={errors.description?.message}
        label="description:"
        type="text"
        {...register("description")}
        defaultValue={item.description || ""}
        disabled={isPending}
      />
      <Input
        errMessage={errors.optionalSideDishes?.message}
        label="Choose amount of Optional Side Dishes:"
        type="number"
        {...register("optionalSideDishes")}
        defaultValue={item.optionalSideDishes?.toString()}
        disabled={isPending}
      />
      <Input
        errMessage={errors.drinksAmount?.message}
        label="Choose the number of drinks:"
        type="number"
        {...register("drinksAmount")}
        defaultValue={item.drinksAmount?.toString()}
        disabled={isPending}
      />
      <Input
        errMessage={errors.price?.message}
        label="Price:"
        type="number"
        {...register("price")}
        defaultValue={item.price}
        disabled={isPending}
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
            disabled={isPending}
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
            disabled={isPending}
          />
          <label htmlFor="no" className="h-fit">
            No
          </label>
        </div>
        <div className="text-error">{errors.showSouces?.message}</div>
      </div>

      <Button
        type="submit"
        size={"formBtn"}
        variant={"primary"}
        disabled={isPending}
      >
        Update
      </Button>
    </UpdateForm>
  );
};

export default UpdateMenuItemDetails;
