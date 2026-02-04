"use client";

import { APIProvider, AdvancedMarker, Map, Pin } from "@vis.gl/react-google-maps";

export type MapMarkerModel = {
  id: string;
  position: google.maps.LatLngLiteral;
  title?: string;
  label?: string;
  priceText?: string;
  color?: string;
};

export type MapViewProps = {
  center: google.maps.LatLngLiteral;
  zoom: number;
  markers?: MapMarkerModel[];
  className?: string;
};

export function MapView({ center, zoom, markers = [], className }: MapViewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;

  if (!apiKey) {
    return (
      <div className={className}>
        <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Falta configurar <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> en{" "}
          <code>web-react/.env.local</code>.
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <APIProvider apiKey={apiKey} libraries={["marker"]}>
        <div className="h-[420px] w-full overflow-hidden rounded border border-slate-200">
          <Map
            center={center}
            zoom={zoom}
            mapId={mapId}
            gestureHandling="greedy"
            disableDefaultUI={false}
          >
            {markers.map((m) => (
              <AdvancedMarker key={m.id} position={m.position} title={m.title}>
                {m.label || m.priceText ? (
                  <div className="rounded bg-white px-2 py-1 text-xs shadow">
                    {m.priceText ? (
                      <div className="font-semibold tabular-nums">{m.priceText}</div>
                    ) : null}
                    {m.label ? <div className="text-slate-600">{m.label}</div> : null}
                  </div>
                ) : (
                  <Pin
                    background={m.color ?? "#0f172a"}
                    borderColor={m.color ?? "#0f172a"}
                    glyphColor="#ffffff"
                  />
                )}
              </AdvancedMarker>
            ))}
          </Map>
        </div>
      </APIProvider>
    </div>
  );
}
