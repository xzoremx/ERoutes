import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-3 p-4">
      <h2 className="text-lg font-semibold">Página no encontrada</h2>
      <Link className="underline" href="/">
        Volver al inicio
      </Link>
    </div>
  );
}
