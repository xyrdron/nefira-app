import { z } from "zod";

export const CredentialsLoginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .max(20, { message: "Password too long" })
    .min(4, { message: "Password too short" }),
});
