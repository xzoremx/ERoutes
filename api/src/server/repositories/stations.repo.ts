import { getPool } from "./db";

export interface StationRow {
  id: number;
  osinergmin_code: string;
  name: string;
  brand: string;
  address: string;
  district: string;
  province: string;
  department: string;
  lat: number;
  lng: number;
  active: boolean;
  prices: Record<string, { price: number; captured_at: string }>;
  distance_km?: number;
}

export async function countActiveStations(): Promise<number> {
  const pool = getPool();
  const result = await pool.query<{ count: string }>(`
    SELECT COUNT(*)::text as count FROM stations WHERE active = true
  `);
  return parseInt(result.rows[0]?.count || "0", 10);
}

export async function findStations(): Promise<StationRow[]> {
  const pool = getPool();
  const result = await pool.query<StationRow>(`
    SELECT id, osinergmin_code, name, brand, address, district, province,
           department, lat::float8 as lat, lng::float8 as lng, active, prices
    FROM v_stations_with_prices
    LIMIT 100
  `);
  return result.rows;
}

export async function findStationsNearby(
  lat: number,
  lng: number,
  radiusKm: number = 15
): Promise<StationRow[]> {
  const pool = getPool();
  const result = await pool.query<StationRow>(
    `SELECT
       id, osinergmin_code, name, brand, address, district, province,
       department, lat::float8 as lat, lng::float8 as lng, active, prices,
       ROUND((ST_Distance(geom, ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography) / 1000)::numeric, 2)::float8 AS distance_km
     FROM v_stations_with_prices
     WHERE ST_DWithin(
       geom,
       ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
       $3 * 1000
     )
     ORDER BY distance_km ASC
     LIMIT 50`,
    [lat, lng, radiusKm]
  );
  return result.rows;
}
