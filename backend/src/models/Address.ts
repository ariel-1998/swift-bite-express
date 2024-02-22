import { z } from "zod";

export type Address = {
  id: number;
  country: string;
  street: string;
  city: string;
  building: number;
  state: string | undefined | null;
  entrance: string | undefined | null;
  apartment: number | undefined | null;
  longitude: string | number;
  latitude: string | number;
};

export type Coordinates = { longitude: number; latitude: number };

//check how to autocomplete names via google geolocation api
export const addressSchema = z.object({
  country: z
    .string({
      required_error: "Coutry is Required",
      invalid_type_error: "Country Must be string",
    })
    .trim()
    .max(45, "Invalid Country")
    .min(1, "Country is Required")
    .transform((arg) => arg.trim()),

  state: z
    .string({ invalid_type_error: "State is Optional or String" })
    .trim()
    .max(45, "Invalid State")
    .nullable()
    .optional()
    .transform((val) => (val ? val.trim() : null)),

  city: z
    .string({
      invalid_type_error: "City Must be String",
      required_error: "City is Required",
    })
    .trim()
    .max(90, "Invalid City")
    .min(1, "City is required")
    .transform((val) => val.trim()),

  street: z
    .string({
      invalid_type_error: "Street Must be String",
      required_error: "Street is Required",
    })
    .trim()
    .max(90, "Invalid Street")
    .min(1, "Street is required")
    .transform((val) => val.trim()),

  building: z.union(
    [
      z.number().min(1, "Building needs to be greater then 0"),
      z
        .string()
        .refine((arg) => !isNaN(+arg), "Building must be a number")
        .refine(
          (arg) => !isNaN(+arg) && +arg > 0,
          "Building needs to be greater then 0"
        )
        .transform((arg) => +arg),
    ],
    {
      errorMap: () => ({
        message: "Building is Required",
      }),
    }
  ),

  entrance: z
    .union(
      [
        z
          .number()
          .refine((num) => num.toString().length <= 4, "Entrance too long"),
        z.string().trim().max(4, "Entrance too long"),
      ],
      {
        errorMap: () => ({ message: "Entrance should be string or a number" }),
      }
    )
    .nullable()
    .optional()
    .transform((val) => {
      if (!val) return null;
      if (typeof val === "string") {
        return !val.trim() ? null : val.trim();
      }
      return val.toString();
    }),

  apartment: z
    .number({ invalid_type_error: "Entrance is Optional or Number" })
    .nullable()
    .optional()
    .transform((val) => (val ? val : null)),
});

export type AddressSchema = z.infer<typeof addressSchema> & {
  id: number;
  longitude: number | string;
  latitude: number | string;
};
