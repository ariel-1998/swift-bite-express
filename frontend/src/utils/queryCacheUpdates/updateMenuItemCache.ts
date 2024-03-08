import { QueryClient } from "@tanstack/react-query";
import { CategoriesNestedInMenuItem, MenuItem } from "../../models/MenuItem";
import queryKeys from "../queryKeys";
import { Category } from "../../models/Category";
import { toastifyService } from "../../services/toastifyService";

class UpdateMenuItemCache {
  createMenuItem(queryClient: QueryClient, menuItem: MenuItem) {
    const singleItemKey = queryKeys.menuItems.getMenuItemById(menuItem.id);
    queryClient.setQueryData<MenuItem>(singleItemKey, menuItem);
    const itemsKey = queryKeys.menuItems.getMenuItemByRestaurantId(
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
      queryKeys.menuItems.getMenuItemByRestaurantId(restaurantId);
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
}

export const updateMenuItemCache = new UpdateMenuItemCache();
