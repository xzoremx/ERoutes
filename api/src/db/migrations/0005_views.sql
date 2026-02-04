-- =============================================
-- Migration 0005: Vistas
-- =============================================

-- Vista: Último precio por estación + producto
-- Usa DISTINCT ON para obtener el registro más reciente
CREATE OR REPLACE VIEW v_latest_prices AS
SELECT DISTINCT ON (p.station_id, p.fuel_product_id)
  p.id AS price_id,
  p.station_id,
  p.fuel_product_id,
  p.price,
  p.captured_at,
  fp.code AS fuel_code,
  fp.name AS fuel_name,
  fp.unit AS fuel_unit
FROM prices p
JOIN fuel_products fp ON fp.id = p.fuel_product_id
WHERE fp.active = true
ORDER BY p.station_id, p.fuel_product_id, p.captured_at DESC;

COMMENT ON VIEW v_latest_prices IS 'Último precio vigente por estación y producto';

-- Vista: Estaciones con sus precios actuales (para listados)
CREATE OR REPLACE VIEW v_stations_with_prices AS
SELECT
  s.id,
  s.osinergmin_code,
  s.name,
  s.brand,
  s.address,
  s.district,
  s.province,
  s.department,
  s.lat,
  s.lng,
  s.geom,
  s.active,
  COALESCE(
    jsonb_object_agg(
      lp.fuel_code,
      jsonb_build_object(
        'price', lp.price,
        'captured_at', lp.captured_at
      )
    ) FILTER (WHERE lp.fuel_code IS NOT NULL),
    '{}'::jsonb
  ) AS prices
FROM stations s
LEFT JOIN v_latest_prices lp ON lp.station_id = s.id
WHERE s.active = true
GROUP BY s.id, s.osinergmin_code, s.name, s.brand, s.address,
         s.district, s.province, s.department, s.lat, s.lng, s.geom, s.active;

COMMENT ON VIEW v_stations_with_prices IS 'Estaciones activas con sus precios actuales en formato JSON';

-- Vista: Resumen de última ejecución ETL
CREATE OR REPLACE VIEW v_last_etl_run AS
SELECT
  id,
  source,
  started_at,
  finished_at,
  status,
  stations_processed,
  prices_inserted,
  prices_updated,
  error_message,
  EXTRACT(EPOCH FROM (finished_at - started_at)) AS duration_seconds
FROM etl_runs
ORDER BY started_at DESC
LIMIT 1;

COMMENT ON VIEW v_last_etl_run IS 'Información de la última ejecución del ETL';
