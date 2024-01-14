import { z } from "zod";

export type Address = {
  id: number;
  country: string;
  state: string | null;
  street: string;
  building: number;
  entrance?: string;
  apartment?: number;
  coordinates: string;
  // longitude: string;
  // latitude: string;
};
//no foreign keys

//check how to autocomplete names via google geolocation api
export const addressSchema = z.object({
  country: z.string().max(45, "Invalid Country"),
  state: z.string().max(45, "Invalid State").nullable(),
  street: z.string().max(90, "Invalid Street"), //check if need to be longer than 90
  building: z.number(),
  entrance: z.string().nullable().optional(),
  apartment: z.number().nullable().optional(),
  coordinates: z.string({ required_error: "Address NOT Found!" }), //if coords are not found so is the location
});
