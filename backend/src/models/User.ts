import { z } from "zod";

export enum IsOwner {
  false = 0,
  true = 1,
}
export type User = {
  id: number;
  authProviderId: string | null;
  primaryAddressId: number | null;
  isRestaurantOwner: IsOwner;
  fullName: string;
  password: string | null;
  email: string;
};

export type Credentials = {
  email: string;
  password: string;
};
// export const userSchema = z.object({
//   id: z.number(), //sql autoIncrement
//   authProviderId: z.string().nullable(), //sql default value set to null
//   primaryAddressId: z.number().nullable(), //sql default value set to null
//   isRestaurantOwner: z.nativeEnum(IsOwner),
//   fullName: z.string(), //sql varchar
//   password: z.string().nullable(), //sql varchar
//   email: z.string().email(),
// });
export const userRegistrationSchema = z.object({
  email: z.string().email().max(90, "Email too long"),
  password: z
    .string()
    .trim()
    .min(6, "Password to short (min 6 chars)")
    .max(10, "Password to long (max 10 chars)"),
  fullName: z
    .string()
    .trim()
    .min(2, "Full Name to short (min 2 chars)")
    .max(20, "Full Name to long (max 20 chars)"),
});

// export type User = z.infer<typeof userSchema>;
// export type Credentials = z.infer<typeof userCredentialsSchema>;
export type RegistrationData = z.infer<typeof userRegistrationSchema>;

export type AssertUserInReq<T extends { user?: User }> = T & { user: User };
