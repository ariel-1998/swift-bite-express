import { z } from "zod";

export type MenuItemOption = {
  id: number;
  menuItemId: number;
  name: string;
};

export const optionSchema = z
  .string({
    invalid_type_error: "Name must be a string",
    required_error: "Name is required",
  })
  .trim()
  .min(2, "Name too short")
  .max(20, "Name can be up to 20 chars");
