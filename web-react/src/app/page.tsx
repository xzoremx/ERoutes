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

export default function HomePage() {
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
          />

          {/* Public Dashboard with Real Data */}
          <div
            className="w-full max-w-[1100px] animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <PublicDashboard />
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
