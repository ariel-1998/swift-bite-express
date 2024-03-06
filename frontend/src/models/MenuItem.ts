import { SQLBoolean } from "./SQLBoolean";
import { optionalImageSchema } from "./Restaurant";

import { z } from "zod";
import { Category } from "./Category";

export type MenuItem = {
  id: number;
  name: string;
  restaurantId: number;
  description?: string | null;
  extrasAmount?: number | null;
  showSouces: SQLBoolean;
  imgPublicId?: string | null;
};

export type MenuItemJoinedWCategory = MenuItem & {
  categoryId?: Category["id"];
  categoryName?: Category["name"];
  categoryDescription?: Category["description"];
};

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
  showSouces: z.nativeEnum(SQLBoolean, {
    errorMap: () => ({ message: "Show souces field is required" }),
  }),
  image: optionalImageSchema,
});

export type MenuItemForm = z.infer<typeof menuItemSchema>;
