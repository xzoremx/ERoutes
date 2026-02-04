# ERoutes API

Backend en **Express + TypeScript**.

## Requisitos

- Node.js 22+
- Una base PostgreSQL (para el MVP se usará Supabase)

## Configuración

1) Crear archivo `api/.env` desde el ejemplo:

```bash
cd api
cp .env.example .env
```

2) Completar variables mínimas en `api/.env`:
- `PORT` (sugerido: `3001`)
- `DATABASE_URL` (tu connection string de Supabase)

Nota: si tu `DATABASE_URL` viene con corchetes alrededor del password (formato de documentación), quítalos.

## Ejecutar en desarrollo

```bash
cd api
npm install
npm run dev
```

Endpoints:
- `GET /health`
- `GET /api/sites`
- `GET /api/stations`
- `GET /api/recommendations`

## Build / producción

```bash
cd api
npm run build
npm run start
```
