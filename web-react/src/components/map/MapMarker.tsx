"use client";

import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

export type MapMarkerProps = {
  position: google.maps.LatLngLiteral;
  title?: string;
  color?: string;
  children?: React.ReactNode;
};

export function MapMarker({ position, title, color, children }: MapMarkerProps) {
  return (
    <AdvancedMarker position={position} title={title}>
      {children ?? (
        <Pin
          background={color ?? "#0f172a"}
          borderColor={color ?? "#0f172a"}
          glyphColor="#ffffff"
        />
      )}
    </AdvancedMarker>
  );
}
