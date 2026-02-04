import { Pool } from "pg";

import { env } from "../app/env";

let pool: Pool | undefined;

function isRemoteDatabase(databaseUrl: string): boolean {
  const lowered = databaseUrl.toLowerCase();
  return !lowered.includes("localhost") && !lowered.includes("127.0.0.1");
}

function removeSSLModeFromUrl(url: string): string {
  // Remove sslmode param to avoid conflicts with programmatic SSL config
  return url.replace(/[?&]sslmode=[^&]*/gi, "").replace(/\?&/, "?").replace(/\?$/, "");
}

export function getPool(): Pool {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!pool) {
    const isRemote = isRemoteDatabase(env.DATABASE_URL);
    const connectionString = isRemote ? removeSSLModeFromUrl(env.DATABASE_URL) : env.DATABASE_URL;

    pool = new Pool({
      connectionString,
      ssl: isRemote ? { rejectUnauthorized: false } : false
    });
  }

  return pool;
}
