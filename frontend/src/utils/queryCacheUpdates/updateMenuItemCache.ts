import { QueryClient } from "@tanstack/react-query";
import { MenuItem, MenuItemJoinedWCategory } from "../../models/MenuItem";
import queryKeys from "../queryKeys";
import { Category } from "../../models/Category";

class UpdateMenuItemCache {
  createMenuItem(queryClient: QueryClient, menuItem: MenuItem) {
    const singleItemKey = queryKeys.menuItems.getMenuItemById(menuItem.id);
    queryClient.setQueryData<MenuItem>(singleItemKey, menuItem);
    const itemsKey = queryKeys.menuItems.getMenuItemByRestaurantId(
      menuItem.restaurantId
    );
    const oldArrData =
      queryClient.getQueryData<MenuItemJoinedWCategory[]>(itemsKey);
    queryClient.setQueryData<MenuItemJoinedWCategory[]>(itemsKey, (old) => {
      if (!old) return;
      return [...old, menuItem];
    });
    return oldArrData;
  }

  createMenuItemCategoryRef(
    queryClient: QueryClient,
    oldData: ReturnType<typeof this.createMenuItem>,
    item: MenuItem,
    categories: Category[],
    statusCode: number
  ) {
    if (!oldData) return;
    const itemsKey = queryKeys.menuItems.getMenuItemByRestaurantId(
      item.restaurantId
    );
    if (statusCode === 207) {
      //invalidate if partial was added successfully
      return queryClient.invalidateQueries({ exact: true, queryKey: itemsKey });
    }
    //manualy add data to cache if all was added successfully
    queryClient.setQueryData<MenuItemJoinedWCategory[]>(itemsKey, () => {
      const newItems: MenuItemJoinedWCategory[] = categories.map((c) => {
        return {
          categoryId: c.id,
          categoryName: c.name,
          categoryDescription: c.description,
          ...item,
        };
      });
      return [...oldData, ...newItems];
    });
  }
}

export const updateMenuItemCache = new UpdateMenuItemCache();
