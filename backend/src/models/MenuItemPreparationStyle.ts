import { z } from "zod";
import { generateIdSchema } from "./Restaurant";

export type MenuItemPreparationStyle = {
  id: number; // pk auto increment
  menuItemId: number; //fk to menu_items table
  name: string;
};

export const menuItemPreparationStyleSchema = z.object({
  menuItemId: generateIdSchema("menuItemId"),
  preparationStyles: z.array(
    z
      .string({
        invalid_type_error: "Name must be a string",
        required_error: "Name is required",
      })
      .trim()
      .min(2, "Name too short")
      .max(20, "Name can be up to 20 chars")
      .transform((val) => val.trim())
  ),
});
