import React, { useState } from "react";
import queryKeys from "../../utils/queryKeys";
import AddCategory from "./AddCategory";
import UpdateCategory from "./UpdateCategory";
import Select from "../Customs/Select";

type CategoryFormProps = {
  restaurantId: number;
};

type FormType = "update" | "create";
const CategoryForm: React.FC<CategoryFormProps> = ({ restaurantId }) => {
  const [formType, setFormType] = useState<FormType>("create");
  const queryKey =
    queryKeys.categories.getAllCategoriesByRestaurantId(restaurantId);

  return (
    <div>
      <div className="px-10 pt-2 flex justify-center">
        <Select
          onChange={(e) => setFormType(e.target.value as FormType)}
          boxSize={"fit"}
          shape="underline"
        >
          <option value={"create"} className="py-10">
            Add Category
          </option>
          <option value={"update"} className="p-10">
            Update Category
          </option>
        </Select>
      </div>
      {formType === "create" && (
        <AddCategory queryKey={queryKey} restaurantId={restaurantId} />
      )}
      {formType === "update" && (
        <UpdateCategory
          categoryId={+formType}
          queryKey={queryKey}
          restaurantId={restaurantId}
        />
      )}
    </div>
  );
};

export default CategoryForm;
