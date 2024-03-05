import { z } from "zod";

export type MenuItemCategoryTable = {
  menuItemId: number; //refers to MenuItem //pk
  categoryId: number; //refers to Category //pk
  restaurantId: number; //refers to restaurant
};

function generateMenuItemCategoryField(fieldName: keyof MenuItemCategoryTable) {
  const menuItemCategoryField = z.union(
    [
      z.number().min(0, `Invalid ${fieldName}`),
      z
        .string()
        .refine((str) => !isNaN(+str), `${fieldName} extpected to be a number`)
        .refine((str) => +str < 0, `Invalid ${fieldName}`)
        .transform((str) => +str),
    ],
    { errorMap: () => ({ message: `${fieldName} is Required` }) }
  );
  return menuItemCategoryField;
}

export const menuItemCategoryTableSchema = z.array(
  generateMenuItemCategoryField("menuItemId")
);
