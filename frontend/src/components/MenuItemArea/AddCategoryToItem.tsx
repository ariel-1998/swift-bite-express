import React, { ChangeEvent, useState } from "react";
import queryKeys from "../../utils/queryKeys";
import useCustomQuery from "../../hooks/useCustomQuery";
import { categoryService } from "../../services/categoryService";
import { toastifyService } from "../../services/toastifyService";
import Input from "../Customs/Input";
import Button from "../Customs/Button";
import Modal from "../Customs/Modal";
import { Category } from "../../models/Category";
import SelectedCategory from "./SelectedCategory";

type AddCategoryToItemProps = {
  restaurantId: number;
  selectedCategories: Category[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  // Define props here
};

const AddCategoryToItem: React.FC<AddCategoryToItemProps> = ({
  restaurantId,
  selectedCategories,
  setSelectedCategories,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const { data, isLoading, isError } = useCustomQuery({
    queryKey: queryKeys.categories.getAllCategoriesByRestaurantId(restaurantId),
    queryFn: () => categoryService.getAllCategoriesByRestaurantId(restaurantId),
    onError(error) {
      toastifyService.error(error as Error);
    },
  });

  const updateSelectedCategories = (
    e: ChangeEvent<HTMLInputElement>,
    category: Category
  ) => {
    setSelectedCategories((prev) => {
      if (e.target.checked) {
        return [...prev, category];
      }
      return filterSelectedCategory(prev, category.id);
    });
  };

  function filterSelectedCategory(categories: Category[], categoryId: number) {
    return categories.filter((c) => c.id !== categoryId);
  }

  const openModalFn = () => setOpenModal(true);
  const closeModalFn = () => setOpenModal(false);

  return (
    <div>
      <div>
        {selectedCategories.map((c) => (
          <SelectedCategory
            category={c}
            key={c.id}
            onClick={() =>
              setSelectedCategories((prev) =>
                filterSelectedCategory(prev, c.id)
              )
            }
          />
        ))}
      </div>
      <Button
        variant={"ghost"}
        size={"formBtn"}
        className="border"
        onClick={openModalFn}
      >
        Pair Item to Categories
      </Button>
      {openModal && (
        <Modal closeBtn close={closeModalFn}>
          <ul>
            {isLoading && <li>Loading Categories...</li>}
            {isError && <li>Error requesting Categories</li>}
            {!data?.length && <li>No categories were created</li>}
            {!!data?.length &&
              data.map((c) => (
                <li
                  key={c.id}
                  className="flex gap-1 items-center font-serif text-l"
                >
                  <Input
                    type="checkbox"
                    onChange={(e) => updateSelectedCategories(e, c)}
                    id={c.id.toString()}
                    checked={selectedCategories.some((cat) => cat.id === c.id)}
                  />
                  <label htmlFor={c.id.toString()}>{c.name}</label>
                </li>
              ))}
          </ul>
        </Modal>
      )}
    </div>
  );
};

export default AddCategoryToItem;
