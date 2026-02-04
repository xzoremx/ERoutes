-- =============================================
-- Seed 010: Datos iniciales (productos, vehículos, sedes)
-- =============================================

-- Limpiar datos existentes (para re-ejecución)
TRUNCATE fuel_products, vehicle_classes, sites RESTART IDENTITY CASCADE;

-- 1. Productos de combustible (estándar Perú)
INSERT INTO fuel_products (code, name, display_order) VALUES
  ('GASOHOL_84', 'Gasohol 84', 1),
  ('GASOHOL_90', 'Gasohol 90', 2),
  ('GASOHOL_95', 'Gasohol 95', 3),
  ('GASOHOL_97', 'Gasohol 97', 4),
  ('DIESEL_B5', 'Diesel B5', 5),
  ('GLP', 'GLP Vehicular', 6);

-- 2. Tipos de vehículo con eficiencia (km/L)
INSERT INTO vehicle_classes (code, name, efficiency_km_l, icon, display_order, is_default) VALUES
  ('moto', 'Moto', 35.00, 'motorcycle', 1, false),
  ('auto_pequeno', 'Auto pequeño', 18.00, 'car-compact', 2, false),
  ('sedan', 'Sedán', 14.00, 'car', 3, true),
  ('suv', 'SUV / Camioneta', 10.00, 'car-suv', 4, false),
  ('pickup', 'Pickup', 8.00, 'truck-pickup', 5, false),
  ('camion', 'Camión', 4.00, 'truck', 6, false);

-- 3. Sedes placeholder (Lima) - ACTUALIZAR con datos reales
-- Las coordenadas se convierten automáticamente a geom via trigger
INSERT INTO sites (name, address, lat, lng) VALUES
  ('Sede Central', 'Av. Javier Prado Este 123, San Isidro, Lima', -12.0912, -77.0225),
  ('Sede Norte', 'Av. Túpac Amaru 456, Independencia, Lima', -12.0054, -77.0587),
  ('Sede Sur', 'Av. Angamos Este 789, Surquillo, Lima', -12.1167, -77.0167);
