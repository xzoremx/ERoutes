# ERoutes Web

Frontend en **Next.js (App Router) + TypeScript**.

## Requisitos

- Node.js 22+
- API corriendo local o en Railway

## Configuración

1) Crear `web-react/.env.local` desde el ejemplo:

```bash
cd web-react
cp .env.example .env.local
```

2) Completar variables mínimas en `web-react/.env.local`:
- `NEXT_PUBLIC_API_BASE_URL` (sugerido en local: `http://localhost:3001`)

## Ejecutar en desarrollo

```bash
cd web-react
npm install
npm run dev
```
