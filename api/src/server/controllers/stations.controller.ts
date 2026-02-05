import type { Request, Response, NextFunction } from "express";
import { listStations } from "../services/stations.service";

export async function getStations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { origin, radiusKm, fuelProduct } = req.query;

    const stations = await listStations({
      origin: origin as string | undefined,
      radiusKm: radiusKm ? parseFloat(radiusKm as string) : undefined,
      fuelProduct: fuelProduct as string | undefined,
    });

    res.status(200).json({ success: true, data: stations });
  } catch (error) {
    next(error);
  }
}
