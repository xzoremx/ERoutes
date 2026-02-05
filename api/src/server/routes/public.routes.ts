import { Router } from "express";
import { getStats, getPriceTrendsHandler } from "../controllers/public.controller";

export const publicRouter = Router();

// GET /api/public/stats - Estadísticas generales públicas
publicRouter.get("/stats", getStats);

// GET /api/public/prices/trends - Evolución de precios
publicRouter.get("/prices/trends", getPriceTrendsHandler);
