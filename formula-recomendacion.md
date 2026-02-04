# ERoutes — Resumen de la fórmula de recomendación (costo de combustible + desvío)

Este documento resume **dónde** se calcula la recomendación, **qué fórmula** usamos y **cómo** elegir/ajustar sus parámetros (con o sin ML).

> Objetivo del score (MVP): **minimizar el gasto total en combustible (S/)**, no necesariamente minimizar tiempo.

---

## 1) ¿Dónde se calcula?

Sí: el cálculo se hace principalmente en el **backend** para que:
- el frontend sea liviano,
- la lógica sea consistente (un solo “source of truth”),
- puedas ajustar parámetros sin redeploy (si se guardan en DB).

Ubicación en la arquitectura (según `mvp.md`):
- `api/src/server/routes/recommendations.routes.ts` define `GET /api/recommendations`
- `api/src/server/controllers/recommendations.controller.ts` valida inputs y llama al servicio
- `api/src/server/services/recommendationEngine.service.ts` calcula el ranking (score)
- `api/src/server/services/routing.service.ts` obtiene **distancias/tiempos** (Google Directions u otro)
- `api/src/server/services/stations.service.ts` trae candidatos (y/o precios vigentes)
- `api/src/server/repositories/*.repo.ts` consulta Postgres/PostGIS
- `api/src/server/repositories/config.repo.ts` lee parámetros desde DB (seed `020_config.seed.sql`)

---

## 2) Entradas y salidas del endpoint

### Entrada (MVP)
- `origin` (lat,lng)
- `destination` (lat,lng) **opcional**  
  - si viene: modo `route` (origen → estación → destino)
  - si no viene: modo `nearby` (origen → estación)
- `radiusKm` (default 10 km, ajustable)
- `fuelProduct` (por ahora “lo que venga de OSINERGMIN”, se define luego)

### Entrada (opcional recomendado)
- `qty` (cantidad a cargar, en L o gal) **opcional**  
  - si no viene: se usa `assumed_qty`
- `vehicleEfficiencyKmPerL` **opcional**  
  - si no viene: se usa un valor por defecto o por `vehicleClass` (sedán/SUV/moto, etc.)

### Salida (MVP recomendado)
- `candidates[]`: top N estaciones con:
  - `price` (S/ por litro o galón)
  - `deltaDistanceKm` (km extra vs directo, o km de acceso si no hay destino)
  - `fuelExtra` (L o gal equivalentes, estimado)
  - `score` (S/ estimado, para explicar el orden)
  - `breakdown`:
    - `purchaseCost = price * qty`
    - `detourFuelCost = price * fuelExtra` *(o `priceRef * fuelExtra`, si decides usar precio de referencia)*
- `mode`: `route` o `nearby`
- `assumptions`: `qtyUsed`, `efficiencyUsed`, `unit`

---

## 3) Algoritmo (pipeline simple)

1. **Generar candidatos**: estaciones dentro de `radiusKm` alrededor de `origin` (PostGIS).
2. **Precio vigente**: obtener último precio por estación + producto (vista o query).
3. **Calcular distancia (y tiempo como guardrail) por candidato**:
   - si `mode=route`:
     - ruta directa: `D(origin→destination)` (y opcional `T(origin→destination)`)
     - ruta con estación: `D(origin→station→destination)` (y opcional `T(origin→station→destination)`)
     - `deltaDistance = D_with_station − D_direct` (km)
   - si `mode=nearby`:
     - ruta a estación: `D(origin→station)` (y opcional `T(origin→station)`)
     - `deltaDistance = D(origin→station)` (km)
4. **Combustible extra**: estimar combustible adicional consumido por el desvío/acceso.
5. **Score**: estimar costo total (S/) por estación.
6. **Ordenar** por `score` ascendente y devolver top N.

> Nota: el tiempo **no es el objetivo**, pero conviene usarlo como **guardrail** (no recomendar desvíos absurdos).

---

## 4) La fórmula (centrada en ahorro de combustible)

### 4.1 Definición unificada de distancia “penalizable” (ΔD)

Sea:
- `o` = origen
- `d` = destino (si existe)
- `s_i` = estación candidata i
- `D(·)` = distancia de ruta (km) del motor de rutas

**Caso A: con destino (`mode=route`)**
```
ΔD_i = max(0, D(o→s_i→d) − D(o→d))
```

**Caso B: sin destino (`mode=nearby`)**
```
ΔD_i = D(o→s_i)
```

### 4.2 Combustible extra (depende del vehículo)

Sea:
- `e` = eficiencia del vehículo (km/L) *(equivalente a consumo, pero invertido)*

Entonces:
```
fuelExtra_i = ΔD_i / e
```

### 4.3 Score total (S/) — objetivo MVP

Sea:
- `p_i` = precio vigente (S/ por L o gal)
- `q` = cantidad a cargar (L o gal)

**Score recomendado (económico y explicable)**
```
score_i = (p_i * q) + (p_i * fuelExtra_i)
       = p_i * q + p_i * (ΔD_i / e)
```

Interpretación:
- `p_i * q`: lo que pagarás por lo que compras
- `p_i * (ΔD_i / e)`: lo que “pierdes” por combustible extra quemado al desviarte (según vehículo)

> Si `q` es grande, el precio pesa mucho. Si `q` es pequeño, el desvío puede comerse el ahorro.

### 4.4 Si NO tienes `q` y/o `e` (MVP-friendly)

**Si no tienes `qty`**:
- usar `assumed_qty` (config DB) para rankear.

**Si no tienes `e`**:
- usar `vehicleClass` → asignar `e` por clase (config DB),
- o un `default_efficiency_km_per_l`.

---

## 5) ¿Cómo se asignan los parámetros?

Aquí ya no hablamos de “70/30”, sino de **supuestos operativos**:

1) **`assumed_qty` (cantidad típica de carga)**  
Ejemplos por defecto:
- `assumed_qty = 10 L` (carga pequeña)
- `assumed_qty = 20 L` (carga media)

2) **`e` (eficiencia del vehículo km/L)**  
- Mejor: el usuario lo configura una vez en su perfil.
- MVP: `vehicleClass` con valores típicos (aprox):
  - moto / sedán / SUV / pickup

3) **Precio para valuar el combustible extra**  
- Simple y consistente: usar `p_i` (precio de la estación elegida).
- Alternativa: usar `priceRef` (promedio zonal del producto) si quieres evitar “paradojas” por estación muy cara.

Recomendación práctica:
- empezar con defaults conservadores (`assumed_qty` + `e` por clase),
- loguear resultados y ajustar (ver telemetría).

---

## 6) ¿Dónde guardar parámetros y guardrails?

Recomendado: **configurable en DB** (sin UI) para ajustar rápido:
- tabla `config` (o clave/valor) seed `api/src/db/seeds/020_config.seed.sql`

Claves sugeridas:
- `reco.assumed_qty` (número)
- `reco.qty_unit` (`L` o `GAL`)
- `reco.default_efficiency_km_per_l` (número)
- `reco.efficiency_by_vehicle_class` (JSON o tabla aparte)
- guardrails:
  - `reco.max_delta_km` (límite de km extra o km de acceso)
  - `reco.max_detour_min` (tiempo como filtro)
  - `reco.max_candidates`
  - `reco.top_n`

---

## 7) Datos históricos útiles (sin ML primero)

Aunque no entrenes ML al inicio, conviene guardar “telemetría” para calibrar:
- inputs: (zona), producto, radio, hora/día, `mode`
- supuestos usados: `qtyUsed`, `efficiencyUsed`, unidad
- candidatos: `price`, `ΔD`, `fuelExtra`, `score`, breakdown
- ranking entregado y estación seleccionada por el usuario (proxy: click en “Ir”, “Abrir en Maps”)

Con eso puedes responder:
- “¿estamos asumiendo `qty` demasiado alto/bajo?”
- “¿qué clase de vehículo debería ser default por zona/segmento?”
- “¿nuestros guardrails están cortando demasiado?”

---

## 8) ¿Cómo entra ML después?

Cuando tengas data de “elección real” (click/uso de navegación):
- objetivo: aprender una función (o parámetros por segmento) que prediga la probabilidad de elección.
- enfoques típicos:
  - calibrar `assumed_qty` y `e` por segmento (zona/horario)
  - learning-to-rank con features: `price`, `ΔD`, `fuelExtra`, confiabilidad del precio, etc.

Importante: ML no reemplaza guardrails (límites de desvío, precio vigente); los complementa.

---

## 9) Checklist de decisiones mínimas (para cerrar MVP)

- Unidad: ¿trabajaremos en **L** o **galón** (consistente en todo el pipeline)?
- ¿`destination` será opcional (soportar `nearby`) desde el MVP?
- Defaults:
  - `assumed_qty`
  - `default_efficiency_km_per_l` o `vehicleClass`
- Guardrails:
  - `max_delta_km`
  - opcional `max_detour_min`
- TopN y límites: `top_n`, `max_candidates`

---

## Resumen “pegable” para discutir con otra IA

Problema: recomendar estación de combustible (Lima) minimizando **gasto total estimado en combustible (S/)**. Inputs MVP: origin, destination opcional, radius (default 10 km), fuelProduct. Tenemos precios (S/ por unidad) y coordenadas por estación (OSINERGMIN) en Postgres/PostGIS. Para cada estación candidata en el radio, calculamos distancia de ruta con motor de rutas: si hay destino, ΔD = D(o→s→d) − D(o→d); si no hay destino, ΔD = D(o→s). Estimamos combustible extra con eficiencia del vehículo e (km/L): fuelExtra = ΔD/e. Score económico: score = p_i*q + p_i*fuelExtra = p_i*q + p_i*(ΔD/e), donde q (qty) y e pueden venir del usuario o asumirse por config (assumed_qty, vehicleClass). Ordenamos por score ascendente y devolvemos top N con breakdown (purchaseCost y detourFuelCost). El tiempo se usa solo como guardrail (max_detour_min), no como objetivo. Guardar telemetría (inputs, supuestos, ΔD, fuelExtra, score y clicks) para calibrar defaults y luego aplicar ML (learning-to-rank/segmentación).
