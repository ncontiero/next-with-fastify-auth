import { z } from "zod";
import dotenv from "dotenv";

const envVariables = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().url(),

  FRONTEND_TOKEN_CALLBACK_URL: z.string().url(),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
});

// Load environment variables from .env file
dotenv.config();
export const env = envVariables.parse(process.env);
