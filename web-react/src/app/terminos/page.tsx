import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Términos de Uso | ERoutes",
    description: "Términos y condiciones de uso de ERoutes",
};

export default function TerminosPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-[#ABCDE9] to-[#EAE3D6] py-16 px-4">
            <article className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 text-center">
                    Términos de Uso
                </h1>
                <p className="text-sm text-slate-500 mb-8 text-center">
                    Última actualización: Febrero 2026
                </p>

                <div className="prose prose-slate max-w-none text-justify">
                    <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4 text-center">
                        1. Aceptación de los Términos
                    </h2>
                    <p className="text-slate-600 mb-4">
                        Al acceder y utilizar ERoutes, aceptas estos términos de uso. Si no estás de acuerdo con alguna parte de estos términos, no deberías usar nuestro servicio.
                    </p>

                    <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4 text-center">
                        2. Descripción del Servicio
                    </h2>
                    <p className="text-slate-600 mb-4">
                        ERoutes es una aplicación gratuita que te ayuda a encontrar las estaciones de servicio más cercanas y económicas según tu ubicación, tipo de vehículo y preferencias de combustible. El servicio es proporcionado &quot;tal cual&quot; sin garantías de ningún tipo.
                    </p>

                    <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4 text-center">
                        3. Información de Precios
                    </h2>
                    <p className="text-slate-600 mb-4">
                        Los precios de combustible mostrados son referenciales y pueden variar. ERoutes obtiene información de fuentes públicas y no garantiza la exactitud, actualidad o disponibilidad de los precios mostrados. Siempre verifica el precio en la estación antes de repostar.
                    </p>

                    <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4 text-center">
                        4. Uso de la Ubicación
                    </h2>
                    <p className="text-slate-600 mb-4">
                        Para ofrecerte resultados precisos, ERoutes puede solicitar acceso a tu ubicación GPS. Este permiso es opcional y puedes revocarlo en cualquier momento desde la configuración de tu navegador o dispositivo.
                    </p>

                    <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4 text-center">
                        5. Limitación de Responsabilidad
                    </h2>
                    <p className="text-slate-600 mb-4">
                        ERoutes no se hace responsable por decisiones tomadas basándose en la información proporcionada por el servicio. El usuario es responsable de verificar los precios y condiciones directamente en las estaciones de servicio.
                    </p>

                    <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4 text-center">
                        6. Uso Apropiado
                    </h2>
                    <p className="text-slate-600 mb-4">
                        Te comprometes a usar ERoutes únicamente para fines legales y de manera que no interfiera con el funcionamiento del servicio ni perjudique a otros usuarios.
                    </p>

                    <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4 text-center">
                        7. Modificaciones
                    </h2>
                    <p className="text-slate-600 mb-4">
                        Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en esta página.
                    </p>

                    <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4 text-center">
                        8. Contacto
                    </h2>
                    <p className="text-slate-600 mb-4">
                        Si tienes preguntas sobre estos términos, contáctanos en:{" "}
                        <a
                            href="mailto:renato.huamani@pucp.edu.pe"
                            className="text-blue-600 hover:underline"
                        >
                            renato.huamani@pucp.edu.pe
                        </a>
                    </p>
                </div>

                <div className="mt-12 pt-6 border-t border-slate-200">
                    <a
                        href="/"
                        className="text-blue-600 hover:underline text-sm"
                    >
                        ← Volver al inicio
                    </a>
                </div>
            </article>
        </main>
    );
}
