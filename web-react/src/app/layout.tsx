import type { ReactNode } from "react";

import "./globals.css";

export const metadata = {
  title: "ERoutes",
  description: "Recomendación de estaciones de combustible en Perú"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto max-w-5xl p-4">{children}</div>
      </body>
    </html>
  );
}
