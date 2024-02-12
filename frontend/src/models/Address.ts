import { z } from "zod";

export type Address = {
  id: number;
  country: string;
  state?: string;
  city: string;
  street: string;
  building: number;
  entrance?: string;
  apartment?: number;
  coordinates?: string;
  // longitude: string;
  // latitude: string;
};

//check how to autocomplete names via google geolocation api
export const addressSchema = z.object({
  country: z.string().max(45, "Invalid Country"),
  state: z.string().max(45, "Invalid State").optional(),
  city: z
    .string({ required_error: "City is Required" })
    .max(90, "Invalid City"),
  street: z.string().max(90, "Invalid Street"), //check if need to be longer than 90
  building: z.string().refine(checkIfStringIsNum),
  entrance: z.string().optional(),
  apartment: z
    .string()
    .optional()
    .refine((arg) => {
      if (!arg) return true;
      return checkIfStringIsNum(arg);
    }),
});

export type AddressFormData = z.infer<typeof addressSchema>;

function checkIfStringIsNum(arg: string) {
  return !isNaN(+arg);
}
