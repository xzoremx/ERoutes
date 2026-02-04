"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-3 p-4">
      <h2 className="text-lg font-semibold">Ocurrió un error</h2>
      <p className="text-sm text-slate-700">{error.message}</p>
      <button
        className="rounded bg-slate-900 px-3 py-2 text-sm text-white"
        onClick={() => reset()}
        type="button"
      >
        Reintentar
      </button>
    </div>
  );
}
