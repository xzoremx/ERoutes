import { Router } from "express";

import { getPool } from "../repositories/db";
import { env } from "./env";

export function createHealthRouter(): Router {
  const router = Router();

  router.get("/", async (_req, res) => {
    const payload: Record<string, unknown> = {
      status: "ok",
      timestamp: new Date().toISOString(),
      env: env.NODE_ENV
    };

    if (!env.DATABASE_URL) {
      payload.db = "not_configured";
      return res.status(200).json(payload);
    }

    try {
      const pool = getPool();
      await pool.query("select 1 as ok");
      payload.db = "ok";
      return res.status(200).json(payload);
    } catch (error) {
      payload.db = "error";
      payload.dbError = error instanceof Error ? error.message : String(error);
      return res.status(200).json(payload);
    }
  });

  return router;
}
