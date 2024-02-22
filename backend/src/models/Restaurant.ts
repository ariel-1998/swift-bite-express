import { z } from "zod";
import { AddressSchema } from "./Address";

export type Restaurant = {
  id: number;
  name: string;
  imgPublicId: string | undefined | null;
  logoPublicId: string | undefined | null;
};

export type NestedRestaurantAndAddress = RestaurantSchema & {
  address: Partial<AddressSchema>;
};
export type RestaurantJoinedWithAddress = RestaurantSchema &
  Partial<Omit<AddressSchema, "id"> & { addressId: number }>;

const accepetedImgMymeTypes = ["jpeg", "png", "bmp", "tiff"];

export const doubleSpaceRegex = /\s{2,}/g;
export const publicIdSchema = z
  .string({ invalid_type_error: "public id must be a string" })
  .max(50, "Invalid public id")
  .nullable()
  .optional()
  .transform((val) => (val ? val : null));

export const restaurantSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name must be a string",
      required_error: "Name is required",
    })
    .trim()
    .max(45, "Name is too long")
    .min(1, "Name is required")
    .transform((val) => val.trim() && val.replace(doubleSpaceRegex, " ")),
  imgPublicId: publicIdSchema,
  logoPublicId: publicIdSchema,
});

export const imageSchema = z.object({
  name: z.string(),
  mimetype: z.string({ required_error: "Image Required" }).refine((arg) => {
    if (!arg.startsWith("image")) return false;
    if (!accepetedImgMymeTypes.includes(arg.split("/")[1])) return false;
    return true;
  }, "Must be a regular Image"),
});

export type RestaurantSchema = z.infer<typeof restaurantSchema> & {
  id: number;
};

export const restaurantIdSchema = generateIdSchema("RestaurantId");

export function generateIdSchema(fieldName: string) {
  return z.union(
    [
      z.number().min(1, `${fieldName} Must be a positive number`),
      z
        .string()
        .refine(
          (arg) => !isNaN(+arg) && +arg > 0,
          `${fieldName} Must be a positive number `
        )
        .transform((val) => +val),
    ],
    {
      errorMap: () => ({
        message: `${fieldName} is Required`,
      }),
    }
  );
}
