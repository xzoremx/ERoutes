"use client";

import { useState, useRef, useCallback } from "react";
import { Fuel, PersonStanding } from "lucide-react";

interface NavLink {
    href: string;
    label: string;
}

interface NavbarProps {
    brandName?: string;
    links?: NavLink[];
}

export function Navbar({
    brandName = "ERoutes",
    links = [
        { href: "#footer", label: "Contacto" },
    ],
}: NavbarProps) {
    const [isDragging, setIsDragging] = useState(false);
    const ghostRef = useRef<HTMLDivElement | null>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);

        // Crear ghost animado que sigue al cursor (DOM real, no drag image)
        const ghost = document.createElement("div");
        ghost.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/></svg>`;
        ghost.style.cssText = `
            position: fixed;
            z-index: 99999;
            pointer-events: none;
            transform-origin: top center;
            animation: pegman-swing 0.3s ease-in-out infinite alternate;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.25));
            left: ${e.clientX - 18}px;
            top: ${e.clientY - 18}px;
        `;
        document.body.appendChild(ghost);
        ghostRef.current = ghost;

        // Cursor global grabbing
        document.body.style.cursor = "grabbing";
        document.body.style.userSelect = "none";

        // Notificar inicio
        document.dispatchEvent(new CustomEvent("eroutes:pegman-drag-start"));

        const onMouseMove = (ev: MouseEvent) => {
            if (ghostRef.current) {
                ghostRef.current.style.left = `${ev.clientX - 18}px`;
                ghostRef.current.style.top = `${ev.clientY - 18}px`;
            }
            document.dispatchEvent(new CustomEvent("eroutes:pegman-drag-move", {
                detail: { clientX: ev.clientX, clientY: ev.clientY },
            }));
        };

        const onMouseUp = (ev: MouseEvent) => {
            // Notificar drop
            document.dispatchEvent(new CustomEvent("eroutes:pegman-drag-end", {
                detail: { clientX: ev.clientX, clientY: ev.clientY },
            }));

            // Limpiar ghost
            if (ghostRef.current) {
                document.body.removeChild(ghostRef.current);
                ghostRef.current = null;
            }
            setIsDragging(false);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";

            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }, []);

    return (
        <nav className="w-full px-6 py-6 md:px-12 flex items-center justify-between max-w-7xl mx-auto animate-fade-in">
            <div className="flex items-center gap-2">
                {/* Logo Icon */}
                <Fuel className="w-6 h-6 text-slate-900" />
                <span className="text-xl font-bold text-slate-900 tracking-tight font-nunito">
                    {brandName}
                </span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-700">
                {links.map((link, index) => (
                    <a
                        key={index}
                        href={link.href}
                        className="hover:text-black transition-colors"
                    >
                        {link.label}
                    </a>
                ))}

                {/* Pegman: icono arrastrable con mouse tracking */}
                <div
                    onMouseDown={handleMouseDown}
                    className={`cursor-grab select-none transition-all duration-150 ${
                        isDragging ? "opacity-30 scale-90" : "opacity-70 hover:opacity-100"
                    }`}
                    title="Arrastra al mapa"
                >
                    <PersonStanding
                        className="w-6 h-6 text-amber-600 drop-shadow-sm"
                        strokeWidth={2.5}
                    />
                </div>
            </div>
        </nav>
    );
}
