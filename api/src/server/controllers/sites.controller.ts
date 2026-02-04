import type { Request, Response } from "express";

import { listSites } from "../services/sites.service";

export async function getSites(_req: Request, res: Response): Promise<void> {
  const sites = await listSites();
  res.status(200).json({ data: sites });
}
