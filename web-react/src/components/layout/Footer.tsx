interface FooterLink {
    href: string;
    label: string;
}

interface FooterColumn {
    title: string;
    links: FooterLink[];
}

interface FooterProps {
    brandName?: string;
    brandDescription?: string;
    columns?: FooterColumn[];
    copyright?: string;
}

export function Footer({
    brandName = "ERoutes",
    brandDescription = "Tu aplicación de confianza para encontrar las estaciones de servicio más cercanas y económicas.",
    columns = [
        {
            title: "Producto",
            links: [
                { href: "#", label: "Características" },
            ],
        },
        {
            title: "Información",
            links: [
                { href: "mailto:renato.huamani@pucp.edu.pe", label: "Contacto" },
                { href: "/terminos", label: "Términos de uso" },
                { href: "/privacidad", label: "Privacidad" },
            ],
        },
    ],
    copyright = "© 2026 ERoutes. Created by",
}: FooterProps) {
    return (
        <section id="footer" className="overflow-hidden bg-[#F6F4F0] w-full z-10 border-white/40 border-t pt-32 pb-0 relative">
            <div className="max-w-7xl mx-auto px-6">
                <footer className="w-full max-w-7xl z-10 mx-auto pt-12 pr-6 pb-12 pl-6 relative">
                    <div className="bg-[#D3E4F4] rounded-[40px] p-8 md:p-12 lg:p-16 shadow-sm border border-white/20">
                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-16 justify-between">
                            {/* Brand Section */}
                            <div className="max-w-sm">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-6 h-6 bg-[#1A1A1A] rounded-tr-md rounded-bl-md"></div>
                                    <span className="text-xl font-semibold text-[#1A1A1A] tracking-tight font-nunito">
                                        {brandName}
                                    </span>
                                </div>
                                <p className="text-[15px] leading-relaxed text-slate-600 font-medium font-sans mb-8">
                                    {brandDescription}
                                </p>
                            </div>

                            {/* Links Section */}
                            <div className="flex gap-12 sm:gap-24">
                                {columns.map((column, index) => (
                                    <div key={index} className="flex flex-col gap-4">
                                        <h4 className="text-xs font-semibold tracking-widest text-[#1A1A1A] uppercase mb-1 font-nunito">
                                            {column.title}
                                        </h4>
                                        {column.links.map((link, linkIndex) => (
                                            <a
                                                key={linkIndex}
                                                href={link.href}
                                                className="text-[15px] text-slate-600 hover:text-[#1A1A1A] transition-colors font-sans"
                                            >
                                                {link.label}
                                            </a>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-slate-900/5 mb-8"></div>

                        {/* Bottom Section */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[13px] text-slate-500 font-sans">
                            <div>
                                {copyright}{" "}
                                <span className="font-semibold text-slate-900">
                                    zorem
                                </span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </section>
    );
}
