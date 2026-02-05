-- =============================================
-- Seed 030: Datos simulados (estaciones, precios, ETL)
-- =============================================
-- Objetivo: habilitar dashboard público y endpoints /api/public/*
-- con data mínima para desarrollo/demos.

-- Recomendado: ejecutar antes el seed 010_ (fuel_products, etc.)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM fuel_products WHERE code IN ('GASOHOL_90', 'DIESEL_B5')) THEN
    RAISE EXCEPTION 'Faltan fuel_products (ejecuta primero el seed 010_*.seed.sql)';
  END IF;
END$$;

-- Limpiar datos existentes (para re-ejecución)
TRUNCATE prices, stations, etl_runs RESTART IDENTITY CASCADE;

-- 1) Estaciones simuladas (Lima)
-- Las coordenadas se convierten automáticamente a geom via trigger
INSERT INTO stations (osinergmin_code, name, brand, address, district, province, department, lat, lng) VALUES
  ('SIM-0001', 'Primax Javier Prado', 'PRIMAX', 'Av. Javier Prado Este 1234', 'San Isidro', 'Lima', 'LIMA', -12.0916, -77.0229),
  ('SIM-0002', 'Repsol Angamos', 'REPSOL', 'Av. Angamos Este 900', 'Surquillo', 'Lima', 'LIMA', -12.1162, -77.0159),
  ('SIM-0003', 'Petroperú Canadá', 'PETROPERU', 'Av. Canadá 2100', 'La Victoria', 'Lima', 'LIMA', -12.0767, -77.0112),
  ('SIM-0004', 'Primax Benavides', 'PRIMAX', 'Av. Benavides 1800', 'Miraflores', 'Lima', 'LIMA', -12.1215, -77.0217),
  ('SIM-0005', 'Repsol Universitaria', 'REPSOL', 'Av. Universitaria 2500', 'San Miguel', 'Lima', 'LIMA', -12.0798, -77.0874),
  ('SIM-0006', 'Pecsa La Marina', 'PECSA', 'Av. La Marina 3200', 'San Miguel', 'Lima', 'LIMA', -12.0821, -77.0994),
  ('SIM-0007', 'Petroperú Faucett', 'PETROPERU', 'Av. Elmer Faucett 1200', 'Callao', 'Callao', 'CALLAO', -12.0505, -77.1182),
  ('SIM-0008', 'Primax Túpac Amaru', 'PRIMAX', 'Av. Túpac Amaru 4500', 'Independencia', 'Lima', 'LIMA', -11.9902, -77.0576),
  ('SIM-0009', 'Repsol Próceres', 'REPSOL', 'Av. Próceres 1100', 'San Juan de Lurigancho', 'Lima', 'LIMA', -12.0069, -76.9986),
  ('SIM-0010', 'Pecsa Brasil', 'PECSA', 'Av. Brasil 2100', 'Jesús María', 'Lima', 'LIMA', -12.0724, -77.0487),
  ('SIM-0011', 'Petroperú Panamericana Sur', 'PETROPERU', 'Panamericana Sur Km 18', 'Villa El Salvador', 'Lima', 'LIMA', -12.2097, -76.9446),
  ('SIM-0012', 'Primax Arequipa', 'PRIMAX', 'Av. Arequipa 4100', 'Lince', 'Lima', 'LIMA', -12.0999, -77.0329);

-- 2) Historial de precios simulado (últimos 12 meses)
WITH fuels AS (
  SELECT id, code
  FROM fuel_products
  WHERE code IN ('GASOHOL_90', 'DIESEL_B5')
),
months AS (
  SELECT generate_series(
    date_trunc('month', now()) - interval '11 months',
    date_trunc('month', now()),
    interval '1 month'
  ) AS month_start
)
INSERT INTO prices (station_id, fuel_product_id, price, captured_at)
SELECT
  s.id,
  f.id,
  ROUND((
    CASE f.code
      WHEN 'GASOHOL_90' THEN 15.20
      WHEN 'DIESEL_B5' THEN 14.10
      ELSE 15.00
    END
    + (s.id * 0.05)
    + ((EXTRACT(MONTH FROM m.month_start) - 6) * 0.04)
    + (CASE (s.id % 4) WHEN 0 THEN 0.10 WHEN 1 THEN -0.05 WHEN 2 THEN 0.00 ELSE 0.05 END)
  )::numeric, 2) AS price,
  CASE
    WHEN m.month_start = date_trunc('month', now()) THEN (now() - interval '1 hour')
    ELSE (m.month_start + interval '20 days')
  END AS captured_at
FROM stations s
CROSS JOIN fuels f
CROSS JOIN months m
WHERE s.active = true;

-- 3) Registrar última ejecución ETL simulada (para lastUpdate en dashboard)
INSERT INTO etl_runs (source, started_at, finished_at, status, stations_processed, prices_inserted, prices_updated, metadata)
VALUES (
  'seed',
  now() - interval '10 minutes',
  now() - interval '5 minutes',
  'success',
  (SELECT COUNT(*) FROM stations),
  (SELECT COUNT(*) FROM prices),
  0,
  jsonb_build_object('note', 'demo seed data')
);

