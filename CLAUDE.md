# CLAUDE.md - ERoutes Project

## Regla para agentes (infraestructura)

Si el agente (Claude/Codex) realiza **cualquier cambio de infraestructura** del proyecto (estructura de carpetas, stack, Docker/Compose, scripts de `package.json`, variables de entorno, rutas base, etc.), **debe actualizar este `CLAUDE.md`** para mantenerlo como fuente de verdad.

## Descripción del Proyecto

ERoutes es una aplicación web para recomendar gasolineras óptimas en Perú. Permite a los usuarios encontrar estaciones de servicio cercanas con los mejores precios de combustible, considerando ubicación, precios y rutas.

## Documentos clave

- `mvp.md` - Estructura base (placeholders) del repo.
- `plan-desarrollo.md` - Roadmap por etapas.
- `formula-recomendacion.md` - Resumen de la fórmula (precio + desvío) y calibración/ML.

## Estructura del Proyecto

```
ERoutes/
├── api/                    # Backend (Node.js + TypeScript)
└── web-react/              # Frontend (Next.js + TypeScript)
```

### Backend (`api/`)

- **src/server/app/** - Configuración de la aplicación Express
- **src/server/routes/** - Definición de rutas API
- **src/server/controllers/** - Lógica de controladores
- **src/server/services/** - Lógica de negocio (motor de recomendaciones, routing, OSINERGMIN)
- **src/server/repositories/** - Acceso a datos (PostgreSQL + PostGIS)
- **src/server/middlewares/** - Middlewares (errores, validación)
- **src/server/validators/** - Esquemas de validación
- **src/jobs/etl/** - Pipeline ETL para datos de OSINERGMIN
- **src/db/** - Migraciones, seeds y esquemas SQL

### Frontend (`web-react/`) - Next.js App Router

- **app/** - Rutas y páginas (App Router de Next.js 13+)
  - `app/page.tsx` - Home
  - `app/recommend/page.tsx` - Recomendaciones
  - `app/sites/page.tsx` - Sedes
  - `app/layout.tsx` - Layout raíz
- **components/** - Componentes reutilizables (Map, StationCard, Inputs, UI)
- **services/** - Clientes API
- **store/** - Estado global (Zustand recomendado para Next.js)
- **hooks/** - Custom hooks (geolocation, debounce)
- **utils/** - Utilidades (formato, geo, dinero)
- **types/** - Tipos TypeScript compartidos

## Stack Tecnológico

### Backend
- Node.js + TypeScript
- Express.js
- PostgreSQL + PostGIS (para queries geoespaciales)
- Zod o Joi para validación

### Frontend
- Next.js 14+ con App Router
- React 18+ con TypeScript
- Google Maps API para mapas (`@vis.gl/react-google-maps`)
- Zustand para estado global (ligero, compatible con Server Components)
- Tailwind CSS (opcional, recomendado)

### Infraestructura
- **DB**: Supabase (PostgreSQL + PostGIS)
- **Backend**: Railway (Node.js/Express)
- **Frontend**: Vercel (Next.js)
- **Dev local (opcional)**: `api/docker-compose.yml` para PostGIS local

### Archivos de Deploy (Backend)
- `api/Dockerfile` - Multi-stage build (Node 22 Alpine)
- `api/railway.toml` - Configuración de Railway
- `api/.env.example` - Template de variables de entorno

## Comandos Útiles

```bash
# Backend (desde api/)
npm install          # Instalar dependencias
npm run dev          # Servidor de desarrollo
npm run build        # Compilar TypeScript
npm run test         # Ejecutar tests

# Docker local (opcional)
docker build -t eroutes-api .
docker run -p 3001:3001 --env-file .env eroutes-api

# Frontend (desde web-react/)
npm install          # Instalar dependencias
npm run dev          # Servidor Next.js desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter
```

## Variables de Entorno

### Backend (`api/.env`)
```
PORT=3001
DATABASE_URL=postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
GOOGLE_MAPS_API_KEY=
OSINERGMIN_DATA_URL=
OSINERGMIN_REGION_FILTER=LIMA
ROUTING_PROVIDER=google
CORS_ALLOWED_ORIGINS=http://localhost:3000
LOG_LEVEL=info
```

### Frontend (`web-react/.env.local`)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=https://[REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## Convenciones de Código

### Nomenclatura de Archivos
- **Backend**: `nombre.tipo.ts` (ej: `stations.controller.ts`, `recommendations.schema.ts`)
- **Frontend páginas**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` (convención Next.js)
- **Frontend componentes**: `NombreComponente.tsx` en carpeta propia si tiene estilos
- **SQL**: `XXXX_descripcion.sql` con numeración para orden

### Next.js Específico
- Usar `'use client'` solo en componentes que necesiten interactividad (hooks, eventos)
- Preferir Server Components por defecto para mejor rendimiento
- Fetch de datos en Server Components cuando sea posible
- Componentes del mapa deben ser Client Components (`'use client'`)

### Patrones
- Arquitectura en capas: Controller → Service → Repository
- DTOs para transferencia de datos entre capas
- Validación en middlewares antes de llegar a controllers
- Manejo centralizado de errores

## Reglas de Negocio Importantes

1. **Sites (Sedes)**: Son fijos y pocos. Se gestionan por tabla `sites` + seed SQL. No hay panel Admin en el MVP.
2. **Datos de Precios**: Vienen de OSINERGMIN via ETL periódico.
3. **Geolocalización**: Se usa PostGIS para queries espaciales eficientes.
4. **Recomendación (MVP)**: minimiza **gasto total estimado en combustible (S/)** en ruta `origen → estación → destino` (y soporta modo `nearby` sin destino).
5. **Alcance inicial**: solo **Lima**; ETL **diario**; radio default sugerido: **10 km** (ajustable).

## Endpoints API Principales

- `GET /api/recommendations` - Obtener recomendaciones de gasolineras
- `GET /api/stations` - Listar estaciones de servicio
- `GET /api/sites` - Obtener sedes configuradas
- `GET /health` - Health check

## Deploy en Railway (Backend)

### Requisitos
1. Cuenta en Railway (https://railway.app)
2. Proyecto de Supabase con PostgreSQL + PostGIS habilitado

### Pasos para Deploy
1. Crear nuevo proyecto en Railway
2. Conectar repositorio GitHub (carpeta `api/`)
3. Configurar variables de entorno en Railway:
   - `DATABASE_URL` (connection string de Supabase con `?sslmode=require`)
   - `GOOGLE_MAPS_API_KEY`
   - `CORS_ALLOWED_ORIGINS` (dominio de Vercel)
   - `NODE_ENV=production`
4. Railway detectará automáticamente el `Dockerfile` y `railway.toml`
5. El health check está en `/health`

### Variables de Entorno Railway (Backend)
```
NODE_ENV=production
DATABASE_URL=postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:5432/postgres
GOOGLE_MAPS_API_KEY=AIza...
CORS_ALLOWED_ORIGINS=https://tu-app.vercel.app
LOG_LEVEL=info
OSINERGMIN_REGION_FILTER=LIMA
ROUTING_PROVIDER=google
```

> **Nota**: El backend usa conexión directa a PostgreSQL (`DATABASE_URL`).
> Las variables `NEXT_PUBLIC_SUPABASE_*` son solo para el frontend (Next.js).

## Notas para Desarrollo

- Los archivos SQL de migraciones usan prefijos numéricos para orden determinístico
- Los seeds también usan prefijos (`010_`, `020_`)
- El motor de recomendaciones considera: distancia, precio, y ruta óptima
- Google Maps API se usa tanto en backend (routing) como frontend (visualización)
