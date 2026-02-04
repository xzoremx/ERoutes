# ERoutes — Estructura inicial (frontend + backend) — ACTUALIZADA

Objetivo: definir la **estructura base** del proyecto para un MVP escalable.  
Contexto: ya existen estas carpetas raíz:

- `C:\Users\renat\Desktop\Proyectos\ERoutes\api`
- `C:\Users\renat\Desktop\Proyectos\ERoutes\web-react`

Reglas:
- La etapa inicial creó **placeholders**. Desde Feb 4, 2026 se está llenando con scaffold para poder correr `npm install` / `npm run dev`.
- **Sedes son fijas y pocas** → se gestionan por **tabla `sites` + seed SQL** (sin panel Admin en frontend).

## Infraestructura Definida
- **Base de Datos**: **Supabase** (PostgreSQL + PostGIS).
- **Frontend**: **Vercel** (Next.js).
- **Backend**: **Railway** (Node.js/Express).
- El motor de recomendación apunta a **minimizar gasto total estimado en combustible (S/)**:
  - costo compra: `price * qty`
  - costo combustible extra por desvío/acceso: `price * (ΔD / e)`

---

## 1) Backend (`api/`) — Estructura

Crear lo siguiente dentro de `api/`:

api/
├─ src/
│  ├─ server/
│  │  ├─ app/
│  │  │  ├─ app.(ts|js)
│  │  │  ├─ env.(ts|js)
│  │  │  ├─ logger.(ts|js)
│  │  │  └─ health.(ts|js)
│  │  ├─ config/
│  │  │  ├─ index.(ts|js)
│  │  │  ├─ cors.(ts|js)
│  │  │  └─ rateLimit.(ts|js)
│  │  ├─ routes/
│  │  │  ├─ index.(ts|js)
│  │  │  ├─ recommendations.routes.(ts|js)
│  │  │  ├─ stations.routes.(ts|js)
│  │  │  └─ sites.routes.(ts|js)
│  │  ├─ controllers/
│  │  │  ├─ recommendations.controller.(ts|js)
│  │  │  ├─ stations.controller.(ts|js)
│  │  │  └─ sites.controller.(ts|js)
│  │  ├─ services/
│  │  │  ├─ recommendationEngine.service.(ts|js)
│  │  │  ├─ routing.service.(ts|js)
│  │  │  ├─ osinergmin.service.(ts|js)
│  │  │  ├─ stations.service.(ts|js)
│  │  │  └─ sites.service.(ts|js)
│  │  ├─ repositories/
│  │  │  ├─ db.(ts|js)
│  │  │  ├─ stations.repo.(ts|js)
│  │  │  ├─ prices.repo.(ts|js)
│  │  │  ├─ sites.repo.(ts|js)
│  │  │  └─ config.repo.(ts|js)
│  │  ├─ middlewares/
│  │  │  ├─ error.middleware.(ts|js)
│  │  │  ├─ validate.middleware.(ts|js)
│  │  │  └─ notFound.middleware.(ts|js)
│  │  ├─ validators/
│  │  │  ├─ recommendations.schema.(ts|js)
│  │  │  ├─ stations.schema.(ts|js)
│  │  │  └─ sites.schema.(ts|js)
│  │  └─ types/
│  │     ├─ index.d.ts
│  │     ├─ dto.d.ts
│  │     └─ enums.d.ts
│  ├─ jobs/
│  │  ├─ etl/
│  │  │  ├─ osinergmin.fetch.(ts|js)
│  │  │  ├─ osinergmin.transform.(ts|js)
│  │  │  ├─ osinergmin.load.(ts|js)
│  │  │  └─ etl.runner.(ts|js)
│  │  └─ scheduler.(ts|js)
│  ├─ db/
│  │  ├─ migrations/
│  │  │  ├─ 0001_init.sql
│  │  │  ├─ 0002_postgis.sql
│  │  │  ├─ 0003_tables_core.sql
│  │  │  ├─ 0004_indexes.sql
│  │  │  └─ 0005_views.sql
│  │  ├─ seeds/
│  │  │  ├─ 010_sites.seed.sql
│  │  │  └─ 020_config.seed.sql
│  │  └─ schema/
│  │     ├─ tables.sql
│  │     ├─ indexes.sql
│  │     └─ views.sql
│  ├─ docs/
│  │  ├─ openapi.yaml
│  │  └─ postman_collection.json
│  └─ tests/
│     ├─ unit/
│     ├─ integration/
│     └─ e2e/
├─ .env.example
├─ .gitignore
├─ README.md
├─ package.json
├─ tsconfig.json
└─ docker-compose.yml

Cambios vs versión anterior:
- **Se eliminó** `admin.routes.(ts|js)` y `admin.controller.(ts|js)` (no hay Admin en MVP).
- Migraciones renombradas para que el esquema core sea claro.
- Seeds numerados (`010_`, `020_`) para orden determinístico.
- Motor de recomendación: centrado en **costo total (S/)** con `qty` y `e` opcionales (defaults por `config`).

Notas:
- Usa **(ts|js)** según el stack final. Por ahora crea el archivo con extensión que prefieras.
- SQLs pueden quedar vacíos por ahora.
- Las sedes viven en tabla `sites` y se cargan por `010_sites.seed.sql`.

---

## 1.1) Endpoint de recomendaciones (MVP)

La estructura anterior asume que existirán (más adelante) estos comportamientos:

### `GET /api/recommendations`
Inputs (query/body según definas):
- `origin` (lat,lng)
- `radiusKm` (default 10)
- `fuelProduct`
- `destination` (lat,lng) **opcional**
  - si viene → `mode=route` (origen → estación → destino)
  - si no viene → `mode=nearby` (origen → estación)
- `qty` **opcional** (si no viene, usar `reco.assumed_qty`)
- `vehicleClass` **opcional** (moto/sedán/SUV/pickup, etc.)
- `vehicleEfficiencyKmPerL` **opcional** (si viene, tiene prioridad sobre `vehicleClass`)

Salida (recomendado):
- `mode`: `route|nearby`
- `assumptions`: `qtyUsed`, `efficiencyUsed`, `unit`
- `candidates[]` (top N) con:
  - `price`
  - `deltaDistanceKm`
  - `fuelExtra`
  - `score` (S/)
  - `breakdown`: `purchaseCost`, `detourFuelCost`

---

## 2) Frontend (`web-react/`) — Estructura (Next.js App Router)

Crear lo siguiente dentro de `web-react/`:

web-react/
├─ public/
│  ├─ favicon.ico
│  ├─ robots.txt
│  └─ manifest.json
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ loading.tsx
│  │  ├─ error.tsx
│  │  ├─ not-found.tsx
│  │  ├─ globals.css
│  │  ├─ recommend/
│  │  │  ├─ page.tsx
│  │  │  └─ loading.tsx
│  │  └─ sites/
│  │     ├─ page.tsx
│  │     └─ loading.tsx
│  ├─ components/
│  │  ├─ layout/
│  │  │  ├─ Navbar.tsx
│  │  │  └─ BottomNav.tsx
│  │  ├─ map/
│  │  │  ├─ MapView.tsx
│  │  │  └─ MapMarker.tsx
│  │  ├─ stations/
│  │  │  ├─ StationCard.tsx
│  │  │  └─ StationList.tsx
│  │  ├─ inputs/
│  │  │  ├─ FuelProductSelect.tsx
│  │  │  ├─ QtySelect.tsx
│  │  │  ├─ VehicleClassSelect.tsx
│  │  │  ├─ RadiusSelect.tsx
│  │  │  └─ ModeToggle.tsx
│  │  └─ ui/
│  │     ├─ Button.tsx
│  │     ├─ Card.tsx
│  │     ├─ Loader.tsx
│  │     └─ Toast.tsx
│  ├─ services/
│  │  ├─ apiClient.ts
│  │  ├─ recommendations.api.ts
│  │  ├─ stations.api.ts
│  │  └─ sites.api.ts
│  ├─ store/
│  │  ├─ index.ts
│  │  ├─ useRecommendationStore.ts
│  │  └─ useUIStore.ts
│  ├─ hooks/
│  │  ├─ useGeolocation.ts
│  │  ├─ useQueryParams.ts
│  │  └─ useDebounce.ts
│  ├─ types/
│  │  ├─ dto.ts
│  │  ├─ enums.ts
│  │  └─ index.ts
│  ├─ utils/
│  │  ├─ format.ts
│  │  ├─ geo.ts
│  │  └─ money.ts
│  └─ lib/
│     └─ fonts.ts
├─ .env.example
├─ .env.local
├─ .gitignore
├─ README.md
├─ package.json
├─ tsconfig.json
├─ next.config.ts
├─ tailwind.config.ts
└─ postcss.config.js

Cambios vs versión anterior:
- Migración a Next.js 14+ con App Router.
- Estado con Zustand (`store/`) en lugar de Redux.
- Inputs actualizados para recomendación económica:
  - `QtySelect` (pequeña/media/grande) en lugar de litros obligatorios
  - `VehicleClassSelect` (moto/sedán/SUV/pickup)
- `ModeToggle`: permite `nearby` (sin destino) y `route` (con destino)

Notas:
- Usa `'use client'` en componentes que necesiten hooks o eventos del navegador.
- Los componentes del mapa (`MapView.tsx`, `MapMarker.tsx`) deben ser Client Components.
- `loading.tsx` y `error.tsx` son convenciones de Next.js para estados de carga/error.
- Google Maps se integra via `@vis.gl/react-google-maps` (recomendado para Next.js) o similar.

---

## 3) Archivos “placeholder” recomendados (vacíos)

Crear (si no existen) y dejar vacíos por ahora:

### `api/.env.example`
Variables esperadas:
- `PORT=`
- `DATABASE_URL=` (Connection string de Supabase / Transaction Pooler)
- `GOOGLE_MAPS_API_KEY=`
- `OSINERGMIN_DATA_URL=`
- `SUPABASE_URL=` (opcional si usas SDK)
- `SUPABASE_KEY=` (opcional si usas SDK)
- `OSINERGMIN_REGION_FILTER=` (opcional; ej. Lima)
- `ROUTING_PROVIDER=` (opcional; ej. google)

### `web-react/.env.example`
Variables esperadas:
- `NEXT_PUBLIC_API_BASE_URL=`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=`

---

## 4) Estado del repo y siguiente paso

- La estructura base (`api/` + `web-react/`) ya está creada.
- Los archivos ya no están “solo vacíos”: el repo ya tiene scaffold mínimo para ejecutar localmente.

Para empezar:
- Backend: ver `api/README.md`
- Frontend: ver `web-react/README.md`
