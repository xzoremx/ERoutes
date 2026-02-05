import { findStations, findStationsNearby, StationRow } from "../repositories/stations.repo";

export type Station = StationRow;

export interface ListStationsParams {
  origin?: string;       // "lat,lng"
  radiusKm?: number;
  fuelProduct?: string;
}

export async function listStations(params?: ListStationsParams): Promise<Station[]> {
  // Si hay origin, hacer búsqueda espacial
  if (params?.origin) {
    const [latStr, lngStr] = params.origin.split(",");
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if (isNaN(lat) || isNaN(lng)) {
      return findStations();
    }

    const radius = params.radiusKm ?? 15;
    return findStationsNearby(lat, lng, radius);
  }

  return findStations();
}
