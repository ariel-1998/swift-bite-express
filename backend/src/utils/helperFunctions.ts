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

function rearrangeMenueItemsUser(
  items: MenuItemJoinedWCategory[]
): MenuItemsNestedInCategories[] {
  const data: MenuItemsNestedInCategories[] = [];
  let meintainedObjData: MenuItemsNestedInCategories | undefined = undefined;
  items.forEach(
    (
      { restaurantId, categoryDescription, categoryId, categoryName, ...rest },
      i
    ) => {
      const menuItem: MenuItem = { ...rest, restaurantId };
      if (i === 0 || categoryId !== items[i - 1].categoryId) {
        if (i !== 0 && categoryId !== items[i - 1].categoryId) {
          data.push(meintainedObjData!);
        }
        meintainedObjData = {
          id: categoryId,
          restaurantId,
          description: categoryDescription,
          name: categoryName,
          menuItems: [menuItem],
        };
        if (i === items.length - 1) data.push(meintainedObjData!);
        return;
      }

      meintainedObjData?.menuItems.push(menuItem);
      if (i === items.length - 1) data.push(meintainedObjData!);
    }
  );
  return data;
}

function rearrangeMenueItemsOwner(
  items: MenuItemJoinedWCategory[]
): CategoriesNestedInMenuItem[] {
  const data: CategoriesNestedInMenuItem[] = [];
  let meintainedObjData: CategoriesNestedInMenuItem | undefined = undefined;

  items.forEach(
    (
      {
        restaurantId,
        categoryId,
        categoryDescription,
        categoryName,
        id,
        ...rest
      },
      i
    ) => {
      const category: Partial<Category> = {
        restaurantId,
        id: categoryId,
        description: categoryDescription,
        name: categoryName,
      };

      if (i === 0 || id !== items[i - 1].id) {
        if (i !== 0 && id !== items[i - 1].id) {
          data.push(meintainedObjData!);
        }

        meintainedObjData = {
          id,
          ...rest,
          categories: [],
          restaurantId,
        };
        if (i === items.length - 1) data.push(meintainedObjData!);
        return;
      }
      meintainedObjData?.categories.push(category);
      if (i === items.length - 1) data.push(meintainedObjData!);
    }
  );
  return data;
}

export function rearrangeMenueItems(
  items: MenuItemJoinedWCategory[],
  isOwner: boolean | undefined
) {
  if (isOwner) return rearrangeMenueItemsOwner(items);
  return rearrangeMenueItemsUser(items);
}
