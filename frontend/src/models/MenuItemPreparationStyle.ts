import { z } from "zod";

export type MenuItemPreparationStyle = {
  id: number;
  menuItemId: number;
  name: string;
};

export const preparationStyleSchema = z
  .string({
    invalid_type_error: "Name must be a string",
    required_error: "Name is required",
  })
  .trim()
  .min(2, "Name too short")
  .max(20, "Name can be up to 20 chars");
