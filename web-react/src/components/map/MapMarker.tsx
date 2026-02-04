"use client";

// Este componente ya no se necesita como standalone ya que MapView
// maneja los marcadores internamente. Se mantiene para compatibilidad.

export type { LatLng, MapMarkerModel } from "./MapView";

// Re-export MapView para facilitar imports
export { MapView } from "./MapView";
