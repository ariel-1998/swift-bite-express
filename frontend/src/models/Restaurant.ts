import { z } from "zod";

export type Restaurant = {
  id: number;
  name: string;
  imgUrl: string | undefined | null;
  imgPublicId: string | undefined | null;
};

const accepetedImgMymeTypes = ["jpeg", "png", "bmp", "tiff"];
const imageSchema = z.instanceof(FileList).refine((files) => {
  const file = files[0];
  //image is optional
  if (!file) return true;
  //image type
  if (!file.type.startsWith("image/")) return false;
  //only certain mymeTypes are allowed
  if (!accepetedImgMymeTypes.includes(file.type.split("/")[1])) return false;
  return true;
}, "Must be a regular Image");

export const restaurantSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .max(45, "Name is too long"),
  image: imageSchema,
});
export type RestaurantSchema = z.infer<typeof restaurantSchema>;
/**
 * a table for addressId, restaurantId and userId was created
 * for many to many relationship
 */
