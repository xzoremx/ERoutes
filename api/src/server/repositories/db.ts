import { Pool } from "pg";

import { env } from "../app/env";

let pool: Pool | undefined;

function shouldUseSsl(databaseUrl: string): boolean {
  const lowered = databaseUrl.toLowerCase();
  return !lowered.includes("localhost") && !lowered.includes("127.0.0.1");
}

export function getPool(): Pool {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: env.DATABASE_URL,
      ssl: shouldUseSsl(env.DATABASE_URL) ? { rejectUnauthorized: false } : undefined
    });
  }

  return pool;
}
