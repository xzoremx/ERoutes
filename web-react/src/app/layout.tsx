import type { ReactNode } from "react";

import "./globals.css";

export const metadata = {
  title: "ERoutes",
  description: "Recomendación de estaciones de combustible en Perú"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-black text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
