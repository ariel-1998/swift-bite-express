import React, { useState } from "react";
import Button from "../Customs/Button";
import Modal from "../Customs/Modal";
import { Category } from "../../models/Category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";
import { updateCategoryCache } from "../../utils/queryCacheUpdates/updateCategoryCache";

type RemoveCategoryProps = {
  category: Category | undefined;
  restaurantId: number;
  setSelectedCategory: (val: string) => void;
};

const RemoveCategory: React.FC<RemoveCategoryProps> = ({
  category,
  restaurantId,
  setSelectedCategory,
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const closeModal = () => setIsOpenModal(false);
  const openModal = () => setIsOpenModal(true);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: categoryService.deleteCategory,
    onMutate({ id, restaurantId }) {
      closeModal();
      setSelectedCategory("");
      return updateCategoryCache.deleteCategory.onMutate(
        queryClient,
        id,
        restaurantId
      );
    },
    onError(error, _, context) {
      updateCategoryCache.deleteCategory.onError(
        error,
        queryClient,
        restaurantId,
        context
      );
    },
  });

  const removeCategory = () => {
    if (!category) return;
    mutate({ id: category.id, restaurantId });
  };

  return (
    <>
      {isOpenModal && (
        <Modal close={closeModal}>
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col  items-center font-semibold text-l">
              <span className="font-bold text-xl text-error border-b w-full text-center">
                Note
              </span>
              <span>
                Deleteing this category means all menu items will also not have
                it as their Category
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={removeCategory}
                variant={"error"}
                className="font-semibold "
              >
                Remove
              </Button>
              <Button
                type="button"
                onClick={closeModal}
                variant={"primary"}
                className="font-semibold w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
      <Button
        type="button"
        disabled={!category}
        onClick={openModal}
        variant={"error"}
        size={"formBtn"}
      >
        Remove Category
      </Button>
    </>
  );
};

export default RemoveCategory;
