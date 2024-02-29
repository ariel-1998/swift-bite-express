import React, { FormEvent, useRef, useState } from "react";
import { categoryService } from "../../services/categoryService";
import { toastifyService } from "../../services/toastifyService";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategoryCache } from "../../utils/queryCacheUpdates/updateCategoryCache";
import UpdateForm from "../RestaurantArea/OwnerOnly/UpdateForm";
import { Category, CategoryForm, categorySchema } from "../../models/Category";
import Input from "../Customs/Input";
import Button from "../Customs/Button";
import useCustomQuery from "../../hooks/useCustomQuery";
import queryKeys from "../../utils/queryKeys";

type UpdateCategoryProps = {
  restaurantId: number;
  queryKey: QueryKey;
  categoryId: number;
};

const UpdateCategory: React.FC<UpdateCategoryProps> = ({
  restaurantId,
  queryKey,
}) => {
  const queryClient = useQueryClient();
  const nameRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const { data, isLoading, isError } = useCustomQuery({
    queryKey,
    queryFn: () => categoryService.getAllCategoriesByRestaurantId(restaurantId),
    onError(error) {
      toastifyService.error(error as Error);
    },
  });

  const {
    data: category,
    isLoading: loadingState,
    isError: errorState,
  } = useCustomQuery({
    queryKey: queryKeys.categories.getSingleCategoryById(+selectedCategoryId!),
    queryFn: () => categoryService.getSingleCategoryById(+selectedCategoryId!),
    onError(error) {
      toastifyService.error(error as Error);
    },
    enabled: !!selectedCategoryId,
  });
  console.log(selectedCategoryId);
  const { mutate } = useMutation({
    mutationFn: categoryService.updateCategory,
    onMutate(variables) {
      return updateCategoryCache.updateCategory.onMutate(
        variables,
        queryKey,
        queryClient
      );
    },
    onError(error, _, context) {
      updateCategoryCache.updateCategory.onError(
        error,
        context,
        queryKey,
        queryClient
      );
    },
  });

  function updateCategory(e: FormEvent) {
    e.preventDefault();
    if (!nameRef.current || !descriptionRef.current || !selectedCategoryId)
      return;
    const name = nameRef.current.value;
    const description = descriptionRef.current.value;
    const formData: CategoryForm = { name, description };
    try {
      categorySchema.parse(formData);
    } catch (error) {
      return toastifyService.error(error as Error);
    }
    mutate({ ...formData, restaurantId, id: +selectedCategoryId });
  }

  return (
    <UpdateForm onSubmit={updateCategory}>
      <select
        onChange={(e) => {
          console.log(e.target.value);
          setSelectedCategoryId(e.target.value);
        }}
      >
        <option disabled selected>
          Select Category
        </option>
        {data?.map((c) => (
          <option value={c.id} key={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <Input
        defaultValue={category?.name}
        label="Category Name:"
        type="text"
        ref={nameRef}
      />
      <Input
        defaultValue={category?.description || undefined}
        label="Desctiption:"
        type="text"
        ref={descriptionRef}
      />
      <Button type="submit" size={"formBtn"} variant={"primary"}>
        Update
      </Button>
    </UpdateForm>
  );
};

export default UpdateCategory;
