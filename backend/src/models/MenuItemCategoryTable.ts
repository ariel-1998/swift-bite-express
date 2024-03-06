import { z } from "zod";

export type MenuItemCategoryTable = {
  menuItemId: number; //refers to MenuItem //pk
  categoryId: number; //refers to Category //pk
  restaurantId: number; //refers to restaurant
};

export const menuItemCategoryTableSchema = z.array(
  z.union(
    [
      z.number().min(0, `Invalid Category ID`),
      z
        .string()
        .refine((str) => !isNaN(+str), `Category ID extpected to be a number`)
        .refine((str) => +str < 0, `Invalid Category ID`)
        .transform((str) => +str),
    ],
    { errorMap: () => ({ message: `Category ID array is Required` }) }
  )
);
