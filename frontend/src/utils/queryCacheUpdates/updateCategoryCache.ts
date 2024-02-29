import { QueryClient, QueryKey } from "@tanstack/react-query";
import { Category } from "../../models/Category";
import {
  FrontError,
  ResponseError,
  toastifyService,
} from "../../services/toastifyService";
import queryKeys from "../queryKeys";

const generateTempId = () => Date.now() + 0.5;

function getCategoryArray(queryKey: QueryKey, queryClient: QueryClient) {
  const oldData = queryClient.getQueryData<Category[]>(queryKey);
  return oldData;
}

function addCategoryToArr(
  queryClient: QueryClient,
  queryKey: QueryKey,
  category?: Category,
  oldData?: Category[]
) {
  queryClient.setQueryData<Category[]>(queryKey, (old) => {
    if (!old) return;
    if (oldData && category) return [...oldData, category];
    if (oldData) return [...oldData];
    if (category) [...old, category];
    return old;
  });
}

function updateSingleCategory(category: Category, queryClient: QueryClient) {
  const key = queryKeys.categories.getSingleCategoryById(category.id);
  queryClient.setQueryData<Category>(key, category);
}
function getSingleCategory(category: Category, queryClient: QueryClient) {
  const key = queryKeys.categories.getSingleCategoryById(category.id);
  const oldData = queryClient.getQueryData<Category>(key);
  return oldData;
}

function invalidateSingleTempCacheQuery(
  queryClient: QueryClient,
  oldId: number
) {
  const queryKey = queryKeys.categories.getSingleCategoryById(oldId);
  queryClient.invalidateQueries({ exact: true, queryKey });
}

function updateCategoryInArr(
  queryClient: QueryClient,
  queryKey: QueryKey,
  category: Category
) {
  queryClient.setQueryData<Category[]>(queryKey, (oldData) => {
    if (!oldData) return;
    return oldData.map((c) => (c.id === category.id ? category : c));
  });
}

class UpdateCategoryCache {
  addCategory = {
    onMutate(
      category: Omit<Category, "id">,
      queryKey: QueryKey,
      queryClient: QueryClient
    ) {
      const tempId = generateTempId();
      const tempCategory: Category = { ...category, id: tempId };
      const oldCategoryArr = getCategoryArray(queryKey, queryClient);
      if (oldCategoryArr) {
        addCategoryToArr(queryClient, queryKey, tempCategory);
      }
      updateSingleCategory(tempCategory, queryClient);
      return { oldCategoryArr, tempCategory };
    },

    //maybe try and delete from cache permenantly instead of invalidate
    onSuccess(
      data: Category,
      context: ReturnType<typeof this.onMutate>,
      queryKey: QueryKey,
      queryClient: QueryClient
    ) {
      const { oldCategoryArr, tempCategory } = context;
      invalidateSingleTempCacheQuery(queryClient, tempCategory.id);
      updateSingleCategory(data, queryClient);
      addCategoryToArr(queryClient, queryKey, data, oldCategoryArr);
    },
    onError<T extends ResponseError | FrontError>(
      error: T,
      context: ReturnType<typeof this.onMutate> | undefined,
      queryKey: QueryKey,
      queryClient: QueryClient
    ) {
      toastifyService.error(error);
      if (!context) return;
      const { oldCategoryArr, tempCategory } = context;
      addCategoryToArr(queryClient, queryKey, undefined, oldCategoryArr);
      ///////////////need to check if can delete intirely from cache
      invalidateSingleTempCacheQuery(queryClient, tempCategory.id);
    },
  };

  updateCategory = {
    onMutate(category: Category, queryKey: QueryKey, queryClient: QueryClient) {
      const oldArr = getCategoryArray(queryKey, queryClient);
      if (oldArr) {
        updateCategoryInArr(queryClient, queryKey, category);
      }
      const oldSingleCategoty = getSingleCategory(category, queryClient);
      updateSingleCategory(category, queryClient);

      return { oldSingleCategoty, oldArr };
    },

    onError<T extends ResponseError | FrontError>(
      error: T,
      context: ReturnType<typeof this.onMutate> | undefined,
      queryKey: QueryKey,
      queryClient: QueryClient
    ) {
      toastifyService.error(error);
      if (!context) return;
      const { oldArr, oldSingleCategoty } = context;
      if (oldArr) {
        addCategoryToArr(queryClient, queryKey, undefined, oldArr);
      }
      if (oldSingleCategoty) {
        updateSingleCategory(oldSingleCategoty, queryClient);
      }
    },
  };

  deleteCategory = {
    onMutate() {},
    onerror() {},
  };
}

export const updateCategoryCache = new UpdateCategoryCache();
