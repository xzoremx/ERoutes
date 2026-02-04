-- =============================================
-- Migration 0003: Tablas Core
-- =============================================

-- 1. Catálogo de productos de combustible
CREATE TABLE IF NOT EXISTS fuel_products (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  unit VARCHAR(10) DEFAULT 'L',
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE fuel_products IS 'Catálogo de productos de combustible (Gasohol, Diesel, GLP)';

-- 2. Tipos de vehículo con eficiencia
CREATE TABLE IF NOT EXISTS vehicle_classes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  efficiency_km_l DECIMAL(5, 2) NOT NULL,
  icon VARCHAR(50),
  display_order INT DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE vehicle_classes IS 'Tipos de vehículo con su eficiencia en km/L';

-- 3. Sedes fijas (destinos predefinidos)
CREATE TABLE IF NOT EXISTS sites (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  address VARCHAR(500),
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  geom GEOMETRY(POINT, 4326),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE sites IS 'Sedes fijas de la empresa (destinos predefinidos)';

-- 4. Estaciones de servicio (de OSINERGMIN)
CREATE TABLE IF NOT EXISTS stations (
  id SERIAL PRIMARY KEY,
  osinergmin_code VARCHAR(50) UNIQUE,
  name VARCHAR(300) NOT NULL,
  brand VARCHAR(100),
  address VARCHAR(500),
  district VARCHAR(100),
  province VARCHAR(100),
  department VARCHAR(100) DEFAULT 'LIMA',
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  geom GEOMETRY(POINT, 4326),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE stations IS 'Estaciones de servicio importadas de OSINERGMIN';

-- 5. Precios de combustible por estación
CREATE TABLE IF NOT EXISTS prices (
  id SERIAL PRIMARY KEY,
  station_id INT NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  fuel_product_id INT NOT NULL REFERENCES fuel_products(id),
  price DECIMAL(10, 2) NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(station_id, fuel_product_id, captured_at)
);

COMMENT ON TABLE prices IS 'Precios de combustible por estación (histórico)';

-- 6. Configuración del motor de recomendaciones
CREATE TABLE IF NOT EXISTS config (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE config IS 'Configuración del motor de recomendaciones (key-value)';

-- 7. Auditoría de ejecuciones ETL
CREATE TABLE IF NOT EXISTS etl_runs (
  id SERIAL PRIMARY KEY,
  source VARCHAR(50) DEFAULT 'osinergmin',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'running',
  stations_processed INT DEFAULT 0,
  prices_inserted INT DEFAULT 0,
  prices_updated INT DEFAULT 0,
  error_message TEXT,
  metadata JSONB
);

COMMENT ON TABLE etl_runs IS 'Log de ejecuciones del ETL de OSINERGMIN';

-- Trigger para actualizar updated_at en stations
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_stations_updated_at
  BEFORE UPDATE ON stations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar updated_at en config
CREATE TRIGGER trigger_config_updated_at
  BEFORE UPDATE ON config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para auto-generar geom desde lat/lng en sites
CREATE OR REPLACE FUNCTION update_geom_from_latlng()
RETURNS TRIGGER AS $$
BEGIN
  NEW.geom = ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sites_geom
  BEFORE INSERT OR UPDATE OF lat, lng ON sites
  FOR EACH ROW
  EXECUTE FUNCTION update_geom_from_latlng();

CREATE TRIGGER trigger_stations_geom
  BEFORE INSERT OR UPDATE OF lat, lng ON stations
  FOR EACH ROW
  EXECUTE FUNCTION update_geom_from_latlng();
