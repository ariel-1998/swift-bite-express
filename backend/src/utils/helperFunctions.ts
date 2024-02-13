import {
  NestedRestauranAndAddress,
  RestaurantJoinedWithAddress,
} from "../models/Restaurant";

export type ReplaceUndefinedWithNull<T> = T extends undefined
  ? NonNullable<T> | null
  : T;

export function turnUndefinedToNull<
  T extends Record<string, unknown>,
  K extends keyof T
>(
  obj: T,
  ...keys: K[]
): {
  [P in keyof T]: P extends K ? ReplaceUndefinedWithNull<T[P]> : T[P];
} {
  keys.forEach((key) => {
    if (obj[key] === undefined) {
      obj[key] = null as T[K];
    }
  });
  return { ...obj } as {
    [P in keyof T]: P extends K ? ReplaceUndefinedWithNull<T[P]> : T[P];
  };
}

export function rearrangeRestaurantAddressDataArray(
  array: RestaurantJoinedWithAddress[]
): NestedRestauranAndAddress[] {
  const rearrangedData = array.map((item) => {
    const obj: NestedRestauranAndAddress = {
      id: item.id,
      name: item.name,
      imgUrl: item.imgUrl,
      imgPublicId: item.imgPublicId,
      address: {
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
