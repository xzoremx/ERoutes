"use client";

import { useState, useCallback } from "react";
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
import { MapView, LatLng } from "@/components/map/MapView";

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

  // Marcadores para el mapa
  const mapMarkers = userLocation
    ? [
        {
          id: "user-location",
          position: userLocation,
          title: "Tu ubicación",
          label: "Estás aquí",
          color: "#3b82f6", // Azul
        },
      ]
    : [];

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
              <MapView
                center={userLocation || LIMA_CENTER}
                zoom={userLocation ? 15 : 12}
                markers={mapMarkers}
                className="map-large"
              />
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
