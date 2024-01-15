import { z } from "zod";

// export type AddressOptionals =["state"]
export type Address = {
  id: number;
  country: string;
  street: string;
  city: string;
  building: number;
  state: string | undefined | null;
  entrance: string | undefined | null;
  apartment: number | undefined | null;
  coordinates: string;
};
//no foreign keys

//check how to autocomplete names via google geolocation api
export const addressSchema = z.object({
  country: z
    .string({
      required_error: "Coutry is Required",
      invalid_type_error: "Country Must be string",
    })
    .max(45, "Invalid Country"),
  state: z
    .string({ invalid_type_error: "State is Optional or String" })
    .max(45, "Invalid State")
    .nullable()
    .optional(),
  city: z
    .string({
      invalid_type_error: "City Must be String",
      required_error: "City is Required",
    })
    .max(90, "Invalid City"),
  street: z
    .string({
      invalid_type_error: "Street Must be String",
      required_error: "Street is Required",
    })
    .max(90, "Invalid Street"), //check if need to be longer than 90
  building: z.number({
    invalid_type_error: "Building Must be Number",
    required_error: "Building is Required",
  }),
  entrance: z
    .string({ invalid_type_error: "Entrance is Optional or String" })
    .nullable()
    .optional(),
  apartment: z
    .number({ invalid_type_error: "Entrance is Optional or Number" })
    .nullable()
    .optional(),
  coordinates: z.string({ required_error: "Address NOT Found!" }), //if coords are not found so is the location
});

export type AddressSchema = z.infer<typeof addressSchema>;
