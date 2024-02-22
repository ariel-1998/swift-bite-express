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
    .min(1, "Country is Required"),
  state: z
    .string({ invalid_type_error: "State is Optional or String" })
    .trim()
    .max(45, "Invalid State")
    .nullable()
    .optional(),
  city: z
    .string({
      invalid_type_error: "City Must be String",
      required_error: "City is Required",
    })
    .trim()
    .max(90, "Invalid City")
    .min(1, "City is required"),
  street: z
    .string({
      invalid_type_error: "Street Must be String",
      required_error: "Street is Required",
    })
    .trim()
    .max(90, "Invalid Street")
    .min(1, "Street is required"),
  building: z.number({
    invalid_type_error: "Building Must be Number",
    required_error: "Building is Required",
  }),
  entrance: z
    .string({ invalid_type_error: "Entrance is Optional or String" })
    .trim()
    .max(4, "Invalid Entrance")
    .nullable()
    .optional(),
  apartment: z
    .number({ invalid_type_error: "Entrance is Optional or Number" })
    .nullable()
    .optional(),
});
