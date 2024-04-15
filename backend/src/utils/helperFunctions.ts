import { Category } from "../models/Category";
import {
  CategoriesNestedInMenuItem,
  MenuItem,
  MenuItemJoinedWCategory,
  MenuItemsNestedInCategories,
} from "../models/MenuItem";
import {
  NestedRestaurantAndAddress,
  RestaurantJoinedWithAddress,
} from "../models/Restaurant";

export type TurnUndefinedToNullInObj<T> = {
  [P in keyof T]: ReplaceUndefinedWithNull<T[P]>;
};

export type ReplaceUndefinedWithNull<T> = T extends undefined
  ? NonNullable<T> | null
  : T;

export function turnUndefinedToNull<
  T extends Record<string, unknown>,
  K extends keyof T
>(obj: T, ...keys: K[]): TurnUndefinedToNullInObj<T> {
  keys.forEach((key) => {
    if (obj[key] === undefined) {
      obj[key] = null as T[K];
    }
  });
  return { ...obj } as TurnUndefinedToNullInObj<T>;
}

export function rearrangeRestaurantAddressDataArray(
  array: RestaurantJoinedWithAddress[]
): NestedRestaurantAndAddress[] {
  const rearrangedData = array.map((item) => {
    const obj: NestedRestaurantAndAddress = {
      id: item.id,
      name: item.name,
      imgPublicId: item.imgPublicId,
      logoPublicId: item.logoPublicId,
      address: {
        id: item.addressId,
        apartment: item.apartment,
        building: item.building,
        city: item.city,
        longitude: item.longitude,
        latitude: item.latitude,
        country: item.country,
        entrance: item.entrance,
        state: item.state,
        street: item.street,
      },
    };
    return obj;
  });
  return rearrangedData;
}

function rearrangeMenuItemsUser(
  items: MenuItemJoinedWCategory[]
): MenuItemsNestedInCategories[] {
  let i = 0;
  const arrangedData: MenuItemsNestedInCategories[] = [];
  let currentJ: MenuItemsNestedInCategories | undefined = undefined;

  while (i < items.length) {
    const currentI = items[i];
    const item: MenuItem = {
      id: currentI.id,
      description: currentI.description,
      extrasAmount: currentI.extrasAmount,
      imgPublicId: currentI.imgPublicId,
      name: currentI.name,
      restaurantId: currentI.restaurantId,
      showSouces: currentI.showSouces,
      drinksAmount: currentI.drinksAmount,
      price: currentI.price,
    };

    if (currentI.categoryId !== currentJ?.id) {
      const currentItem: MenuItemsNestedInCategories = {
        id: currentI.categoryId,
        name: currentI.categoryName,
        description: currentI.categoryDescription,
        restaurantId: currentI.restaurantId,
        menuItems: [item],
      };
      currentJ = currentItem;
      arrangedData.push(currentItem);
    } else currentJ?.menuItems.push(item);
    i++;
  }
  return arrangedData;
}

function rearrangeMenuItemsOwner(
  items: MenuItemJoinedWCategory[]
): CategoriesNestedInMenuItem[] {
  let i = 0;
  // let j = 0;
  const arrangedItems: CategoriesNestedInMenuItem[] = [];
  // let lastItem: CategoriesNestedInMenuItem | null = null;
  let currentJ: CategoriesNestedInMenuItem | undefined = undefined;
  while (i < items.length) {
    const currentI = items[i];
    const category: Partial<Category> = {
      id: currentI.categoryId,
      description: currentI.categoryDescription,
      name: currentI.categoryName,
      restaurantId: currentI.restaurantId,
    };
    if (currentI.id !== currentJ?.id) {
      const currentItem: CategoriesNestedInMenuItem = {
        id: currentI.id,
        restaurantId: currentI.restaurantId,
        description: currentI.description,
        name: currentI.name,
        extrasAmount: currentI.extrasAmount,
        imgPublicId: currentI.imgPublicId,
        showSouces: currentI.showSouces,
        drinksAmount: currentI.drinksAmount,
        price: currentI.price,
        categories: category.id ? [category] : [],
      };
      currentJ = currentItem;
      arrangedItems.push(currentItem);
    } else currentJ.categories.push(category);
    i++;
  }
  return arrangedItems;
}

export function rearrangeMenueItems(
  items: MenuItemJoinedWCategory[],
  isOwner: boolean | undefined
) {
  if (isOwner) return rearrangeMenuItemsOwner(items);
  return rearrangeMenuItemsUser(items);
}
