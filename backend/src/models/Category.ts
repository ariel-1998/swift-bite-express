import { z } from "zod";

export type Category = {
  id: number;
  name: string;
  description: string | undefined | null;
  restaurantId: number; //refers to restaurants
};

export const categorySchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name needs to be a string.",
      required_error: "Name is required",
    })
    .trim()
    .min(1)
    .max(45),
  description: z
    .string({ invalid_type_error: "Description needs to be a string." })
    .trim()
    .max(500)
    .optional()
    .nullable(),
  restaurantId: z.number({
    invalid_type_error: "Restaurant id needs to be a number.",
    required_error: "Restaurant id is required",
  }),
});
