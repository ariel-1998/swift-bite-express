import { z } from "zod";
import { Address } from "./Address";

export type Restaurant = {
  id: number;
  name: string;
  imgPublicId: string | undefined | null;
  logoPublicId: string | undefined | null;
};

export type NestedRestaurantAndAddress = Restaurant & {
  address: Partial<Omit<Address, "id">>;
};

const accepetedImgMymeTypes = ["jpeg", "png", "bmp", "tiff"];
const optionalImageSchema = z.instanceof(FileList).refine((files) => {
  const file = files[0];
  //image is optional
  if (!file) return true;
  //image type
  if (!file.type.startsWith("image/")) return false;
  //only certain mymeTypes are allowed
  if (!accepetedImgMymeTypes.includes(file.type.split("/")[1])) return false;
  return true;
}, "Must be a regular Image");

const restaurantNameSchame = z
  .string({
    required_error: "Name is required",
  })
  .max(45, "Name is too long")
  .min(1, "Name is required");

export const restaurantSchema = z.object({
  name: restaurantNameSchame,
  image: optionalImageSchema,
  logoImage: optionalImageSchema,
});

export const updateRestaurantSchema = z.object({
  name: restaurantNameSchame.optional(),
  image: optionalImageSchema,
  logoImage: optionalImageSchema,
});

export type RestaurantSchema = z.infer<typeof restaurantSchema>;
export type UpdateRestaurantSchema = z.infer<typeof updateRestaurantSchema>;
