import { QueryClient } from "@tanstack/react-query";
import { CategoriesNestedInMenuItem, MenuItem } from "../../models/MenuItem";
import queryKeys from "../queryKeys";
import { Category } from "../../models/Category";
import {
  FrontError,
  ResponseError,
  toastifyService,
} from "../../services/toastifyService";
import { stringOrNumber } from "@cloudinary/url-gen/types/types";

class UpdateMenuItemCache {
  setSingleItemQueryDataOnClick(queryClient: QueryClient, menuItem: MenuItem) {
    const queryKey = queryKeys.menuItems.getMenuItemById(menuItem.id);
    const data = queryClient.getQueryData<MenuItem>(queryKey);
    if (data) return;
    queryClient.setQueryData<MenuItem>(queryKey, menuItem);
  }
  createMenuItem(queryClient: QueryClient, menuItem: MenuItem) {
    const singleItemKey = queryKeys.menuItems.getMenuItemById(menuItem.id);
    queryClient.setQueryData<MenuItem>(singleItemKey, menuItem);

    const itemsKey = queryKeys.menuItems.getMenuItemsByRestaurantId(
      menuItem.restaurantId
    );
    queryClient.setQueryData<CategoriesNestedInMenuItem[]>(itemsKey, (old) => {
      if (!old) return;
      const nestedItem: CategoriesNestedInMenuItem = {
        ...menuItem,
        categories: [],
      };
      return [...old, nestedItem];
    });
    return { ...menuItem, categories: [] } satisfies CategoriesNestedInMenuItem;
  }

  updateMenuItemApartFromImg = {
    onMutate(queryClient: QueryClient, menuItem: MenuItem) {
      const singleKey = queryKeys.menuItems.getMenuItemById(menuItem.id);
      const singleOldData = queryClient.getQueryData<MenuItem>(singleKey);
      queryClient.setQueryData<MenuItem>(singleKey, menuItem);

      const arrKey = queryKeys.menuItems.getMenuItemsByRestaurantId(
        menuItem.restaurantId
      );
      const oldArrData =
        queryClient.getQueryData<CategoriesNestedInMenuItem[]>(arrKey);
      queryClient.setQueryData<CategoriesNestedInMenuItem[]>(arrKey, (old) => {
        if (!old) return;
        return old.map((item) => {
          if (item.id !== menuItem.id) return item;
          return { ...item, ...menuItem };
        });
      });

      return { singleOldData, oldArrData, menuItem };
    },
    onError<T extends ResponseError | FrontError>(
      error: T,
      context: ReturnType<typeof this.onMutate> | undefined,
      queryClient: QueryClient
    ) {
      toastifyService.error(error);
      if (!context) return;
      const { oldArrData, singleOldData, menuItem } = context;

      const singleKey = queryKeys.menuItems.getMenuItemById(menuItem.id);
      if (singleOldData) {
        queryClient.setQueryData<MenuItem>(singleKey, singleOldData);
      } else {
        queryClient.removeQueries({ exact: true, queryKey: singleKey });
      }

      if (oldArrData) {
        const arrKey = queryKeys.menuItems.getMenuItemsByRestaurantId(
          menuItem.restaurantId
        );
        queryClient.setQueryData<CategoriesNestedInMenuItem[]>(
          arrKey,
          oldArrData
        );
      }
    },
  };

  updateMenuItemImg = {
    onSuccess(queryClient: QueryClient, menuItem: MenuItem) {
      const singleMenuItemKey = queryKeys.menuItems.getMenuItemById(
        menuItem.id
      );
      queryClient.setQueryData<MenuItem>(singleMenuItemKey, menuItem);
      const menuItemsKey = queryKeys.menuItems.getMenuItemsByRestaurantId(
        menuItem.restaurantId
      );
      queryClient.setQueryData<CategoriesNestedInMenuItem[]>(
        menuItemsKey,
        (old) => {
          if (!old) return;
          return old.map((item) => {
            if (item.id !== menuItem.id) return item;
            return { ...item, imgPublicId: menuItem.imgPublicId };
          });
        }
      );
    },
  };

  createMenuItemCategoryRef(
    queryClient: QueryClient,
    restaurantId: number,
    status: number,
    menuItem: CategoriesNestedInMenuItem,
    categories: Category[]
  ) {
    const itemsKey =
      queryKeys.menuItems.getMenuItemsByRestaurantId(restaurantId);
    if (status === 207) {
      queryClient.invalidateQueries({ exact: true, queryKey: itemsKey });
      toastifyService.info(
        "Only some of the categories were attached to the menu items"
      );
    }
    queryClient.setQueryData<CategoriesNestedInMenuItem[]>(itemsKey, (old) => {
      if (!old) return;
      return old.map((mi) => {
        if (mi.id === menuItem.id) {
          const newCategoriesArr: Partial<Category>[] = [
            ...menuItem.categories,
            ...categories,
          ];
          return {
            ...menuItem,
            categories: newCategoriesArr,
          } satisfies CategoriesNestedInMenuItem;
        }
        return mi;
      });
    });
  }

  updateMenuItemCategoryRef = {
    onMutate(
      queryClient: QueryClient,
      menuItem: CategoriesNestedInMenuItem,
      categories: Category[]
    ) {
      const queryKey = queryKeys.menuItems.getMenuItemsByRestaurantId(
        menuItem.restaurantId
      );
      const oldData =
        queryClient.getQueryData<CategoriesNestedInMenuItem[]>(queryKey);
      queryClient.setQueryData<CategoriesNestedInMenuItem[]>(
        queryKey,
        (old) => {
          if (!old) return;
          return old.map((item) => {
            if (item.id !== menuItem.id) return item;
            return { ...item, categories };
          });
        }
      );
      return { oldData, queryKey };
    },

    onSuccess(
      queryClient: QueryClient,
      context: ReturnType<typeof this.onMutate>,
      status: stringOrNumber
    ) {
      const { queryKey } = context;
      if (status === 207) {
        queryClient.invalidateQueries({ exact: true, queryKey });
        toastifyService.info("Only some of the categories were updated");
      }
    },
    onError<T extends ResponseError | FrontError>(
      error: T,
      context: ReturnType<typeof this.onMutate> | undefined,
      queryClient: QueryClient
    ) {
      toastifyService.error(error);
      if (!context) return;
      const { oldData, queryKey } = context;
      if (!oldData) return;
      queryClient.setQueryData<CategoriesNestedInMenuItem[]>(queryKey, oldData);
    },
  };
}

export const updateMenuItemCache = new UpdateMenuItemCache();
