import dotenv from "dotenv";
import { z } from "zod";

const envVariables = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().url(),
  // Redis
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_USER: z.string(),
  REDIS_PASSWORD: z.string(),

  // API
  BASE_URL: z.string().url().default("http://localhost:3333"),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  APP_NAME: z.string().default("NFWA"),

  FRONTEND_BASE_URL: z.string().url().default("http://localhost:3000"),
  FRONTEND_TOKEN_CALLBACK_URL: z.string().url(),

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
