import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black">
      {/* Background Gradients/Blobs */}
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute -left-4 top-0 h-72 w-72 animate-blob rounded-full bg-blue-500 opacity-70 mix-blend-multiply blur-xl filter" />
        <div className="absolute -right-4 top-0 h-72 w-72 animate-blob rounded-full bg-purple-500 opacity-70 mix-blend-multiply blur-xl filter animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 h-72 w-72 animate-blob rounded-full bg-pink-500 opacity-70 mix-blend-multiply blur-xl filter animation-delay-4000" />
      </div>

      {/* Glass Container */}
      <div className="relative z-10 w-full max-w-md animate-fade-in-up rounded-2xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <header className="mb-8 space-y-2">
          <h1 className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
            ERoutes
          </h1>
          <p className="text-sm font-medium uppercase tracking-widest text-white/70">
            Estaciones & Recomendaciones
          </p>
        </header>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-4">
          <div className="group relative">
            <Link
              href="/recommend"
              className="block w-full rounded-xl bg-white/5 p-4 text-lg font-medium text-white transition-all duration-300 hover:bg-white/20 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20 md:text-xl"
            >
              Recomendaciones
            </Link>
          </div>

          <div className="group relative">
            <Link
              href="/sites"
              className="block w-full rounded-xl bg-white/5 p-4 text-lg font-medium text-white transition-all duration-300 hover:bg-white/20 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 md:text-xl"
            >
              Sedes
            </Link>
          </div>
        </nav>

        {/* Footer/Info */}
        <div className="mt-8 text-xs text-white/40">
          <p>Designed for Lima, Peru</p>
        </div>
      </div>
    </main>
  );
}
