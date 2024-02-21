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
