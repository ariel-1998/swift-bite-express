import { QueryClient } from "@tanstack/react-query";
import {
  CategoriesNestedInMenuItem,
  MenuItem,
  MenuItemWOptions,
} from "../../models/MenuItem";
import queryKeys from "../queryKeys";
import { Category } from "../../models/Category";
import {
  FrontError,
  ResponseError,
  toastifyService,
} from "../../services/toastifyService";
import { stringOrNumber } from "@cloudinary/url-gen/types/types";

class UpdateMenuItemCache {
  setSingleItemQueryDataOnClick(
    queryClient: QueryClient,
    menuItem: MenuItemWOptions
  ) {
    const queryKey = queryKeys.menuItems.getMenuItemById(menuItem.id);
    // const data = queryClient.getQueryData<MenuItemWOptions>(queryKey);
    // if (data) return;
    queryClient.setQueryData<MenuItemWOptions>(queryKey, (old) =>
      old ? menuItem : old
    );
  }
  //for createMenuItem.tsx
  createMenuItem(
    queryClient: QueryClient,
    menuItem: CategoriesNestedInMenuItem
  ) {
    //update single item cache
    const singleItemKey = queryKeys.menuItems.getMenuItemById(menuItem.id);
    queryClient.setQueryData<MenuItem>(singleItemKey, menuItem);

    // update CategoriesNestedInMenuItem cahce
    const itemsKey = queryKeys.menuItems.getMenuItemsByRestaurantId(
      menuItem.restaurantId
    );
    queryClient.setQueryData<CategoriesNestedInMenuItem[]>(itemsKey, (old) => {
      if (!old) return;
      return [...old, menuItem];
    });
    // return { ...menuItem, categories: [] };
  }

  // createMenuItemCategoryRef(
  //   queryClient: QueryClient,
  //   status: number,
  //   restaurantId: number
  // ) {
  //   if (status === 207) {
  //     const itemsKey =
  //       queryKeys.menuItems.getMenuItemsByRestaurantId(restaurantId);
  //     queryClient.invalidateQueries({ exact: true, queryKey: itemsKey });
  //     toastifyService.info(
  //       "Only some of the categories were attached to the menu items"
  //     );
  //   }
  // queryClient.setQueryData<CategoriesNestedInMenuItem[]>(itemsKey, (old) => {
  //   if (!old) return;
  //   return old.map((mi) => {
  //     if (mi.id === menuItem.id) {
  //       return {
  //         ...menuItem,
  //         categories: [...categories],
  //       } satisfies CategoriesNestedInMenuItem;
  //     }
  //     return mi;
  //   });
  // });
  // }

  updateMenuItemApartFromImg = {
    onMutate(queryClient: QueryClient, menuItem: MenuItemWOptions) {
      const singleKey = queryKeys.menuItems.getMenuItemById(menuItem.id);
      const singleOldData =
        queryClient.getQueryData<MenuItemWOptions>(singleKey);
      queryClient.setQueryData<MenuItemWOptions>(singleKey, menuItem);

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
        queryClient.setQueryData<MenuItemWOptions>(singleKey, singleOldData);
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
    onSuccess(queryClient: QueryClient, menuItem: MenuItemWOptions) {
      const singleMenuItemKey = queryKeys.menuItems.getMenuItemById(
        menuItem.id
      );
      queryClient.setQueryData<MenuItemWOptions>(singleMenuItemKey, menuItem);
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
