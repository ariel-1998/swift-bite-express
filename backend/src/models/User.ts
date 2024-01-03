import { z } from "zod";

export const userSchema = z.object({
  id: z.number(), //sql autoIncrement
  authProviderId: z.number().nullable(), //sql default value set to null
  primaryAddressId: z.number().nullable(), //sql default value set to null
  restaurantId: z.number().nullable(), //sql default value set to null
  fullName: z.string(), //sql varchar
  password: z.string().nullable(), //sql varchar
  // email: z.string().email(),
});

export type User = z.infer<typeof userSchema>;
