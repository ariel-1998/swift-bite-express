import { z } from "zod";
import { restaurantIdSchema } from "./Restaurant";

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
    .max(45)
    .transform((val) => val.trim()),
  description: z
    .string({ invalid_type_error: "Description needs to be a string." })
    .trim()
    .max(500)
    .optional()
    .nullable()
    .transform((val) => (val ? val.trim() : null)),
  restaurantId: restaurantIdSchema.transform((val) =>
    typeof val === "string" ? +val : val
  ),
});

export type CategorySchema = z.infer<typeof categorySchema> & { id: number };
