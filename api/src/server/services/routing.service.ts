import { env } from "../app/env";
import { logger } from "../app/logger";

// =============================================
// Tipos
// =============================================

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RouteMetrics {
  distanceKm: number;
  durationMin: number;
}

interface OSRMRoute {
  distance: number; // metros
  duration: number; // segundos
}

interface OSRMResponse {
  code: string;
  routes?: OSRMRoute[];
  message?: string;
}

// =============================================
// Configuración
// =============================================

const OSRM_BASE_URL = env.OSRM_BASE_URL;
const OSRM_TIMEOUT_MS = 10000;

// =============================================
// Funciones auxiliares
// =============================================

function formatCoords(coords: Coordinates): string {
  // OSRM usa formato: lng,lat (no lat,lng)
  return `${coords.lng},${coords.lat}`;
}

function metersToKm(meters: number): number {
  return Math.round((meters / 1000) * 100) / 100; // 2 decimales
}

function secondsToMinutes(seconds: number): number {
  return Math.round((seconds / 60) * 10) / 10; // 1 decimal
}

// =============================================
// Servicio principal
// =============================================

/**
 * Obtiene métricas de ruta entre dos puntos usando OSRM
 */
export async function getRouteMetrics(
  origin: Coordinates,
  destination: Coordinates
): Promise<RouteMetrics> {
  const coords = `${formatCoords(origin)};${formatCoords(destination)}`;
  const url = `${OSRM_BASE_URL}/route/v1/driving/${coords}?overview=false`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OSRM_TIMEOUT_MS);

    const response = await fetch(url, {
      method: "GET",
      headers: { "Accept": "application/json" },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OSRM returned ${response.status}: ${response.statusText}`);
    }

    const data: OSRMResponse = await response.json();

    if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
      throw new Error(`OSRM error: ${data.code} - ${data.message || "No route found"}`);
    }

    const route = data.routes[0];

    return {
      distanceKm: metersToKm(route.distance),
      durationMin: secondsToMinutes(route.duration)
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      logger.warn({ origin, destination }, "OSRM request timed out");
    } else {
      logger.error({ error, origin, destination }, "OSRM routing error");
    }
    throw error;
  }
}

/**
 * Obtiene métricas de ruta pasando por un waypoint intermedio
 * Ruta: origin -> waypoint -> destination
 */
export async function getRouteMetricsViaWaypoint(
  origin: Coordinates,
  waypoint: Coordinates,
  destination: Coordinates
): Promise<RouteMetrics> {
  const coords = `${formatCoords(origin)};${formatCoords(waypoint)};${formatCoords(destination)}`;
  const url = `${OSRM_BASE_URL}/route/v1/driving/${coords}?overview=false`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OSRM_TIMEOUT_MS);

    const response = await fetch(url, {
      method: "GET",
      headers: { "Accept": "application/json" },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OSRM returned ${response.status}: ${response.statusText}`);
    }

    const data: OSRMResponse = await response.json();

    if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
      throw new Error(`OSRM error: ${data.code} - ${data.message || "No route found"}`);
    }

    const route = data.routes[0];

    return {
      distanceKm: metersToKm(route.distance),
      durationMin: secondsToMinutes(route.duration)
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      logger.warn({ origin, waypoint, destination }, "OSRM request timed out");
    } else {
      logger.error({ error, origin, waypoint, destination }, "OSRM routing error (via waypoint)");
    }
    throw error;
  }
}

/**
 * Calcula distancia aproximada usando fórmula Haversine (sin API)
 * Útil como fallback o para filtrado inicial
 */
export function getHaversineDistanceKm(
  origin: Coordinates,
  destination: Coordinates
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRad(destination.lat - origin.lat);
  const dLng = toRad(destination.lng - origin.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(origin.lat)) *
      Math.cos(toRad(destination.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // 2 decimales
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Calcula el delta de distancia (desvío) para una estación
 * - Modo route: deltaKm = D(origin->station->destination) - D(origin->destination)
 * - Modo nearby: deltaKm = D(origin->station)
 */
export async function calculateDeltaDistance(
  origin: Coordinates,
  station: Coordinates,
  destination?: Coordinates
): Promise<{ deltaKm: number; totalKm: number; durationMin: number }> {
  if (destination) {
    // Modo route: calcular desvío
    const [directRoute, viaStationRoute] = await Promise.all([
      getRouteMetrics(origin, destination),
      getRouteMetricsViaWaypoint(origin, station, destination)
    ]);

    const deltaKm = Math.max(0, viaStationRoute.distanceKm - directRoute.distanceKm);

    return {
      deltaKm: Math.round(deltaKm * 100) / 100,
      totalKm: viaStationRoute.distanceKm,
      durationMin: viaStationRoute.durationMin
    };
  } else {
    // Modo nearby: distancia a la estación
    const route = await getRouteMetrics(origin, station);

    return {
      deltaKm: route.distanceKm,
      totalKm: route.distanceKm,
      durationMin: route.durationMin
    };
  }
}
