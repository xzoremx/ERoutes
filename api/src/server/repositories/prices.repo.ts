import { getPool } from "./db";

interface AveragePrice {
  fuel_code: string;
  fuel_name: string;
  avg_price: number;
  min_price: number;
  max_price: number;
  station_count: number;
}

interface PriceTrend {
  month: string;
  fuel_code: string;
  avg_price: number;
}

export async function getAveragePrices(): Promise<AveragePrice[]> {
  const pool = getPool();
  const result = await pool.query<AveragePrice>(`
    SELECT 
      lp.fuel_code,
      lp.fuel_name,
      ROUND(AVG(lp.price)::numeric, 2)::float8 as avg_price,
      ROUND(MIN(lp.price)::numeric, 2)::float8 as min_price,
      ROUND(MAX(lp.price)::numeric, 2)::float8 as max_price,
      COUNT(DISTINCT lp.station_id)::int as station_count
    FROM v_latest_prices lp
    GROUP BY lp.fuel_code, lp.fuel_name
    ORDER BY lp.fuel_code
  `);
  return result.rows;
}

export async function getPriceTrends(monthsBack: number = 12): Promise<PriceTrend[]> {
  const pool = getPool();
  const result = await pool.query<PriceTrend>(`
    SELECT 
      TO_CHAR(p.captured_at, 'YYYY-MM') as month,
      fp.code as fuel_code,
      ROUND(AVG(p.price)::numeric, 2)::float8 as avg_price
    FROM prices p
    JOIN fuel_products fp ON fp.id = p.fuel_product_id
    WHERE p.captured_at >= NOW() - INTERVAL '${monthsBack} months'
      AND fp.active = true
    GROUP BY TO_CHAR(p.captured_at, 'YYYY-MM'), fp.code
    ORDER BY month ASC, fp.code
  `);
  return result.rows;
}

export async function getLastEtlRun() {
  const pool = getPool();
  const result = await pool.query(`
    SELECT * FROM v_last_etl_run LIMIT 1
  `);
  return result.rows[0] || null;
}
