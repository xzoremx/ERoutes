"use client";

import { MapView } from "@/components/map/MapView";
import { MapPin, Navigation, Fuel } from "lucide-react";

export default function RecommendPage() {
  const limaCenter = { lat: -12.0464, lng: -77.0428 };

  return (
    <div className="antialiased min-h-screen overflow-x-hidden selection:bg-black selection:text-white text-slate-800 font-sans bg-[#ABCDE9] relative">

      {/* Background Layer: Sky Image & Cloud/Gradient Simulation */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Sky Background Image */}
        <img
          src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/bfd2f4cf-65ed-4b1a-86d1-a1710619267b_1600w.png"
          alt="Sky Background"
          className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply"
        />

        {/* Gradient Overlay to create the fade-to-warm-beige effect at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#A6CBE8]/20 via-[#BFD9EF]/40 to-[#EAE3D6]"></div>

        {/* Cloud Decoration Left */}
        <img
          src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg"
          className="absolute top-[20%] -left-[10%] w-[50%] opacity-40 mix-blend-screen blur-xl pointer-events-none"
          alt="cloud"
        />

        {/* Cloud Decoration Right */}
        <img
          src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg"
          className="absolute top-[30%] -right-[10%] w-[50%] opacity-40 mix-blend-screen blur-xl pointer-events-none"
          alt="cloud"
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Navigation */}
        <nav className="w-full px-6 py-6 md:px-12 flex items-center justify-between max-w-7xl mx-auto animate-fade-in">
          <div className="flex items-center gap-2">
            {/* Logo Icon */}
            <div className="w-6 h-6 bg-black rounded-tr-lg rounded-bl-lg"></div>
            <span className="text-xl font-bold text-slate-900 tracking-tight font-nunito">ERoutes</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-700">
            <a href="/" className="hover:text-black transition-colors">Inicio</a>
            <a href="/recommend" className="text-black font-semibold">Recomendaciones</a>
            <a href="/sites" className="hover:text-black transition-colors">Estaciones</a>
          </div>

          <div>
            <button className="bg-[#1A1A1A] text-white text-[15px] font-medium px-6 py-2.5 rounded-full hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Buscar rutas
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center pt-8 pb-20 px-4 md:px-6 w-full max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center max-w-4xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="md:text-5xl text-4xl font-semibold text-[#1A1A1A] tracking-tight font-nunito mb-4">
              Recomendaciones
            </h1>
            <p className="md:text-lg text-base font-medium text-slate-600 font-sans max-w-2xl mx-auto">
              Encuentra las mejores estaciones de combustible cerca de ti o en tu ruta con el mejor precio.
            </p>
          </div>

          {/* Mode Toggle Buttons */}
          <div className="flex items-center gap-4 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <button className="flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <MapPin className="w-4 h-4" />
              Cercano
            </button>
            <button className="flex items-center gap-2 bg-white/40 backdrop-blur-md border border-white/50 text-[#1A1A1A] px-6 py-3 rounded-full font-medium hover:bg-white/60 transition-all">
              <Navigation className="w-4 h-4" />
              Por ruta
            </button>
          </div>

          {/* Map Container */}
          <div
            className="w-full max-w-[1300px] bg-[#FDFBF9] rounded-[32px] shadow-2xl border border-white/60 overflow-hidden animate-slide-up"
            style={{ animationDelay: '0.3s', boxShadow: '0 50px 100px -20px rgba(50, 50, 93, 0.15), 0 30px 60px -30px rgba(0, 0, 0, 0.1)' }}
          >
            {/* Map Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F6F4F0] rounded-lg">
                  <Fuel className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 font-nunito">Mapa de Estaciones</h2>
                  <p className="text-sm text-slate-500">Lima Metropolitana</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-slate-600">Precio bajo</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="text-slate-600">Precio medio</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-slate-600">Precio alto</span>
                </div>
              </div>
            </div>

            {/* Map View - Much larger */}
            <MapView
              className="map-large"
              center={limaCenter}
              zoom={12}
              markers={[
                {
                  id: "demo-1",
                  position: limaCenter,
                  label: "Centro de Lima",
                  priceText: "S/ 15.80",
                  color: "#16a34a"
                },
                {
                  id: "demo-2",
                  position: { lat: -12.0864, lng: -77.0028 },
                  label: "San Isidro",
                  priceText: "S/ 16.20",
                  color: "#eab308"
                },
                {
                  id: "demo-3",
                  position: { lat: -12.1064, lng: -77.0328 },
                  label: "Miraflores",
                  priceText: "S/ 16.50",
                  color: "#ef4444"
                }
              ]}
            />
          </div>

        </main>
      </div>
    </div>
  );
}
