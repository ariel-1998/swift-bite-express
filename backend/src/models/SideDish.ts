import { z } from "zod";
import { restaurantIdSchema } from "./Restaurant";

export type SideDish = {
  id: number;
  restaurantId: number; //refres to restaurant
  name: string;
  extraPrice: number | undefined | null;
  type: "drink" | "sideDish";
};

export const SideDishSchema = z.object({
  restaurantId: restaurantIdSchema,
  name: z
    .string({
      invalid_type_error: "Name must be a string",
      required_error: "Name is Required",
    })
    .trim()
    .min(2, "Name too short")
    .max(45, "Name too long")
    .transform((val) => val.trim()),
  //vheck what about require error
  type: z
    .literal("drink", {
      errorMap: () => ({ message: "Type must be drink or extra" }),
    })
    .or(
      z.literal("extra", { invalid_type_error: "Type must be drink or extra" })
    ),
  extraPrice: z
    .union([
      z.number(),
      z.string().refine((val) => !isNaN(+val), "extraPrice must be a number"),
    ])
    .nullable()
    .optional()
    .transform((val) => {
      if (!val) return null;
      if (typeof val === "string") {
        return !val.trim() ? null : +val;
      }
      return val;
    }),
});

// type ExtraSchema = z.infer<typeof SideDishSchema> & { id: number };
