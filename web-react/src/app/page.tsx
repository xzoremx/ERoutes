"use client";

import { useState, useCallback, useMemo } from "react";
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

  // Generar estaciones demo alrededor de la ubicación del usuario
  const demoStations = useMemo((): MapMarkerModel[] => {
    if (!userLocation) return [];
    const { lat, lng } = userLocation;
    return [
      { id: "st-1", position: { lat: lat + 0.008, lng: lng - 0.005 }, title: "Grifo Repsol", label: "Av. Javier Prado 1230", priceText: "S/ 15.80", color: "#16a34a" },
      { id: "st-2", position: { lat: lat - 0.006, lng: lng + 0.009 }, title: "Primax Express", label: "Av. Arequipa 890", priceText: "S/ 16.20", color: "#eab308" },
      { id: "st-3", position: { lat: lat + 0.003, lng: lng + 0.012 }, title: "Petroperú", label: "Av. Brasil 456", priceText: "S/ 16.50", color: "#ef4444" },
      { id: "st-4", position: { lat: lat - 0.010, lng: lng - 0.003 }, title: "Pecsa", label: "Av. Angamos 1567", priceText: "S/ 15.95", color: "#16a34a" },
      { id: "st-5", position: { lat: lat + 0.005, lng: lng - 0.011 }, title: "Grifo Shell", label: "Av. Benavides 3420", priceText: "S/ 16.35", color: "#eab308" },
    ];
  }, [userLocation]);

  // Marcadores para el mapa según modo
  const mapMarkers = useMemo((): MapMarkerModel[] => {
    if (!userLocation) return [];

    const userMarker: MapMarkerModel = {
      id: "user-location",
      position: userLocation,
      title: "Tu ubicación",
      label: "Estás aquí",
      color: "#3b82f6",
    };

    // Modo enhanced: usuario + estaciones con precios
    if (gpsActivated) {
      return [userMarker, ...demoStations];
    }

    // Modo básico: solo usuario
    return [userMarker];
  }, [userLocation, gpsActivated, demoStations]);

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
                    text: "Ver Dashboard",
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
                        <p className="text-sm text-slate-500">Precios de Gasohol 90</p>
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
              <PublicDashboard />
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
