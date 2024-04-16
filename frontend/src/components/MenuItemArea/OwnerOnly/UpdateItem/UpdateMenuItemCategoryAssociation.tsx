import React, { FormEvent, useState } from "react";
import { CategoriesNestedInMenuItem } from "../../../../models/MenuItem";
import UpdateForm from "../../../RestaurantArea/OwnerOnly/UpdateForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { menuItemCategoryService } from "../../../../services/menuItemCategoryService";
import LoadingButton from "../../../Customs/LoadingButton";
import { Category } from "../../../../models/Category";
import AddCategoryToItem from "../AddCategoryToItem";
import { updateMenuItemCache } from "../../../../utils/queryCacheUpdates/updateMenuItemCache";

type UpdateMenuItemCategoryAssociationProps = {
  menuItem: CategoriesNestedInMenuItem;
};

const UpdateMenuItemCategoryAssociation: React.FC<
  UpdateMenuItemCategoryAssociationProps
> = ({ menuItem }) => {
  const queryClient = useQueryClient();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    menuItem.categories as Category[]
  );
  const { mutate, isPending } = useMutation({
    mutationFn: menuItemCategoryService.updateMenuItemCategoryRef,
    onMutate() {
      return updateMenuItemCache.updateMenuItemCategoryRef.onMutate(
        queryClient,
        menuItem,
        selectedCategories
      );
    },
    onSuccess(status, _, context) {
      updateMenuItemCache.updateMenuItemCategoryRef.onSuccess(
        queryClient,
        context,
        status
      );
    },
    onError(error, _, context) {
      updateMenuItemCache.updateMenuItemCategoryRef.onError(
        error,
        context,
        queryClient
      );
    },
  });

  const updateCategories = (e: FormEvent) => {
    e.preventDefault();
    const categoryIds = selectedCategories.map((c) => c.id);
    mutate({
      categoryIds,
      menuItemId: menuItem.id,
      restaurantId: menuItem.restaurantId,
    });
  };

  return (
    <UpdateForm
      onSubmit={updateCategories}
      formTitle="Update menu item categories association"
    >
      <AddCategoryToItem
        setSelectedCategories={setSelectedCategories}
        restaurantId={menuItem.restaurantId}
        selectedCategories={selectedCategories}
      />
      <LoadingButton
        type="submit"
        size={"formBtn"}
        variant={"primary"}
        disabled={isPending}
      >
        Update
      </LoadingButton>
    </UpdateForm>
  );
};

export default UpdateMenuItemCategoryAssociation;
