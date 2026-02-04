import type { Request, Response } from "express";

import { recommendStations } from "../services/recommendationEngine.service";

export async function getRecommendations(_req: Request, res: Response): Promise<void> {
  const result = await recommendStations();
  res.status(200).json({ data: result });
}
