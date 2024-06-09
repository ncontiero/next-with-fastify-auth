import { z } from "zod";

const envVariables = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3333),
});

export const env = envVariables.parse(process.env);
