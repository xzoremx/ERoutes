import type { Request, Response } from "express";

import { listStations } from "../services/stations.service";

export async function getStations(_req: Request, res: Response): Promise<void> {
  const stations = await listStations();
  res.status(200).json({ data: stations });
}
