import React, { FormEvent, useRef } from "react";
import UpdateForm from "../RestaurantArea/OwnerOnly/UpdateForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";
import Button from "../Customs/Button";
import { CategoryForm, categorySchema } from "../../models/Category";
import { toastifyService } from "../../services/toastifyService";
import { updateCategoryCache } from "../../utils/queryCacheUpdates/updateCategoryCache";
import Input from "../Customs/Input";
import queryKeys from "../../utils/queryKeys";

type AddCategoryProps = {
  restaurantId: number;
};

const AddCategory: React.FC<AddCategoryProps> = ({ restaurantId }) => {
  const queryClient = useQueryClient();
  const nameRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);
  const queryKey =
    queryKeys.categories.getAllCategoriesByRestaurantId(restaurantId);

  const { mutate } = useMutation({
    mutationFn: categoryService.addCategory,
    onMutate(variables) {
      return updateCategoryCache.addCategory.onMutate(
        variables,
        queryKey,
        queryClient
      );
    },
    onSuccess(data, _, context) {
      updateCategoryCache.addCategory.onSuccess(
        data,
        context,
        queryKey,
        queryClient
      );
    },
    onError(error, _, context) {
      updateCategoryCache.addCategory.onError(
        error,
        context,
        queryKey,
        queryClient
      );
    },
  });

  function submitCategory(e: FormEvent) {
    e.preventDefault();
    if (!nameRef.current || !descriptionRef.current) return;
    const name = nameRef.current.value;
    const description = descriptionRef.current.value;
    const formData: CategoryForm = { name, description };
    try {
      categorySchema.parse(formData);
    } catch (error) {
      return toastifyService.error(error as Error);
    }
    mutate({ ...formData, restaurantId });
  }

  return (
    <UpdateForm onSubmit={submitCategory} formTitle="Add category to menu">
      <Input label="Category Name:" type="text" ref={nameRef} />
      <Input label="Desctiption:" type="text" ref={descriptionRef} />
      <Button type="submit" size={"formBtn"} variant={"primary"}>
        Update
      </Button>
    </UpdateForm>
  );
};

export default AddCategory;
