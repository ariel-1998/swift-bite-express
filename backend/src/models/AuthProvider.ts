import { z } from "zod";

export const authProvider = z.object({
  id: z.number(),
  provider: z.literal("google").or(z.literal("facebook")), //sql enum google | facebook
  providerUserId: z.string(), //sql varchar, unique
});

export type AuthProvider = z.infer<typeof authProvider>;
