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
import { menuItemCategory } from "../../../services/menuItemCategory";
import { toastifyService } from "../../../services/toastifyService";
import { updateMenuItemCache } from "../../../utils/queryCacheUpdates/updateMenuItemCache";
import VerifySelectedCategoriesModal from "./VerifySelectedCategoriesModal";
import queryKeys from "../../../utils/queryKeys";
import useCustomQuery from "../../../hooks/useCustomQuery";

type CreateMenuItemProps = {
  restaurantId: number;
};

const CreateMenuItem: React.FC<CreateMenuItemProps> = ({ restaurantId }) => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
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
    //need to update menuItem list if fetched
  });

  const { mutateAsync: refMutate, isPending: categoryPending } = useMutation({
    mutationFn: menuItemCategory.createMenuItemCategoryRef,
    //need to update menuItem list if fetched
  });

  const postData = async (data: MenuItemForm) => {
    if (!selectedCategories.length && !openModal) return setOpenModal(true);
    try {
      const item = await mutateAsync({ ...data, restaurantId });
      const nestetItem = updateMenuItemCache.createMenuItem(queryClient, item);
      if (selectedCategories.length) {
        const categoryIds = selectedCategories.map((c) => c.id);
        const statusCode = await refMutate({
          categoryIds,
          menuItemId: item.id,
          restaurantId,
        });
        updateMenuItemCache.createMenuItemCategoryRef(
          queryClient,
          restaurantId,
          statusCode,
          nestetItem,
          selectedCategories
        );
      }
      reset();
      setSelectedCategories([]);
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
        label="Choose the number of additional options:"
        type="number"
        {...register("extrasAmount")}
      />
      <Input
        errMessage={errors.image?.message}
        label="Choose Image:"
        type="file"
        {...register("image")}
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
        disabled={categoryPending || menuItemPending}
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
