import { z } from "zod";

export enum Role {
  user = "user",
  owner = "owner",
}
//need to send role in local signup in request
export type User = {
  id: number;
  authProviderId: string | null;
  primaryAddressId: number | null;
  role: Role;
  fullName: string;
  password: string | null;
  email: string;
};

export type Credentials = Pick<RegistrationData, "email" | "password">;

export const noSpacesRegex = /^\S+$/;

export const userRegistrationSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email()
    .max(90, "Email too long"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password to short (min 6 chars)")
    .max(10, "Password to long (max 10 chars)")
    //check if checks for spaces
    .refine((value) => noSpacesRegex.test(value), {
      message: "Password must not contain any spaces",
    }),
  fullName: z
    .string({ required_error: "Full name is required" })
    .trim()
    .min(2, "Full Name to short (min 2 chars)")
    .max(100, "Full Name to long (max 100 chars)")
    .transform((val) => val.trim()),
  role: z
    .nativeEnum(Role)
    .nullable()
    .optional()
    .transform((val) => (!val ? Role.user : val)),
});

export type RegistrationData = z.infer<typeof userRegistrationSchema>;
