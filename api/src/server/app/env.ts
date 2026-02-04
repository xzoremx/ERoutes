import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().min(1).optional(),
  OSRM_BASE_URL: z.string().url().default("https://router.project-osrm.org"),
  OSINERGMIN_DATA_URL: z.string().min(1).optional(),
  OSINERGMIN_REGION_FILTER: z.string().min(1).optional(),
  CORS_ALLOWED_ORIGINS: z.string().min(1).optional(),
  LOG_LEVEL: z.string().min(1).default("info"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100)
});

export type Env = z.infer<typeof envSchema>;
export const env: Env = envSchema.parse(process.env);
