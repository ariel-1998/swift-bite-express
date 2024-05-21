import { QueryClient } from "@tanstack/react-query";
import {
  CategoriesNestedInMenuItem,
  MenuItem,
  MenuItemWPreparationStyles,
} from "../../models/MenuItem";
import queryKeys from "../queryKeys";
import { Category } from "../../models/Category";
import {
  FrontError,
  ResponseError,
  toastifyService,
} from "../../services/toastifyService";
import { MenuItemPreparationStyle } from "../../models/MenuItemPreparationStyle";

class UpdateMenuItemCache {
  setSingleItemQueryDataOnClick(
    queryClient: QueryClient,
    menuItem: MenuItemWPreparationStyles
  ) {
    const queryKey = queryKeys.menuItems.getMenuItemById(menuItem.id);
    queryClient.setQueryData<MenuItemWPreparationStyles>(queryKey, (old) => {
      if (old) return;
      return menuItem;
    });
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
  }

  updateMenuItemApartFromImg = {
    onMutate(queryClient: QueryClient, menuItem: MenuItemWPreparationStyles) {
      const singleKey = queryKeys.menuItems.getMenuItemById(menuItem.id);
      const singleOldData =
        queryClient.getQueryData<MenuItemWPreparationStyles>(singleKey);
      queryClient.setQueryData<MenuItemWPreparationStyles>(singleKey, menuItem);

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
        queryClient.setQueryData<MenuItemWPreparationStyles>(
          singleKey,
          singleOldData
        );
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
    onSuccess(queryClient: QueryClient, menuItem: MenuItemWPreparationStyles) {
      const singleMenuItemKey = queryKeys.menuItems.getMenuItemById(
        menuItem.id
      );
      queryClient.setQueryData<MenuItemWPreparationStyles>(
        singleMenuItemKey,
        menuItem
      );
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

  //updating only the menuitems array and not every single item there is no need for that
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

  updateMenuItemPreparation = {
    createPreparationStyles: {
      onSucsess(
        queryClient: QueryClient,
        menuItemId: number,
        restaurantId: number,
        preparationStyles: MenuItemPreparationStyle[]
      ) {
        const singleItemKey = queryKeys.menuItems.getMenuItemById(menuItemId);
        queryClient.setQueryData<MenuItemWPreparationStyles>(
          singleItemKey,
          (old) => {
            if (!old) return;
            return { ...old, preparationStyles };
          }
        );

        const itemsArrKey =
          queryKeys.menuItems.getMenuItemsByRestaurantId(restaurantId);
        queryClient.setQueryData<CategoriesNestedInMenuItem[]>(
          itemsArrKey,
          (old) => {
            if (!old) return;
            return old.map((mi) => {
              if (mi.id !== menuItemId) return mi;
              return { ...mi, preparationStyles };
            });
          }
        );
      },
    },
    deletePreparationStyle: {
      onMutate(
        queryClient: QueryClient,
        menuItemId: number,
        restaurantId: number,
        preparationStyleId: number
      ) {
        //update single menuItem cache and returning the old data incase of an error
        const singleItemKey = queryKeys.menuItems.getMenuItemById(menuItemId);
        const oldSingleItem =
          queryClient.getQueryData<MenuItemWPreparationStyles>(singleItemKey);
        queryClient.setQueryData<MenuItemWPreparationStyles>(
          singleItemKey,
          (old) => {
            if (!old) return;
            const newStyles = old.preparationStyles.filter(
              (sty) => sty.id !== preparationStyleId
            );
            return { ...old, preparationStyles: newStyles };
          }
        );

        //update menuItem list cache and storing the old data incase of an error
        const itemsArrKey =
          queryKeys.menuItems.getMenuItemsByRestaurantId(restaurantId);
        const oldItemsArr =
          queryClient.getQueryData<CategoriesNestedInMenuItem[]>(itemsArrKey);

        queryClient.setQueryData<CategoriesNestedInMenuItem[]>(
          itemsArrKey,
          (old) => {
            if (!old) return;
            return old.map((mi) => {
              if (mi.id !== menuItemId) return mi;
              return {
                ...mi,
                preparationStyles: mi.preparationStyles.filter(
                  (sty) => sty.id !== preparationStyleId
                ),
              };
            });
          }
        );
        //return the keys and old data incase of an error
        return { singleItemKey, oldSingleItem, itemsArrKey, oldItemsArr };
      },
      onError<T extends ResponseError | FrontError>(
        error: T,
        context: ReturnType<typeof this.onMutate> | undefined,
        queryClient: QueryClient
      ) {
        toastifyService.error(error);
        if (!context) return;
        const { itemsArrKey, oldItemsArr, oldSingleItem, singleItemKey } =
          context;
        //revert singleItem cache
        queryClient.setQueryData<MenuItemWPreparationStyles>(
          singleItemKey,
          oldSingleItem
        );
        //revert itemsArr cache
        queryClient.setQueryData<CategoriesNestedInMenuItem[]>(
          itemsArrKey,
          oldItemsArr
        );
      },
    },
  };
}
export const updateMenuItemCache = new UpdateMenuItemCache();
