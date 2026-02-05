"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// Tipos para marcadores
export type LatLng = {
  lat: number;
  lng: number;
};

export type MapMarkerModel = {
  id: string;
  position: LatLng;
  title?: string;
  label?: string;
  priceText?: string;
  color?: string;
};

export type MapViewProps = {
  center: LatLng;
  zoom: number;
  markers?: MapMarkerModel[];
  onMapClick?: (latlng: LatLng) => void;
  className?: string;
};

// Componente estable para recentrar el mapa y manejar clicks
// Definido fuera de MapViewInternal para tener identidad estable (no se recrea en cada render)
function MapController({
  center,
  zoom,
  onMapClick,
}: {
  center: LatLng;
  zoom: number;
  onMapClick?: (latlng: LatLng) => void;
}) {
  const { useMap, useMapEvents } = require("react-leaflet");
  const map = useMap();
  const isFirstRender = useRef(true);

  // Recentrar el mapa cuando cambia center/zoom (skip en mount inicial)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    map.flyTo([center.lat, center.lng], zoom, { duration: 1.5 });
  }, [map, center.lat, center.lng, zoom]);

  // Manejar clicks en el mapa
  useMapEvents({
    click: (e: { latlng: { lat: number; lng: number } }) => {
      if (onMapClick) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });

  return null;
}

// Componente interno que usa Leaflet (solo se carga en cliente via dynamic)
function MapViewInternal({ center, zoom, markers = [], onMapClick, className }: MapViewProps) {
  const L = require("leaflet");
  const { MapContainer, TileLayer, Marker, Popup } = require("react-leaflet");

  // Fix para iconos de Leaflet en Next.js
  delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });

  // Crear icono de precio estilo glass con puntero preciso
  function createPriceIcon(priceText: string, color: string = "#0f172a") {
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        ">
          <div style="
            background: rgba(255, 255, 255, 0.65);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.75);
            border-radius: 10px;
            padding: 5px 10px;
            font-family: -apple-system, 'SF Pro Display', 'SF Pro Text', system-ui, BlinkMacSystemFont, sans-serif;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: -0.2px;
            color: ${color};
            white-space: nowrap;
            box-shadow: 0 4px 16px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06);
          ">
            ${priceText}
          </div>
          <div style="
            width: 2px;
            height: 10px;
            background: ${color};
            opacity: 0.6;
          "></div>
          <div style="
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: ${color};
            box-shadow: 0 0 0 2px rgba(255,255,255,0.8);
          "></div>
        </div>
      `,
      iconSize: [80, 48],
      iconAnchor: [40, 48],
    });
  }

  // Crear icono de pin simple (para ubicación del usuario, etc.)
  function createPinIcon(color: string = "#0f172a") {
    return L.divIcon({
      className: "custom-pin",
      html: `
        <div style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        ">
          <div style="
            width: 20px;
            height: 20px;
            background: ${color};
            border: 3px solid rgba(255,255,255,0.9);
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          "></div>
          <div style="
            width: 2px;
            height: 6px;
            background: ${color};
            opacity: 0.5;
            margin-top: -1px;
          "></div>
        </div>
      `,
      iconSize: [20, 28],
      iconAnchor: [10, 28],
    });
  }

  return (
    <div className={className}>
      <div className="h-[420px] w-full overflow-hidden rounded border border-slate-200">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={center} zoom={zoom} onMapClick={onMapClick} />
          {markers.map((m) => (
            <Marker
              key={m.id}
              position={[m.position.lat, m.position.lng]}
              icon={
                m.priceText
                  ? createPriceIcon(m.priceText, m.color)
                  : createPinIcon(m.color)
              }
            >
              {(m.title || m.label) && (
                <Popup>
                  {m.title && <div className="font-semibold">{m.title}</div>}
                  {m.label && <div className="text-sm text-slate-600">{m.label}</div>}
                </Popup>
              )}
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

// Exportar con dynamic import para evitar SSR
export const MapView = dynamic(() => Promise.resolve(MapViewInternal), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full animate-pulse rounded border border-slate-200 bg-slate-100" />
  ),
});

// También exportar tipos
export type { LatLng as LatLngLiteral };
