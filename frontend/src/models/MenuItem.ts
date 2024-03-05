import { SQLBoolean } from "./SQLBoolean";
import { accepetedImgMymeTypes, optionalImageSchema } from "./Restaurant";

import { z } from "zod";

export type MenuItem = {
  id: number;
  name: string;
  restaurantId: number;
  description?: string | null;
  extrasAmount?: number | null;
  showSouces: SQLBoolean;
  imgPublicId?: string | null;
};

// const imageSchema = z.instanceof(FileList).refine(files => !!files[0], ).refine((files) => {
//   const file = files[0];
//   //image is optional
//   if (!file) return false;
//   //image type
//   if (!file.type.startsWith("image/")) return false;
//   //only certain mymeTypes are allowed
//   if (!accepetedImgMymeTypes.includes(file.type.split("/")[1])) return false;
//   return true;
// }, "Must be a regular Image");
export const menuItemSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .trim()
    .min(2, "Name too short")
    .max(45, "Name too long"),
  description: z
    .string({ invalid_type_error: "Description must be a string" })
    .trim()
    .max(500, "Description too long")
    .nullable()
    .optional(),
  extrasAmount: z.string().refine((val) => {
    if (isNaN(+val)) return false;
    if (+val < 0) return false;
    return true;
  }, "Extra Amount Required to be a positive number"),
  showSouces: z.nativeEnum(SQLBoolean),
  image: optionalImageSchema,
});

export type MenuItemForm = z.infer<typeof menuItemSchema>;
