/**
 * Servicio de Geocoding usando OpenRouteService
 * https://openrouteservice.org/dev/#/api-docs/geocode
 */

const ORS_BASE_URL = "https://api.openrouteservice.org";

export type GeocodingResult = {
  id: string;
  name: string;
  label: string;
  lat: number;
  lng: number;
  country?: string;
  region?: string;
  locality?: string;
};

export type GeocodingResponse = {
  results: GeocodingResult[];
  error?: string;
};

/**
 * Buscar direcciones por texto (geocoding)
 * @param query Texto de búsqueda (ej: "Av. Javier Prado, Lima")
 * @param options Opciones adicionales
 */
export async function searchAddress(
  query: string,
  options: {
    limit?: number;
    countryCode?: string; // ISO 3166-1 alpha-2 (ej: "PE" para Perú)
    boundingBox?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  } = {}
): Promise<GeocodingResponse> {
  const apiKey = process.env.NEXT_PUBLIC_ORS_API_KEY;

  if (!apiKey) {
    console.warn("NEXT_PUBLIC_ORS_API_KEY no configurada, geocoding deshabilitado");
    return { results: [], error: "API key no configurada" };
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    text: query,
    size: String(options.limit ?? 5),
  });

  // Filtrar por país (Perú por defecto)
  if (options.countryCode) {
    params.set("boundary.country", options.countryCode);
  }

  // Bounding box para Lima (opcional)
  if (options.boundingBox) {
    const [minLng, minLat, maxLng, maxLat] = options.boundingBox;
    params.set("boundary.rect.min_lon", String(minLng));
    params.set("boundary.rect.min_lat", String(minLat));
    params.set("boundary.rect.max_lon", String(maxLng));
    params.set("boundary.rect.max_lat", String(maxLat));
  }

  try {
    const response = await fetch(
      `${ORS_BASE_URL}/geocode/search?${params.toString()}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Geocoding error:", response.status, errorText);
      return { results: [], error: `Error ${response.status}` };
    }

    const data = await response.json();

    // Transformar respuesta de OpenRouteService (formato GeoJSON)
    const results: GeocodingResult[] = (data.features ?? []).map(
      (feature: {
        properties: {
          id?: string;
          name?: string;
          label?: string;
          country?: string;
          region?: string;
          locality?: string;
        };
        geometry: { coordinates: [number, number] };
      }) => ({
        id: feature.properties.id ?? crypto.randomUUID(),
        name: feature.properties.name ?? "",
        label: feature.properties.label ?? "",
        lng: feature.geometry.coordinates[0],
        lat: feature.geometry.coordinates[1],
        country: feature.properties.country,
        region: feature.properties.region,
        locality: feature.properties.locality,
      })
    );

    return { results };
  } catch (error) {
    console.error("Geocoding fetch error:", error);
    return { results: [], error: "Error de conexión" };
  }
}

/**
 * Geocoding inverso: obtener dirección desde coordenadas
 * @param lat Latitud
 * @param lng Longitud
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<GeocodingResult | null> {
  const apiKey = process.env.NEXT_PUBLIC_ORS_API_KEY;

  if (!apiKey) {
    console.warn("NEXT_PUBLIC_ORS_API_KEY no configurada");
    return null;
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    "point.lon": String(lng),
    "point.lat": String(lat),
    size: "1",
  });

  try {
    const response = await fetch(
      `${ORS_BASE_URL}/geocode/reverse?${params.toString()}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const feature = data.features?.[0];

    if (!feature) {
      return null;
    }

    return {
      id: feature.properties.id ?? crypto.randomUUID(),
      name: feature.properties.name ?? "",
      label: feature.properties.label ?? "",
      lng: feature.geometry.coordinates[0],
      lat: feature.geometry.coordinates[1],
      country: feature.properties.country,
      region: feature.properties.region,
      locality: feature.properties.locality,
    };
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}

/**
 * Bounding box de Lima para filtrar resultados
 */
export const LIMA_BOUNDING_BOX: [number, number, number, number] = [
  -77.2, // minLng (oeste)
  -12.3, // minLat (sur)
  -76.7, // maxLng (este)
  -11.8, // maxLat (norte)
];

/**
 * Buscar direcciones en Lima (helper)
 */
export function searchAddressInLima(
  query: string,
  limit: number = 5
): Promise<GeocodingResponse> {
  return searchAddress(query, {
    limit,
    countryCode: "PE",
    boundingBox: LIMA_BOUNDING_BOX,
  });
}
