import { QueryClient } from "@tanstack/react-query";
import { CategoriesNestedInMenuItem, MenuItem } from "../../models/MenuItem";
import queryKeys from "../queryKeys";
import { Category } from "../../models/Category";
import {
  FrontError,
  ResponseError,
  toastifyService,
} from "../../services/toastifyService";

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
}

export const updateMenuItemCache = new UpdateMenuItemCache();
