# Plan de desarrollo por etapas — ERoutes

Este documento traduce el alcance del `mvp.md` en un roadmap ejecutable (de **estructura vacía** → **MVP funcional** → **v1**).

> Cambio clave (Feb 4, 2026): el objetivo del motor de recomendación es **minimizar el gasto total estimado en combustible (S/)**.  
> El tiempo se usa como **guardrail**, no como objetivo.

---

## Objetivo del MVP (valor al usuario)

1. Ver en un mapa estaciones cercanas.
2. Consultar precios por tipo de combustible.
3. Obtener recomendaciones (top N) minimizando **costo total estimado (S/)**, combinando:
   - **costo de compra** (precio × cantidad), y
   - **costo de combustible extra por desvío/acceso** (según distancia y eficiencia del vehículo).

Restricciones explícitas (del `mvp.md`):
- **No hay panel Admin**: las **sedes** (`sites`) son pocas/fijas y se cargan por **seed SQL**.
- Se prioriza una arquitectura escalable: ETL (OSINERGMIN), PostGIS y motor de recomendaciones.

Decisiones confirmadas (Feb 4, 2026):
- Score económico: `score = p*q + p*(ΔD/e)` (S/), donde `q` y `e` pueden ser inputs o defaults.
- Inputs MVP base: **origen**, **radio** (default **10 km**) y **producto**.
- Destino final: **opcional** (soportar 2 modos):
  - `route`: origen → estación → destino
  - `nearby`: origen → estación (sin destino)
- ETL: **diario**.
- Cobertura inicial: **Lima** (misma lógica para otras regiones luego).
- `sites`: máximo **3 sedes** en Lima por ahora.
- Destino: por defecto se elige desde `sites`; **opcional** permitir destino libre (cualquier punto/dirección).
- **Infraestructura**: Supabase (DB), Railway (Backend), Vercel (Frontend).

---

## Etapa 0 — Alineación de base (repo “arrancable”)

**Meta:** poder levantar stack local (DB + API + web) con “hello world”, y dejar lista la base de tooling.

**Dependencias de Infraestructura**
- [ ] Crear proyecto en **Supabase**: guardar `DATABASE_URL` (usar connection pooling pgbouncer).
- [ ] Crear proyecto en **Railway** (linkear repo `api` - opcional por ahora, pero tener cuenta).
- [ ] Crear proyecto en **Vercel** (linkear repo `web-react` - opcional por ahora).

**Entregables**
- [ ] Completar/validar estructura de carpetas y placeholders según `mvp.md` (especialmente `web-react/`).
- [ ] Definir stack final y consistencia: **TypeScript** (recomendado) y gestor de paquetes (npm/pnpm/yarn).
- [ ] `api/docker-compose.yml`: Postgres + PostGIS (y red/volúmenes) <--- *Útil para desarrollo local sin depender de internet, o conectar directo a Supabase dev*.
- [ ] `api/package.json` + scripts: `dev`, `build`, `start`, `test` (mínimo).
- [ ] `web-react/package.json` + Next.js + Tailwind (si aplica) + scripts: `dev`, `build`, `start`, `lint`.
- [ ] Variables `.env.example` coherentes y README mínimo de “cómo correr”.
- [ ] Convención de units: definir estándar interno **L** o **GAL** (documentado).

**DoD (Definition of Done)**
- `docker compose up` levanta DB local (o conexión exitosa a Supabase).
- `api` inicia y responde `GET /health` (aunque devuelva texto simple al inicio).
- `web-react` inicia y muestra una página base.

---

## Etapa 1 — Modelo de datos (PostgreSQL + PostGIS)

**Meta:** tener un esquema mínimo para operar: sedes, estaciones, productos y precios, más configuración del motor y trazabilidad.

**Entregables**
- [ ] Definir tablas core (mínimo):
  - `sites` (sedes fijas) + `010_sites.seed.sql`
  - `stations` (estaciones) con geom (`POINT`) o `lat/lng` + índice espacial
  - `prices` (precio por estación + producto + timestamp)
  - catálogos: `fuel_products` (o enum) y/o tabla puente si aplica
  - `etl_runs` / `etl_logs` (opcional, recomendado para auditoría)
- [ ] **Config del motor** (recomendado desde el inicio):
  - `config` (key/value) o equivalente + seed `020_config.seed.sql`
  - claves mínimas:
    - `reco.assumed_qty`
    - `reco.qty_unit` (`L` o `GAL`)
    - `reco.default_efficiency_km_per_l`
    - `reco.efficiency_by_vehicle_class` (JSON o tabla aparte)
    - guardrails: `reco.max_delta_km`, `reco.max_detour_min` (opcional), `reco.top_n`, `reco.max_candidates`
- [ ] Migraciones en `api/src/db/migrations/` y SQL fuente en `api/src/db/schema/`.
- [ ] Índices y vistas mínimas (ej. “último precio por estación+producto”).

**DoD**
- Migraciones aplican en limpio.
- `010_sites.seed.sql` deja sedes listas y consultables.
- Query espacial básica funciona (ej. estaciones dentro de radio).
- La config base del motor se puede leer desde DB.

---

## Etapa 2 — ETL OSINERGMIN (ingesta de estaciones + precios)

**Meta:** poblar y actualizar DB desde la fuente de OSINERGMIN con proceso repetible e idempotente.

**Entregables**
- [ ] `osinergmin.fetch` descarga datos (con reintentos/timeout).
- [ ] `osinergmin.transform` normaliza:
  - mapeo de productos a `fuel_products` (según lo que exponga OSINERGMIN)
  - limpieza de direcciones / coordenadas
  - normalización de moneda/unidades y timestamps
- [ ] Alcance inicial: **solo Lima** (filtrado por región/campos de la fuente o por bounding/geo si fuese necesario).
- [ ] `osinergmin.load` upsert a DB (estaciones + precios).
- [ ] `etl.runner` orquesta y registra métricas básicas (filas insertadas/actualizadas).
- [ ] `scheduler` ejecuta **diario** (cron) en dev/producción.

**DoD**
- Ejecutar ETL dos veces no duplica data (idempotencia).
- Se puede reconstruir DB desde cero: migraciones + seeds + ETL.
- Vista “último precio” queda consistente y usable por API.

---

## Etapa 3 — API v0 (sites + stations)

**Meta:** exponer datos para el frontend con endpoints estables, validación y paginación.

**Entregables**
- [ ] Express app base (`api/src/server/app/app.ts`) + middlewares: CORS, rate limit, error handler.
- [ ] `GET /api/sites` (lista sedes).
- [ ] `GET /api/stations` con filtros:
  - por radio (lat/lng + meters)
  - por producto
  - opcional: `onlyWithFreshPrice=true` (precio vigente)
  - paginación/orden (`distance` o `price`)
- [ ] Validadores (`validators/*.schema.ts`) y middleware de validación.
- [ ] OpenAPI mínimo (`api/src/docs/openapi.yaml`) para estos endpoints.

**DoD**
- Tests unit/integration mínimos para repositorios/servicios.
- Respuestas consistentes (DTOs) y errores tipados (400/404/500).

---

## Etapa 4 — Frontend MVP (mapa + exploración)

**Meta:** UI usable para explorar estaciones cercanas y ver precios.

**Entregables**
- [ ] Layout base (Navbar/BottomNav) + rutas:
  - `/` home (mapa + inputs)
  - `/sites` (ver sedes fijas)
  - `/recommend` (resultados de recomendación)
- [ ] Geolocalización (`useGeolocation`) con fallback manual (ingresar dirección o lat/lng).
- [ ] Selección de modo:
  - `nearby`: solo estaciones cercanas (sin destino)
  - `route`: recomendación para una ruta (con destino)
- [ ] Selección de **destino final** (solo en `route`):
  - MVP: desde `sites` (fijo/seed)
  - opcional: destino libre (buscar dirección o seleccionar en mapa)
- [ ] Inputs “MVP-friendly” (sin números obligatorios):
  - `Cantidad`: Pequeña / Media / Grande → mapea a `qty` (o usa `assumed_qty`)
  - `Vehículo`: Moto / Sedán / SUV / Pickup → manda `vehicleClass` (o usa default)
- [ ] Integración de mapa (Client Component) + marcadores + selección.
- [ ] Lista de estaciones (`StationList`/`StationCard`) con estado loading/error (Next `loading.tsx`, `error.tsx`).
- [ ] `apiClient` + `stations.api` + `sites.api` (tipados con DTOs).

**DoD**
- Desde el navegador se pueden ver estaciones dentro de un radio y sus precios.
- Se puede ejecutar `nearby` sin destino.
- UX mínima: estados vacíos, errores, loading, mobile-friendly.

---

## Etapa 5 — Recomendaciones v1 (motor + routing + score económico)

**Meta:** endpoint y UI de recomendaciones con un criterio **económico (S/)** definido y transparente.

**Definición de score (S/)**  
Variables:
- `p_i`: precio de estación i (S/ por unidad)
- `q`: cantidad a cargar (unidad consistente)
- `e`: eficiencia del vehículo (km/L)
- `D(·)`: distancia de ruta (km) del motor de routing

Distancia penalizable (ΔD):
- `route`: `ΔD_i = max(0, D(o→s_i→d) − D(o→d))`
- `nearby`: `ΔD_i = D(o→s_i)`

Combustible extra:
- `fuelExtra_i = ΔD_i / e`

Score:
- `score_i = p_i*q + p_i*fuelExtra_i = p_i*q + p_i*(ΔD_i/e)`

**Entregables**
- [ ] `GET /api/recommendations`
  - inputs base: `origin`, `radiusKm`, `fuelProduct`
  - inputs opcionales: `destination?`, `qty?`, `vehicleClass?`, `vehicleEfficiencyKmPerL?`
  - output: top N con explicación:
    - `price`, `deltaDistanceKm`, `fuelExtra`, `score`
    - breakdown: `purchaseCost`, `detourFuelCost`
    - `assumptions`: `qtyUsed`, `efficiencyUsed`, `unit`
    - `mode`: `route|nearby`
- [ ] Definir y aplicar guardrails:
  - `max_delta_km` (si excede, descartar candidato)
  - opcional `max_detour_min` (si calculas tiempo, solo filtro)
  - `max_candidates`, `top_n`
- [ ] Integración con routing (Google Directions o alternativa) en `routing.service`:
  - obtener **distance km** (obligatorio)
  - obtener **duration min** (opcional, solo para guardrails/UX)
- [ ] `recommendationEngine.service`:
  - pipeline: candidates → precios → routing → score → sort → topN
  - optimización: calcular routing exacto solo para topK candidatos filtrados (costos/latencia)
- [ ] UI en `/recommend`:
  - mostrar breakdown en cada card (“Costo compra” + “Combustible extra por desvío”)
  - toggle `nearby/route`, filtros básicos, resultados explicables

**DoD**
- Ranking reproducible con mismos inputs y mismos supuestos (`qtyUsed`, `efficiencyUsed`) + misma fuente de routing.
- No requiere que el usuario ingrese números: defaults (`assumed_qty`, `default_efficiency` / `vehicleClass`) funcionan.
- Soporta `nearby` y `route` desde el MVP.

---

## Etapa 6 — Endurecimiento (calidad, performance, despliegue)

**Meta:** dejar el MVP listo para uso real y evolución (v1).

**Entregables**
- [ ] Observabilidad: logs estructurados (Railway logs) + request id.
- [ ] Performance:
  - índices en Supabase y queries optimizadas
  - límites (max candidates/topK routing)
  - caché en Vercel y/o Redis (si aplica)
- [ ] Seguridad: sanitización, CORS (whitelist dominio Vercel), secretos (Railway Variables).
- [ ] Pruebas: e2e smoke (API + UI), y fixtures de DB.
- [ ] CI/CD:
  - **API**: Deploy automático en Railway al pushear a main.
  - **Web**: Deploy automático en Vercel al pushear a main.
- [ ] Operación ETL: scripts/documentación (cómo correr, logs, fallas, reintentos).

**DoD**
- Deploy reproducible en ambiente `production` (URLs públicas funcionales).
- Documentación mínima de operación (Supabase dashboard, Railway logs).

---

## Preguntas abiertas (para cerrar alcance y evitar rehacer trabajo)

1. **Unidad estándar**: ¿L o GAL internamente? (convertir todo a 1 estándar en ETL/API).
2. **Defaults del score**:
   - `assumed_qty` (¿10L, 20L, otro?)
   - `default_efficiency_km_per_l` y/o tabla por `vehicleClass`
3. **Valuar el combustible extra**:
   - usar `p_i` (precio de la estación) o `priceRef` (promedio zonal). (MVP: `p_i`)
4. **Destino libre** (opcional): ¿desde MVP o v1?
5. **Radio permitido**: rango (ej. 1–30 km) y step (ej. 1 km / 5 km).
6. **Productos**: lista exacta y mapeo desde OSINERGMIN.
7. **Costos de routing**: proveedor (Google/Mapbox/OSRM) y estrategia de reducción de llamadas (topK + caching).
