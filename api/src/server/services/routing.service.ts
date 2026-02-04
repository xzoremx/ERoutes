export type RouteMetrics = {
  distanceKm: number;
  durationMin?: number;
};

export async function getRouteMetrics(): Promise<RouteMetrics> {
  return { distanceKm: 0 };
}
