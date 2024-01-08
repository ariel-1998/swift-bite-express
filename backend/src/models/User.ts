import { z } from "zod";

export enum IsOwner {
  false = 0,
  true = 1,
}

export const userSchema = z.object({
  id: z.number(), //sql autoIncrement
  authProviderId: z.string().nullable(), //sql default value set to null
  primaryAddressId: z.number().nullable(), //sql default value set to null
  isRestaurantOwner: z.nativeEnum(IsOwner),
  fullName: z.string(), //sql varchar
  password: z.string().nullable(), //sql varchar
  email: z.string().email(),
});

export const userCredentialsSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .trim()
    .min(6, "Password to short (min 6 chars)")
    .max(10, "Password to long (max 10 chars)"),
});

export type User = z.infer<typeof userSchema>;
export type Credentials = z.infer<typeof userCredentialsSchema>;
