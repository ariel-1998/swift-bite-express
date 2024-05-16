import React, { useState } from "react";
import UpdateForm from "../../RestaurantArea/OwnerOnly/UpdateForm";
import Input from "../../Customs/Input";
import Button from "../../Customs/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuItemForm, menuItemSchema } from "../../../models/MenuItem";
import { SQLBoolean } from "../../../models/SQLBoolean";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { menuItemService } from "../../../services/menuItemService";
import AddCategoryToItem from "./AddCategoryToItem";
import { Category } from "../../../models/Category";
import { menuItemCategoryService } from "../../../services/menuItemCategoryService";
import { toastifyService } from "../../../services/toastifyService";
import { updateMenuItemCache } from "../../../utils/queryCacheUpdates/updateMenuItemCache";
import VerifySelectedCategoriesModal from "./VerifySelectedCategoriesModal";
import AddOptionsToItem from "./OptionsArea/AddOptionsToItem";
import { menuItemOptionsService } from "../../../services/menuItemOptionsService";

type CreateMenuItemProps = {
  restaurantId: number;
};

const CreateMenuItem: React.FC<CreateMenuItemProps> = ({ restaurantId }) => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MenuItemForm>({
    resolver: zodResolver(menuItemSchema),
  });

  const { mutateAsync, isPending: menuItemPending } = useMutation({
    mutationFn: menuItemService.createMenuItem,
  });

  const { mutateAsync: optsMutate, isPending: optsPending } = useMutation({
    mutationFn: menuItemOptionsService.createOptions,
  });
  const { mutateAsync: refMutate, isPending: categoryPending } = useMutation({
    mutationFn: menuItemCategoryService.createMenuItemCategoryRef,
  });

  const postData = async (data: MenuItemForm) => {
    if (!selectedCategories.length && !openModal) return setOpenModal(true);
    try {
      //create menuItem
      const item = await mutateAsync({ ...data, restaurantId });
      const menuItem = { categories: [], ...item };

      // create options if added any
      if (options.length) {
        try {
          console.log(options);
          menuItem.options = await optsMutate({
            menuItemId: menuItem.id,
            options,
            restaurantId,
          });
        } catch (error) {
          toastifyService.error(error as Error);
        }
      }

      if (selectedCategories.length) {
        const categoryIds = selectedCategories.map((c) => c.id);
        try {
          await refMutate({
            categoryIds,
            menuItemId: menuItem.id,
            restaurantId,
          });
        } catch (error) {
          toastifyService.error(error as Error);
        }
      }
      updateMenuItemCache.createMenuItem(queryClient, menuItem);

      reset();
      setSelectedCategories([]);
      setOptions([]);
      setOpenModal(false);
    } catch (error) {
      toastifyService.error(error as Error);
    }
  };
  return (
    <UpdateForm onSubmit={handleSubmit(postData)} formTitle="Add item to menu">
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
        label="Choose the number of Side Dish Options:"
        type="number"
        {...register("extrasAmount")}
      />
      <Input
        errMessage={errors.drinksAmount?.message}
        label="Choose the number of drinks:"
        type="number"
        {...register("drinksAmount")}
      />
      <Input
        errMessage={errors.image?.message}
        label="Choose Image:"
        type="file"
        {...register("image")}
      />
      <Input
        errMessage={errors.price?.message}
        label="Price:"
        type="number"
        {...register("price")}
      />
      <AddOptionsToItem options={options} setOptions={setOptions} />
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
        disabled={categoryPending || menuItemPending || optsPending}
      >
        Create
      </Button>
      {openModal && (
        <VerifySelectedCategoriesModal close={() => setOpenModal(false)} />
      )}
    </UpdateForm>
  );
};

export default CreateMenuItem;
