-- =============================================
-- Migration 0004: Índices
-- =============================================

-- Índices espaciales GIST (crítico para búsquedas por radio)
CREATE INDEX IF NOT EXISTS idx_stations_geom ON stations USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_sites_geom ON sites USING GIST(geom);

-- Índice para "último precio" por estación + producto (muy usado)
CREATE INDEX IF NOT EXISTS idx_prices_latest
  ON prices(station_id, fuel_product_id, captured_at DESC);

-- Índice por fecha de captura (para queries de precios recientes)
CREATE INDEX IF NOT EXISTS idx_prices_captured_at
  ON prices(captured_at DESC);

-- Índices de filtrado común en stations
CREATE INDEX IF NOT EXISTS idx_stations_department
  ON stations(department)
  WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_stations_active
  ON stations(active);

CREATE INDEX IF NOT EXISTS idx_stations_brand
  ON stations(brand)
  WHERE active = true;

-- Índice para búsqueda por código OSINERGMIN
CREATE INDEX IF NOT EXISTS idx_stations_osinergmin_code
  ON stations(osinergmin_code)
  WHERE osinergmin_code IS NOT NULL;

-- Índices en tablas de catálogo
CREATE INDEX IF NOT EXISTS idx_fuel_products_active
  ON fuel_products(active, display_order);

CREATE INDEX IF NOT EXISTS idx_vehicle_classes_active
  ON vehicle_classes(active, display_order);

-- Índice para sedes activas
CREATE INDEX IF NOT EXISTS idx_sites_active
  ON sites(active);

-- Índice para ETL runs recientes
CREATE INDEX IF NOT EXISTS idx_etl_runs_started
  ON etl_runs(started_at DESC);
