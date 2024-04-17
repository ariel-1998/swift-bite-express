import { SQLBoolean } from "./SQLBoolean";
import { optionalImageSchema } from "./Restaurant";

import { z } from "zod";
import { Category } from "./Category";
import { checkIfStringIsNum } from "./Address";
import { MenuItemOption } from "./MenuItemOption";

export type MenuItem = {
  id: number;
  restaurantId: number;
  name: string;
  price: number;
  description?: string | null;
  extrasAmount?: number | null;
  drinksAmount?: number | null;
  showSouces: SQLBoolean;
  imgPublicId?: string | null;
};
export type MenuItemWOptions = MenuItem & { options: MenuItemOption[] };

export type MenuItemWCategoryAndOptions = MenuItemWOptions & {
  category: Category | null;
};

//for owners
export type CategoriesNestedInMenuItem = MenuItemWOptions & {
  categories: Category[];
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
  drinksAmount: z.string().refine((val) => {
    if (isNaN(+val)) return false;
    if (+val < 0) return false;
    return true;
  }, "Drinks Amount Required to be a positive number"),
  showSouces: z.nativeEnum(SQLBoolean, {
    errorMap: () => ({ message: "Show souces field is required" }),
  }),
  price: z
    .string()
    .min(1, "Price field is required")
    .refine((arg) => {
      if (!checkIfStringIsNum(arg)) return false;
      if (+arg < 0) return false;
      return true;
    }, "Invalid Price"),
  image: optionalImageSchema,
});

export type MenuItemForm = z.infer<typeof menuItemSchema>;
