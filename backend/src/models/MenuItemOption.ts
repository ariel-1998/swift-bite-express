import { z } from "zod";
import { generateIdSchema } from "./Restaurant";

export type MenuItemOption = {
  id: number; // pk auto increment
  menuItemId: number; //fk to menu_items table
  name: string;
};

export const menuItemOptionsSchema = z.object({
  menuItemId: generateIdSchema("menuItemId"),
  options: z.array(
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
