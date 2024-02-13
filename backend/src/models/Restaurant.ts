import { z } from "zod";
// import { Address } from "./Address";

export type Restaurant = {
  id: number;
  name: string;
  imgUrl: string | undefined | null;
  imgPublicId: string | undefined | null;
};

export const restaurantSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name must be a string",
      required_error: "Name is required",
    })
    .max(45, "Name is too long"),
  imgUrl: z
    .string({ invalid_type_error: "Name must be a string" })
    .max(500, "Invalid URL")
    .nullable()
    .optional(),
});
/**
 * a table for addressId, restaurantId and userId was created
 * for many to many relationship
 */
