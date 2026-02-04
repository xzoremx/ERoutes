import type { CorsOptions } from "cors";

import { env } from "../app/env";

function parseAllowedOrigins(): string[] {
  if (!env.CORS_ALLOWED_ORIGINS) return [];
  return env.CORS_ALLOWED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean);
}

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (env.NODE_ENV !== "production") return callback(null, true);
    const allowed = parseAllowedOrigins();
    if (!origin) return callback(null, false);
    if (allowed.includes(origin)) return callback(null, true);
    return callback(null, false);
  }
};
