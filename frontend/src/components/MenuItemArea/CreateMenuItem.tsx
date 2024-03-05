import React, { useState } from "react";
import UpdateForm from "../RestaurantArea/OwnerOnly/UpdateForm";
import Input from "../Customs/Input";
import Button from "../Customs/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuItemForm, menuItemSchema } from "../../models/MenuItem";
import { SQLBoolean } from "../../models/SQLBoolean";
import { useMutation } from "@tanstack/react-query";
import { menuItemService } from "../../services/menuItemService";
import AddCategoryToItem from "./AddCategoryToItem";
import { Category } from "../../models/Category";
import Modal from "../Customs/Modal";

type CreateMenuItemProps = {
  restaurantId: number;
  //   restaurant: NestedRestaurantAndAddress;
};

const CreateMenuItem: React.FC<CreateMenuItemProps> = ({ restaurantId }) => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MenuItemForm>({
    resolver: zodResolver(menuItemSchema),
  });

  const { mutateAsync } = useMutation({
    mutationFn: menuItemService.createMenuItem,
    //need to update menuItem list if fetched
  });

  const postData = async (data: MenuItemForm) => {
    if (!selectedCategories.length && !openModal) return setOpenModal(true);
    console.log("what");
    try {
      const { id } = await mutateAsync({ ...data, restaurantId });

      if (selectedCategories.length) {
        // add another query that will update the category pairing to the menuItemCategory route
      }
      reset();
      setOpenModal(false);
    } catch (error) {
      console.log(error);
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
      <AddCategoryToItem
        setSelectedCategories={setSelectedCategories}
        selectedCategories={selectedCategories}
        restaurantId={restaurantId}
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
      <Button
        type="submit"
        size={"formBtn"}
        variant={"primary"}
        // disabled={mutation.isPending}
        // defaultValue={restaurant.name}
        // onClick={onButtonClick}
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
      <h2>Warning</h2>
      <span>You are trying to Add Menu Item with no Category</span>
      <span>Are you sure you want to proceed?</span>
      <div>
        <Button type="submit">Proceed</Button>
        <Button type="button" onClick={close}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
