import React, { useState } from "react";
import queryKeys from "../../utils/queryKeys";
import AddCategory from "./AddCategory";
import UpdateCategory from "./UpdateCategory";

type aProps = {
  restaurantId: number;
};

type FormType = "update" | "create";
const A: React.FC<aProps> = ({ restaurantId }) => {
  const [formType, setFormType] = useState<FormType>("create");
  const queryKey =
    queryKeys.categories.getAllCategoriesByRestaurantId(restaurantId);

  return (
    <div>
      <select onChange={(e) => setFormType(e.target.value as FormType)}>
        <option value={"create"}>Add Category</option>
        <option value={"update"}>Update Category</option>
      </select>
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

export default A;
