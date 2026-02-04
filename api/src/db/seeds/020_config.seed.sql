-- =============================================
-- Seed 020: Configuración del motor de recomendaciones
-- =============================================

-- Limpiar config existente (para re-ejecución)
TRUNCATE config;

-- Configuración del motor de recomendaciones
INSERT INTO config (key, value, description) VALUES
  -- Cantidad asumida si el usuario no especifica
  ('reco.assumed_qty', '20', 'Cantidad asumida de carga en litros si no se especifica'),

  -- Unidad de cantidad
  ('reco.qty_unit', '"L"', 'Unidad de cantidad: L (litros) o GAL (galones)'),

  -- Radio de búsqueda
  ('reco.default_radius_km', '15', 'Radio de búsqueda por defecto en km'),
  ('reco.min_radius_km', '1', 'Radio mínimo permitido en km'),
  ('reco.max_radius_km', '50', 'Radio máximo permitido en km'),

  -- Guardrails del motor
  ('reco.max_delta_km', '20', 'Máximo desvío/acceso permitido en km (descartar si excede)'),
  ('reco.max_detour_min', '30', 'Máximo tiempo de desvío en minutos (solo como filtro, no objetivo)'),

  -- Límites de procesamiento
  ('reco.max_candidates', '100', 'Máximo de candidatos iniciales desde PostGIS'),
  ('reco.routing_top_k', '10', 'Candidatos que pasan a cálculo de routing real'),
  ('reco.top_n', '5', 'Número de resultados en la respuesta final'),

  -- Cache de routing (TTL en segundos)
  ('reco.routing_cache_ttl', '3600', 'TTL del cache de routing en segundos (1 hora)'),

  -- Precisión de grid para cache (decimales de lat/lng)
  ('reco.grid_precision', '4', 'Decimales para redondeo de coordenadas en cache')

ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = NOW();
