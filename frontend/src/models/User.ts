import { z } from "zod";
export enum Role {
  user = "user",
  owner = "owner",
}

export type User = {
  id: number;
  authProviderId: string | null | undefined;
  primaryAddressId: number | null | undefined;
  role: Role;
  fullName: string;
  email: string;
  password: string | null | undefined;
};
// export const userSchema = z.object({
//   id: z.number(), //sql autoIncrement
//   authProviderId: z.string().nullable(), //sql default value set to null
//   primaryAddressId: z.number().nullable(), //sql default value set to null
//   role: z.nativeEnum(Role),
//   fullName: z.string(), //sql varchar
//   password: z.string().nullable(), //sql varchar
//   email: z.string().email(),
// });

const passwordSchema = z
  .string()
  .trim()
  .min(6, "Password to short (min 6 chars)")
  .max(10, "Password to long (max 10 chars)");

export const userLoginFormSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

export const userRegisterFormSchema = userLoginFormSchema
  .extend({
    confirmPassword: z.string(),
    fullName: z
      .string()
      .trim()
      .min(2, "Full Name to short (min 2 chars)")
      .max(20, "Full Name to long (max 20 chars)"),
    role: z.nativeEnum(Role).optional(),
  })
  .refine(
    ({ password, confirmPassword }) => {
      if (password !== confirmPassword) return false;
      return true;
    },
    { path: ["password"], message: "Passwords do NOT match" }
  );

export type UserCredentials = z.infer<typeof userLoginFormSchema>;
export type UserRegisterForm = z.infer<typeof userRegisterFormSchema>;
