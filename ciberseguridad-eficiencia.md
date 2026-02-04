# Ciberseguridad y Eficiencia — Guía de Implementación

Este documento consolida las estrategias de **Seguridad** y **Eficiencia/Performance** necesarias para el MVP y futuras versiones de la Web App ERoutes. Se basa en la arquitectura definida en `mvp.md`, `plan-desarrollo.md` y la lógica de negocio de `formula-recomendacion.md`.

---

## 1. Ciberseguridad

Al no tener (por ahora) login ni panel administrativo público, la seguridad se centra en proteger la infraestructura, la API pública y el consumo de recursos (costos y estabilidad).

### 1.1 Seguridad de Red e Infraestructura

*   **HTTPS (TLS/SSL) Obligatorio**:
    *   **Acción**: Nunca exponer el puerto de la API (`3000`/`8080`) directamente a internet.
    *   **Implementación (Railway)**: Railway maneja SSL automático. Tu API estará en `https://xxx.up.railway.app`. No se requiere configuración extra de Reverse Proxy manual.
    *   **Por qué**: Protege la privacidad de la ubicación del usuario (lat/lng) en tránsito.

*   **Aislamiento de Base de Datos (Supabase)**:
    *   **Acción**: Proteger la conexión directa a PostgreSQL.
    *   **Implementación**:
        *   Usar password fuerte (generado por Supabase).
        *   Si es posible, activar **Network Restrictions** en Supabase para permitir IPs de Railway (aunque IPs dinámicas lo complican, SSL mode `require` es obligatorio).
        *   **Pooler**: Usar el puerto `6543` (Transaction Poller) para conexiones desde Serverless/Lambda, o `5432` Session mode para Railway (servidor persistente).

*   **Gestión de Secretos (.env)**:
    *   **Acción**: Nunca commitear archivos `.env` al repositorio.
    *   **Implementación**: Usar `.env.example` en el repo. En producción, inyectar variables de entorno de manera segura (Secrets Manager o variables de CI/CD).

### 1.2 Seguridad de Aplicación (API Backend)

*   **Rate Limiting (Control de Tráfico)**:
    *   **Riesgo**: Ataques de Denegación de Servicio (DDoS), scraping masivo de tus datos, o consumo excesivo de tu cuota de Google Maps (costos $$$).
    *   **Implementación**:
        *   Middleware `express-rate-limit` en `api/src/server/config/rateLimit.ts`.
        *   Regla sugerida: *100 peticiones / 15 min por IP* para endpoints públicos.

*   **Validación de Entradas (Input Validation)**:
    *   **Riesgo**: Inyección SQL, inyección de comandos, o errores de lógica por datos malformados.
    *   **Implementación**:
        *   Usar esquema estricto (Zod/Joi) en `validators/*.schema.ts`.
        *   Validar rangos lógicos: Latitud (-90 a 90), Radios (ej. máx 50km).
        *   Sanitizar inputs de texto para prevenir XSS (aunque el riesgo es menor en API JSON, es buena práctica).

*   **Cabeceras de Seguridad (HTTP Headers)**:
    *   **Implementación**: Usar biblioteca `helmet` en Express.
    *   **Headers Clave**: `HSTS` (fuerza HTTPS), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (evita clickjacking).

*   **CORS (Cross-Origin Resource Sharing)**:
    *   **Implementación**: Configurar `cors` en `api/src/server/config/cors.ts`.
    *   **Regla**:
        *   `Dev`: Permitir `localhost:3000` (web).
        *   `Prod`: Permitir `https://tu-proyecto.vercel.app` (y tu dominio custom).
        *   Métodos: Restringir a `GET` (y `POST` si aplica).

### 1.3 Seguridad de Integraciones (Google Maps & ETL)

*   **Google Maps API Keys**:
    *   **Frontend Key** (Mapas JS): Restringir en Google Cloud Console por **Referrer HTTP** (solo tu dominio).
    *   **Backend Key** (Directions/Geocoding): Restringir por **IP del Servidor**.
    *   **Alerta de Costos**: Configurar cuotas diarias y alertas de facturación en Google Cloud.

*   **ETL (OSINERGMIN)**:
    *   **Confianza Cero**: No confiar ciegamente en la data externa.
    *   **Implementación**: En `osinergmin.transform.ts`, sanitizar strings y validar tipos antes de hacer upsert en la DB. Previene que datos corruptos o maliciosos "envenenen" tu base de datos.

---

## 2. Eficiencia y Performance

La eficiencia aquí significa: **velocidad de respuesta** al usuario y **minimización de costos** (Google Maps + Nube).

### 2.1 Optimización de Base de Datos (PostGIS)

*   **Índices Espaciales**:
    *   **Crítico**: La columna de geometría (`geom` o `location`) en `stations` DEBE tener un índice `GIST`.
    *   **Efecto**: Convierte consultas de "estaciones cercanas" de milisegundos altos a microsegundos.

*   **Vistas Materializadas (Materialized Views)**:
    *   **Caso de Uso**: Consultas complejas que no cambian en tiempo real (ej. "precio promedio por distrito" o listados base).
    *   **Implementación**: Si la tabla de precios crece mucho, usar una vista materializada para "precios actuales" y refrescarla solo después de correr el ETL.
    *   **Nota Supabase**: Puedes crear cron jobs dentro de Supabase (pg_cron) para refrescar vistas materializadas o ejecutar mantenimientos.

### 2.2 Optimización de Costos de Ruteo (Google Directions)

Según `formula-recomendacion.md`, el cálculo de rutas es costoso.

*   **Estrategia de dos fases (Filtering)**:
    1.  **Fase Barata (PostGIS)**: Filtrar candidatos usando distancia lineal ("a vuelo de pájaro" / Haversine) dentro del radio (ej. 10km).
    2.  **Fase Cara (Google API)**: Solo calcular la ruta real (tiempo/distancia de manejo) para los **Top N** candidatos más prometedores de la fase 1, o aquellos que pasen un filtro de "distancia lineal < X".
    *   **Ahorro**: Evita llamar a la API de Google para 50 estaciones si solo vas a mostrar 5.

*   **Caching de Rutas**:
    *   **Lógica**: La distancia de manejo entre *Punto A* y *Estación B* no cambia cada segundo.
    *   **Implementación**: Cachear resultados de routing (Redis o memoria) por un tiempo corto (ej. 1-2 horas o más según ToS), usando como clave una aproximación de lat/lng del origen (redondear a 3-4 decimales para agrupar usuarios cercanos).

### 2.3 Optimización Frontend

*   **Code Splitting**:
    *   Next.js lo hace automático, pero asegurar que librerías pesadas (como mapas) se carguen solo cuando se necesitan.

*   **Debounce en Búsquedas**:
    *   **Acción**: Usar `useDebounce` (ya planificado en `mvp.md`) para inputs de texto/dirección.
    *   **Por qué**: Evita disparar peticiones al API (y a Google Places Autocomplete $$$) por cada tecla pulsada.

*   **Carga de Assets (Vercel)**:
    *   Next.js Image Optimization servirá imágenes optimizadas (WebP/AVIF) automáticamente.
    *   Vercel Edge Network cachea por defecto tus rutas estáticas.

---

## 3. Resumen de Implementación Inmediata (MVP)

1.  [ ] **DB**: Crear índice `GIST` en migraciones.
2.  [ ] **API**: Configurar `helmet`, `cors` (whitelist) y `rateLimit`.
3.  [ ] **Validación**: Crear esquemas Zod para la API de recomendaciones.
4.  [ ] **Google Cloud**: Restringir API Keys en la consola.
5.  [ ] **Lógica**: Implementar filtro previo de distancia lineal antes de pedir ruta a Google.
---

# Actualizaciones (alineadas al score económico y costos de routing)

Este documento se actualiza para reflejar que el motor de recomendaciones busca **minimizar gasto total estimado (S/)** y que el **routing** (distancia/tiempo) es un recurso **costoso** que debe protegerse (seguridad) y optimizarse (eficiencia).

## 1) Ciberseguridad (pragmática para MVP)

### 1.1 Rate limiting por endpoint (no global)
Aplicar límites distintos según costo:
- `GET /api/stations`: límite más alto (barato).
- `GET /api/recommendations`: límite más bajo (caro por routing).

Recomendación:
- rate limit + slow down (penalización progresiva) para reducir scraping.
- limitar **concurrencia** (máx. requests simultáneas por IP) para evitar picos.

> Nota: si el rate limit es in-memory, se reinicia con el proceso. Para algo más estable (staging/prod), usar almacenamiento compartido (ej. Redis).

### 1.2 Validación estricta de inputs (incluye qty/vehículo)
Validar y normalizar inputs para evitar abuso y resultados absurdos:
- `origin`: lat/lng válidos.
- `destination` (si aplica): lat/lng válidos.
- `radiusKm`: mínimo/máximo (hard cap).
- `fuelProduct`: contra catálogo permitido.
- `qty` (opcional): rango razonable; si falta → usar `reco.assumed_qty`.
- `vehicleEfficiencyKmPerL` (opcional): rango razonable (evitar 0 o valores irreales); si falta → default por clase.
- `vehicleClass` (opcional): enum permitido; si falta → default.

En la respuesta, devolver `assumptions` (qué defaults se usaron).

### 1.3 Protección contra abuso de parámetros (parameter pollution)
- Rechazar parámetros duplicados (hpp) o normalizarlos de forma segura.
- Limitar longitud total de query string.
- Timeouts en requests (evitar conexiones colgadas).

### 1.4 Seguridad HTTP + headers
- `helmet` en backend.
- En frontend (Next.js), definir CSP (Content-Security-Policy) compatible con mapas:
  - whitelists estrictas para scripts, frames y conexiones.
- CORS por entorno (dev vs prod) y lista explícita de orígenes.

### 1.5 Logging seguro (privacidad de ubicación)
No registrar lat/lng exactos en logs/telemetría:
- redondear coordenadas (ej. 3–4 decimales) o usar “grid id”.
- evitar guardar direcciones textuales completas si no es necesario.

### 1.6 Secretos y exposición de llaves
- Nunca exponer credenciales de DB, llaves privadas o tokens en `web-react`.
- `GOOGLE_MAPS_API_KEY`: restringir por dominio (frontend) y por IP/servicio (backend) según caso.
- Rotación básica de llaves y separación de `.env` por entorno.

### 1.7 Sanitización y límites
- Límite de tamaño de payload (aunque sea GET, proteger endpoints).
- Manejo de errores tipado (no filtrar stack traces en producción).
- Validación y escape de cualquier texto (si luego soportas “destino libre” con dirección).

---

## 2) Eficiencia (latencia + costo de routing + DB)

### 2.1 Pipeline de recomendación con “topK routing”
El routing es el paso más caro. Estrategia:
1) Filtrar candidatos por PostGIS (`ST_DWithin`) dentro de `radiusKm`.
2) Ordenar por distancia aproximada (Haversine / `ST_Distance`) y tomar `topK`.
3) Calcular routing real solo para `topK`.
4) Score + sort + `topN`.

Configurar:
- `reco.max_candidates` (máximo candidatos iniciales)
- `reco.routing_top_k` (cuántos pasan a routing real)
- `reco.top_n` (respuesta final)

### 2.2 Caching de routing (claves estables + TTL corto)
Cachear distancias/tiempos de routing:
- Modo `nearby`: `origin_grid + station_id`
- Modo `route`: `origin_grid + station_id + destination_grid`

Recomendación:
- `origin_grid` / `destination_grid`: redondeo a 4 decimales o geohash corto.
- TTL 30–120 min (depende del proveedor y variabilidad).
- Cachear también la ruta directa `D(o→d)` para `route`.

### 2.3 Fallback cuando routing falla
Si el proveedor está caído / rate-limited:
- usar distancia aproximada (Haversine) como reemplazo
- devolver bandera `routingApprox=true` para transparencia
- aplicar guardrails (`max_delta_km`) igual

### 2.4 PostGIS y consultas “baratas”
- Usar `ST_DWithin(geography, geography, meters)` para radio en metros.
- Índice `GIST` en geom/geography.
- Mantener SRID consistente.

Precios:
- Índice recomendado en `prices` para “último precio”:
  - `(station_id, fuel_product, timestamp DESC)`
- Vista o view materializada “latest_price_by_station_product”.
- Refresh de vista al final del ETL.

### 2.5 Frontend: evitar trabajo innecesario
- Aislar el mapa como Client Component y memoizar markers.
- Debounce para inputs (`radius`, `qty`, `mode`) para no disparar requests en cada tecla.
- Paginar lista y cargar “lazy” si hay muchos resultados.

---

## 3) Guardrails mínimos (para seguridad + UX)

- `reco.max_candidates`: límite de candidatos PostGIS.
- `reco.routing_top_k`: máximo de candidatos para routing real.
- `reco.top_n`: tamaño de respuesta.
- `reco.max_delta_km`: descartar recomendaciones con desvío/acceso absurdo.
- `reco.max_detour_min` (opcional): si calculas tiempo, usar solo como filtro.
- Defaults económicos:
  - `reco.assumed_qty`
  - `reco.default_efficiency_km_per_l`
  - `reco.efficiency_by_vehicle_class`

---

## 4) Telemetría mínima (sin invadir privacidad)

Guardar (idealmente) por request:
- `mode`, `fuelProduct`, `radiusKm`
- `origin_grid` (no lat/lng exacto)
- `destination_grid` (si aplica)
- `qtyUsed`, `efficiencyUsed`
- candidatos topN con `price`, `ΔD`, `fuelExtra`, `score`
- acción del usuario: click “Ir” / abrir maps (si lo implementas)

Esto permite calibrar defaults y mejorar ranking con datos reales.
