import Link from "next/link";

export default function HomePage() {
  return (
    <main className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">ERoutes</h1>
        <p className="text-slate-700">
          MVP: estaciones cercanas y recomendaciones (Lima).
        </p>
      </header>

      <nav className="flex gap-3">
        <Link className="underline" href="/recommend">
          Recomendaciones
        </Link>
        <Link className="underline" href="/sites">
          Sedes
        </Link>
      </nav>

      <section className="rounded border border-slate-200 p-4">
        <p className="text-sm text-slate-700">
          Próximo paso: conectar con la API y mostrar mapa/lista.
        </p>
      </section>
    </main>
  );
}
