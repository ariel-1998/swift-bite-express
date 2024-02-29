import { QueryClient, QueryKey } from "@tanstack/react-query";
import { Category } from "../../models/Category";
import {
  FrontError,
  ResponseError,
  toastifyService,
} from "../../services/toastifyService";
import queryKeys from "../queryKeys";

const generateTempId = () => Date.now() + 0.5;

class UpdateCategoryCache {
  addCategory = {
    onMutate(
      category: Omit<Category, "id">,
      queryKey: QueryKey,
      queryClient: QueryClient
    ) {
      const tempId = generateTempId();
      const tempCategory: Category = { ...category, id: tempId };
      const oldData = queryClient.getQueryData<Category[]>(queryKey);
      if (!oldData) return;
      queryClient.setQueryData<Category[]>(queryKey, (old) => [
        ...old!,
        tempCategory,
      ]);
      return { tempCategory, oldData };
    },
    onSuccess(
      data: Category,
      context: ReturnType<typeof this.onMutate>,
      queryKey: QueryKey,
      queryClient: QueryClient
    ) {
      queryClient.setQueryData<Category>(
        queryKeys.categories.getSingleCategoryById(data.id),
        data
      );
      if (!context?.oldData) return;
      queryClient.setQueryData<Category[]>(queryKey, () => [
        ...context.oldData,
        data,
      ]);
    },
    onError<T extends ResponseError | FrontError>(
      error: T,
      context: ReturnType<typeof this.onMutate> | undefined,
      queryKey: QueryKey,
      queryClient: QueryClient
    ) {
      toastifyService.error(error);
      if (!context?.oldData) return;
      queryClient.setQueryData<Category[]>(queryKey, () => [
        ...context.oldData,
      ]);
    },
  };

  updateCategory = {
    onMutate(category: Category, queryKey: QueryKey, queryClient: QueryClient) {
      const oldArrayData = queryClient.getQueryData<Category[]>(queryKey);
      if (oldArrayData) {
        queryClient.setQueryData<Category[]>(queryKey, (old) => {
          return old!.map((c) => (c.id === category.id ? category : c));
        });
      }

      const oldSingleCategory = queryClient.getQueryData<Category>(
        queryKeys.categories.getSingleCategoryById(category.id)
      );

      queryClient.setQueryData<Category>(
        queryKeys.categories.getSingleCategoryById(category.id),
        category
      );

      return { oldArrayData, oldSingleCategory };
    },

    onError<T extends ResponseError | FrontError>(
      error: T,
      context: ReturnType<typeof this.onMutate> | undefined,
      queryKey: QueryKey,
      queryClient: QueryClient
    ) {
      toastifyService.error(error);
      if (!context) return;
      if (context.oldSingleCategory) {
        queryClient.setQueryData<Category>(
          queryKeys.categories.getSingleCategoryById(
            context.oldSingleCategory.id
          ),
          context.oldSingleCategory
        );
      }
      queryClient.setQueryData(queryKey, context.oldArrayData);
    },
  };
}

export const updateCategoryCache = new UpdateCategoryCache();
