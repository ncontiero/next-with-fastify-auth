import { z } from "zod";
import dotenv from "dotenv";

const envVariables = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().url(),
  BASE_URL: z.string().url().default("http://localhost:3333"),

  FRONTEND_BASE_URL: z.string().url().default("http://localhost:3000"),
  FRONTEND_TOKEN_CALLBACK_URL: z.string().url(),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),

  // SMTP
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_SECURE: z
    .string()
    .transform((v) => v === "true")
    .default("false"),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),
  DEFAULT_FROM_EMAIL: z.string().optional(),
});

// Load environment variables from .env file
dotenv.config();
export const env = envVariables.parse(process.env);
