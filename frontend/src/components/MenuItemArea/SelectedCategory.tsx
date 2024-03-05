import React, { ComponentProps } from "react";
import { Category } from "../../models/Category";
import { FaTimesCircle } from "react-icons/fa";

type SelectedCategoryProps = {
  category: Category;
} & ComponentProps<"div">;

const SelectedCategory: React.FC<SelectedCategoryProps> = ({
  category,
  ...rest
}) => {
  return (
    <div
      className="flex cursor-pointer rounded-full border w-fit p-1 px-2 items-center justify-center gap-1 bg-secondary"
      {...rest}
    >
      <span>{category.name}</span>
      <span>
        <FaTimesCircle className="text-error" />
      </span>
    </div>
  );
};

export default SelectedCategory;
