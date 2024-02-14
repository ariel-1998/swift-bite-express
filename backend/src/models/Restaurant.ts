import { z } from "zod";
import { Address } from "./Address";
// import { Address } from "./Address";

export type Restaurant = {
  id: number;
  name: string;
  imgPublicId: string | undefined | null;
};

export type NestedRestauranAndAddress = Restaurant & {
  address: Partial<Omit<Address, "id">>;
};
export type RestaurantJoinedWithAddress = Restaurant &
  Partial<Omit<Address, "id">>;
export const restaurantSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name must be a string",
      required_error: "Name is required",
    })
    .max(45, "Name is too long"),
  imgPublicId: z
    .string({ invalid_type_error: "image id must be a string" })
    .max(20, "Invalid image id")
    .nullable()
    .optional(),
});
/**
 * a table for addressId, restaurantId and userId was created
 * for many to many relationship
 */
