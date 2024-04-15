import { z } from "zod";
import {
  generateIdSchema,
  publicIdSchema,
  restaurantIdSchema,
} from "./Restaurant";
import { SQLBoolean } from "./SQLBoolean";
import { Category } from "./Category";

export type MenuItem = {
  id: number;
  name: string;
  restaurantId: number; //refers to restaurants
  description: string | undefined | null;
  extrasAmount: number | undefined | null;
  drinksAmount: number | undefined | null;
  showSouces: SQLBoolean;
  imgPublicId: string | undefined | null;
  price: number;
};

export type MenuItemJoinedWCategory = MenuItem & {
  categoryId?: Category["id"];
  categoryName?: Category["name"];
  categoryDescription?: Category["description"];
};

export type CategoriesNestedInMenuItem = MenuItem & {
  categories: Partial<Category>[];
};

export type MenuItemsNestedInCategories = Partial<Category> & {
  menuItems: MenuItem[];
};

export const menuItemIdSchema = generateIdSchema("MenuItemId");

export const menuItemSchema = z.object({
  restaurantId: restaurantIdSchema,
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .trim()
    .min(2, "Name too short")
    .max(45, "Name too long")
    .transform((val) => val.trim()),
  description: z
    .string({ invalid_type_error: "Description must be a string" })
    .trim()
    .max(500, "Description too long")
    .nullable()
    .optional()
    .transform((val) => (!val?.trim() ? null : val.trim())),
  extrasAmount: z
    .union(
      [
        z.number().min(0, "Extras Amount must be a positive number"),
        z
          .string()
          .refine(
            (val) => !isNaN(+val) && +val >= 0,
            "Extras Amount must be 0 or more"
          )
          .transform((arg) => +arg),
      ],
      { errorMap: () => ({ message: "Extras Amount must be a number" }) }
    )
    .optional()
    .transform((arg) => arg ?? 0),
  drinksAmount: z
    .union(
      [
        z.number().min(0, "Drinks Amount must be a positive number"),
        z
          .string()
          .refine(
            (val) => !isNaN(+val) && +val >= 0,
            "Drinks Amount must be 0 or more"
          )
          .transform((arg) => +arg),
      ],
      { errorMap: () => ({ message: "Drinks Amount must be a number" }) }
    )
    .optional()
    .transform((arg) => arg ?? 0),
  price: z.union(
    [
      z.number().min(0, "Invalid Price"),
      z
        .string()
        .refine((arg) => !isNaN(+arg) && +arg > 0, "Invalid Price")
        .transform((arg) => +arg),
    ],
    { errorMap: () => ({ message: "Invalid Price" }) }
  ),
  //check if correctly implemented
  showSouces: z.nativeEnum(SQLBoolean),
  imgPublicId: publicIdSchema,
});
