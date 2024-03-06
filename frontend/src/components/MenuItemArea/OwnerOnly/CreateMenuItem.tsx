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
import Modal from "../../Customs/Modal";
import { menuItemCategory } from "../../../services/menuItemCategory";
import { toastifyService } from "../../../services/toastifyService";
import { updateMenuItemCache } from "../../../utils/queryCacheUpdates/updateMenuItemCache";

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
      const oldData = updateMenuItemCache.createMenuItem(queryClient, item);
      if (selectedCategories.length) {
        const categoryIds = selectedCategories.map((c) => c.id);
        const status = await refMutate({
          categoryIds,
          menuItemId: item.id,
          restaurantId,
        });
        updateMenuItemCache.createMenuItemCategoryRef(
          queryClient,
          oldData,
          item,
          selectedCategories,
          status
        );
      }
      reset();
      setSelectedCategories([]);
      setOpenModal(false);
    } catch (error) {
      console.log(error);
      toastifyService.error(error as Error);
    }
  };

  return (
    <UpdateForm onSubmit={handleSubmit(postData)}>
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

type VerifySelectedCategoriesModalProps = {
  selectedCategories?: Category[];
  close: () => void;
};
function VerifySelectedCategoriesModal({
  close,
}: VerifySelectedCategoriesModalProps) {
  return (
    <Modal close={close}>
      <div className="flex flex-col items-center gap-1 font-semibold">
        <h2 className="font-bold text-xl text-error mb-1">Warning</h2>
        <span>You are trying to Add Menu Item with no Category</span>
        <span>Are you sure you want to proceed?</span>
        <div className="flex gap-1">
          <Button type="submit" variant={"primary"}>
            Proceed
          </Button>
          <Button type="button" onClick={close} variant={"error"}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
