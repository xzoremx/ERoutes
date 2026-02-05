"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Navigation,
  Fuel,
} from "lucide-react";

// Layout Components
import { BackgroundLayer, Navbar, Footer } from "@/components/layout";

// Section Components
import { HeroSection, FeaturesSection } from "@/components/sections";

// Dashboard Components
import { PublicDashboard } from "@/components/dashboard";
import type { PublicDashboardProps } from "@/components/dashboard/PublicDashboard";

// Map Components
import { MapView, LatLng, MapMarkerModel } from "@/components/map/MapView";

// Lima centro como ubicación por defecto
const LIMA_CENTER: LatLng = { lat: -12.0464, lng: -77.0428 };

export default function HomePage() {
  const router = useRouter();

  // Estados para manejo de vistas y GPS
  const [activeView, setActiveView] = useState<"map" | "dashboard">("map");
  const [gpsActivated, setGpsActivated] = useState(false);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [isLoadingGps, setIsLoadingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Pre-fetch de stats y tendencias del dashboard al cargar la página
  const [dashboardStats, setDashboardStats] = useState<PublicDashboardProps["stats"]>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [dashboardTrends, setDashboardTrends] = useState<PublicDashboardProps["trends"]>(null);
  const [dashboardTrendsLoading, setDashboardTrendsLoading] = useState(true);
  const [dashboardTrendsError, setDashboardTrendsError] = useState<string | null>(null);

  useEffect(() => {
    async function prefetchDashboardData() {
      setDashboardLoading(true);
      setDashboardTrendsLoading(true);

      const [statsResult, trendsResult] = await Promise.allSettled([
        fetch("/api/stats").then((response) => response.json()),
        fetch("/api/prices-trends").then((response) => response.json()),
      ]);

      if (statsResult.status === "fulfilled" && statsResult.value?.success) {
        setDashboardStats(statsResult.value.data);
        setDashboardError(null);
      } else {
        setDashboardError("No se pudieron cargar las estadísticas");
      }

      if (trendsResult.status === "fulfilled" && trendsResult.value?.success) {
        setDashboardTrends(trendsResult.value.data);
        setDashboardTrendsError(null);
      } else {
        setDashboardTrendsError("No se pudo cargar la evolución de precios");
      }

      setDashboardLoading(false);
      setDashboardTrendsLoading(false);
    }

    prefetchDashboardData();
  }, []);

  // Función para activar GPS
  const activateGps = useCallback(async () => {
    if (!navigator.geolocation) {
      setGpsError("Tu navegador no soporta geolocalización");
      return;
    }

    setIsLoadingGps(true);
    setGpsError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutos de cache
        });
      });

      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setGpsActivated(true);
    } catch (error) {
      const geoError = error as GeolocationPositionError;
      if (geoError.code === geoError.PERMISSION_DENIED) {
        setGpsError("Permiso de ubicación denegado");
      } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
        setGpsError("Ubicación no disponible");
      } else if (geoError.code === geoError.TIMEOUT) {
        setGpsError("Tiempo de espera agotado");
      } else {
        setGpsError("Error al obtener ubicación");
      }
    } finally {
      setIsLoadingGps(false);
    }
  }, []);

  // Handler para el botón primario
  const handlePrimaryClick = useCallback(() => {
    // Si estamos viendo el dashboard, cambiar a mapa
    if (activeView === "dashboard") {
      setActiveView("map");
      return;
    }

    // Si el GPS ya está activado, ir a /recommend
    if (gpsActivated) {
      router.push("/recommend");
      return;
    }

    // Activar GPS
    activateGps();
  }, [activeView, gpsActivated, router, activateGps]);

  // Determinar texto del botón primario
  const getPrimaryButtonText = () => {
    if (activeView === "dashboard") return "Ver Mapa";
    if (gpsActivated) return "Explorar features";
    return "Navegar";
  };

  // Features data
  const featuresData = [
    {
      icon: MapPin,
      title: "Estaciones Cercanas",
      description: "Encuentra las gasolineras más cercanas a tu ubicación actual o a cualquier punto en el mapa con un solo clic.",
    },
    {
      icon: Fuel,
      title: "Precios en Tiempo Real",
      description: "Compara precios de combustible entre estaciones y ahorra dinero eligiendo la opción más económica para tu vehículo.",
    },
    {
      icon: Navigation,
      title: "Rutas Optimizadas",
      description: "Planifica tu ruta considerando precio y distancia. Te mostramos cuánto puedes ahorrar en cada reabastecimiento.",
    },
  ];

  // Estaciones obtenidas de la API
  const [stations, setStations] = useState<MapMarkerModel[]>([]);
  const [isLoadingStations, setIsLoadingStations] = useState(false);

  // Fetch estaciones reales cuando se activa GPS
  useEffect(() => {
    if (!gpsActivated || !userLocation) return;

    const fetchStations = async () => {
      setIsLoadingStations(true);
      try {
        const origin = `${userLocation.lat},${userLocation.lng}`;
        const res = await fetch(`/api/stations?origin=${origin}&radiusKm=15`);
        const json = await res.json();

        if (!json.success || !json.data?.length) {
          setStations([]);
          return;
        }

        // Extraer precios de GASOHOL_90 para determinar colores relativos
        const prices = json.data
          .map((s: { prices?: Record<string, { price: number }> }) => s.prices?.GASOHOL_90?.price)
          .filter((p: number | undefined): p is number => p != null);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const range = maxPrice - minPrice || 1;

        const mapped: MapMarkerModel[] = json.data.map(
          (s: { id: number; name: string; address: string; lat: number; lng: number; prices?: Record<string, { price: number }> }) => {
            const price = s.prices?.GASOHOL_90?.price;
            const priceText = price ? `S/ ${price.toFixed(2)}` : undefined;

            // Color relativo: verde (bajo) → amarillo (medio) → rojo (alto)
            let color = "#64748b"; // gris si no hay precio
            if (price != null) {
              const ratio = (price - minPrice) / range;
              if (ratio <= 0.33) color = "#16a34a";      // verde
              else if (ratio <= 0.66) color = "#ca8a04";  // amarillo oscuro
              else color = "#dc2626";                      // rojo
            }

            return {
              id: `st-${s.id}`,
              position: { lat: s.lat, lng: s.lng },
              title: s.name,
              label: s.address,
              priceText,
              color,
            };
          }
        );

        setStations(mapped);
      } catch (err) {
        console.error("Error fetching stations:", err);
        setStations([]);
      } finally {
        setIsLoadingStations(false);
      }
    };

    fetchStations();
  }, [gpsActivated, userLocation]);

  // Marcadores para el mapa según modo
  const mapMarkers = useMemo((): MapMarkerModel[] => {
    if (!userLocation) return [];

    const userMarker: MapMarkerModel = {
      id: "user-location",
      position: userLocation,
      title: "Tu ubicaci\u00f3n",
      label: "Est\u00e1s aqu\u00ed",
      color: "#3b82f6",
    };

    // Modo enhanced: usuario + estaciones reales
    if (gpsActivated) {
      return [userMarker, ...stations];
    }

    // Modo b\u00e1sico: solo usuario
    return [userMarker];
  }, [userLocation, gpsActivated, stations]);

  return (
    <div className="antialiased min-h-screen overflow-x-hidden selection:bg-black selection:text-white text-slate-800 font-sans bg-[#ABCDE9] relative">
      {/* Background Layer */}
      <BackgroundLayer />

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <main className="flex-grow flex flex-col items-center pt-16 pb-20 px-4 md:px-6 w-full max-w-7xl mx-auto">
          <HeroSection
            title={
              <>
                Ahorra en cada
                <br />
                reabastecimiento
              </>
            }
            description="Calculamos la ruta óptima hacia la estación de servicio más económica cerca de ti o en tu trayecto planificado."
            primaryCta={{
              text: getPrimaryButtonText(),
              onClick: handlePrimaryClick,
              loading: isLoadingGps,
            }}
            secondaryCta={
              activeView === "map"
                ? {
                    text: "Dashboard",
                    onClick: () => setActiveView("dashboard"),
                  }
                : undefined
            }
          />

          {/* Error de GPS */}
          {gpsError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm animate-slide-up">
              {gpsError}
            </div>
          )}

          {/* Vista condicional: Mapa o Dashboard */}
          <div
            className="w-full max-w-[1100px] animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            {activeView === "map" ? (
              gpsActivated ? (
                /* Modo Enhanced: mapa con header, leyenda y estaciones */
                <div
                  className="w-full bg-[#FDFBF9] rounded-[32px] shadow-2xl border border-white/60 overflow-hidden"
                  style={{ boxShadow: "0 50px 100px -20px rgba(50, 50, 93, 0.15), 0 30px 60px -30px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#F6F4F0] rounded-lg">
                        <Fuel className="w-5 h-5 text-slate-700" />
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-900 font-nunito">Estaciones Cercanas</h2>
                        <p className="text-sm text-slate-500">
                          {isLoadingStations
                            ? "Buscando estaciones..."
                            : `${stations.length} estaciones \u00b7 Gasohol 90`}
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-slate-600">Precio bajo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span className="text-slate-600">Precio medio</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-slate-600">Precio alto</span>
                      </div>
                    </div>
                  </div>
                  <MapView
                    center={userLocation || LIMA_CENTER}
                    zoom={14}
                    markers={mapMarkers}
                    className="map-large"
                  />
                </div>
              ) : (
                /* Modo Básico: mapa simple sin estaciones */
                <MapView
                  center={userLocation || LIMA_CENTER}
                  zoom={userLocation ? 15 : 12}
                  markers={mapMarkers}
                  className="map-large"
                />
              )
            ) : (
              <PublicDashboard
                stats={dashboardStats}
                loading={dashboardLoading}
                error={dashboardError}
                trends={dashboardTrends}
                trendsLoading={dashboardTrendsLoading}
                trendsError={dashboardTrendsError}
              />
            )}
          </div>
        </main>

        {/* Features Section */}
        <FeaturesSection
          badge="Tu Aliado en la Carretera"
          title="Todo lo que necesitas para ahorrar"
          description="Deja de adivinar dónde cargar combustible. Optimiza cada reabastecimiento con información precisa y rutas inteligentes."
          features={featuresData}
        />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
