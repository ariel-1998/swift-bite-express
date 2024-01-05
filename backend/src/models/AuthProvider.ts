import { z } from "zod";

const providerLiterals = z.literal("google").or(z.literal("facebook"));

export const authProvider = z.object({
  id: z.string(), //merge provider with providerUserId to create unique id
  provider: providerLiterals, //sql enum google | facebook
  providerUserId: z.string(), //sql varchar, unique
});

export type AuthProvider = z.infer<typeof authProvider>;
export type ProviderLiterals = z.infer<typeof providerLiterals>;
