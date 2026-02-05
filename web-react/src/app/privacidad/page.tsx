import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Política de Privacidad | ERoutes",
    description: "Política de privacidad y protección de datos de ERoutes",
};

export default function PrivacidadPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-[#ABCDE9] to-[#EAE3D6] py-16 px-4">
            <article className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 text-center">
                    Política de Privacidad
                </h1>
                <p className="text-sm text-slate-500 mb-8 text-center">
                    Última actualización: Febrero 2026
                </p>

                <div className="prose prose-slate max-w-none text-justify">
                    <p className="text-slate-600 mb-6">
                        En ERoutes, respetamos tu privacidad. Esta política explica qué información recopilamos, cómo la usamos y tus derechos sobre ella.
                    </p>

                    <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4 text-center">
                        1. Información que Recopilamos
                    </h2>
                    <p className="text-slate-600 mb-2">
                        Podemos recopilar la siguiente información cuando usas ERoutes:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 mb-4 space-y-2">
                        <li>
                            <strong>Ubicación GPS:</strong> Solo cuando otorgas permiso, para mostrarte estaciones cercanas.
                        </li>
                        <li>
                            <strong>Tipo de vehículo:</strong> Para calcular el consumo estimado de combustible.
                        </li>
                        <li>
                            <strong>Tipo de combustible:</strong> Para filtrar estaciones que ofrecen el combustible que necesitas.
                        </li>
                        <li>
                            <strong>Cantidad de combustible:</strong> Para calcular el costo estimado de tu reabastecimiento.
                        </li>
                    </ul>

                    <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4 text-center">
                        2. Cómo Usamos tu Información
                    </h2>
                    <p className="text-slate-600 mb-2">
                        Utilizamos la información recopilada exclusivamente para:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 mb-4 space-y-2">
                        <li>Mostrarte las estaciones de servicio más cercanas a tu ubicación</li>
                        <li>Calcular rutas óptimas considerando precio y distancia</li>
                        <li>Personalizar recomendaciones según tu tipo de vehículo y combustible</li>
                        <li>Mejorar la calidad del servicio</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4 text-center">
                        3. Lo que NO Hacemos
                    </h2>
                    <ul className="list-disc list-inside text-slate-600 mb-4 space-y-2">
                        <li>NO vendemos tu información a terceros</li>
                        <li>NO compartimos tu ubicación con anunciantes</li>
                        <li>NO almacenamos tu historial de ubicaciones</li>
                        <li>NO requerimos crear una cuenta para usar el servicio</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4 text-center">
                        4. Almacenamiento de Datos
                    </h2>
                    <p className="text-slate-600 mb-4">
                        Las preferencias de tu vehículo y combustible se almacenan localmente en tu navegador (localStorage). Puedes borrar estos datos en cualquier momento limpiando los datos del sitio desde tu navegador.
                    </p>

                    <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4 text-center">
                        5. Permisos de Ubicación
                    </h2>
                    <p className="text-slate-600 mb-4">
                        El acceso a tu ubicación GPS es completamente opcional. Puedes:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 mb-4 space-y-2">
                        <li>Denegar el permiso y usar el servicio ingresando una ubicación manualmente</li>
                        <li>Revocar el permiso en cualquier momento desde la configuración de tu navegador</li>
                        <li>Tu ubicación solo se usa en el momento de la consulta, no se guarda</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4 text-center">
                        6. Servicios de Terceros
                    </h2>
                    <p className="text-slate-600 mb-4">
                        ERoutes utiliza servicios de mapas para mostrar ubicaciones. Estos servicios tienen sus propias políticas de privacidad que te recomendamos revisar.
                    </p>

                    <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4 text-center">
                        7. Tus Derechos
                    </h2>
                    <p className="text-slate-600 mb-4">
                        De acuerdo con la Ley de Protección de Datos Personales del Perú (Ley N° 29733), tienes derecho a acceder, rectificar y eliminar tus datos personales. Como ERoutes no almacena datos personales en servidores, puedes ejercer estos derechos directamente desde tu navegador.
                    </p>

                    <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4 text-center">
                        8. Cambios a esta Política
                    </h2>
                    <p className="text-slate-600 mb-4">
                        Podemos actualizar esta política ocasionalmente. Te notificaremos de cambios significativos publicando la nueva política en esta página.
                    </p>

                    <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4 text-center">
                        9. Contacto
                    </h2>
                    <p className="text-slate-600 mb-4">
                        Si tienes preguntas sobre esta política de privacidad, contáctanos en:{" "}
                        <a
                            href="mailto:renato.huamani@pucp.edu.pe"
                            className="text-blue-600 hover:underline"
                        >
                            mail
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
