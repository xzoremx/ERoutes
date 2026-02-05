import { getPool } from "./db";

export async function countActiveStations(): Promise<number> {
  const pool = getPool();
  const result = await pool.query<{ count: string }>(`
    SELECT COUNT(*)::text as count FROM stations WHERE active = true
  `);
  return parseInt(result.rows[0]?.count || "0", 10);
}

export async function findStations(): Promise<unknown[]> {
  const pool = getPool();
  const result = await pool.query(`
    SELECT * FROM v_stations_with_prices LIMIT 100
  `);
  return result.rows;
}
