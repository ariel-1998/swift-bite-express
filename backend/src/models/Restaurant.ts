import { z } from "zod";
import { Address } from "./Address";

export type Restaurant = {
  id: number;
  name: string;
  imgPublicId: string | undefined | null;
  logoPublicId: string | undefined | null;
};

export type NestedRestaurantAndAddress = Restaurant & {
  address: Partial<Address>;
};
export type RestaurantJoinedWithAddress = Restaurant &
  Partial<Omit<Address, "id"> & { addressId: number }>;

const accepetedImgMymeTypes = ["jpeg", "png", "bmp", "tiff"];

const publickIdSchema = z
  .string({ invalid_type_error: "image id must be a string" })
  .max(50, "Invalid image id")
  .nullable()
  .optional();

export const restaurantSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name must be a string",
      required_error: "Name is required",
    })
    .trim()
    .max(45, "Name is too long")
    .min(1, "Name is required"),
  imgPublicId: publickIdSchema,
  logoPublicId: publickIdSchema,
});

export const imageSchema = z.object({
  name: z.string(),
  mimetype: z.string({ required_error: "Image Required" }).refine((arg) => {
    if (!arg.startsWith("image")) return false;
    if (!accepetedImgMymeTypes.includes(arg.split("/")[1])) return false;
    return true;
  }, "Must be a regular Image"),
});
