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
    const pegmanRef = useRef<HTMLDivElement>(null);
    const ghostRef = useRef<HTMLDivElement | null>(null);

    const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("application/eroutes-pegman", "1");
        e.dataTransfer.effectAllowed = "move";
        setIsDragging(true);

        // Crear ghost personalizado: pegman balanceándose
        const ghost = document.createElement("div");
        ghost.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/></svg>`;
        ghost.style.cssText = "position:fixed;top:-100px;left:-100px;pointer-events:none;animation:pegman-swing 0.4s ease-in-out infinite alternate;transform-origin:top center;";
        document.body.appendChild(ghost);
        ghostRef.current = ghost;

        e.dataTransfer.setDragImage(ghost, 16, 16);

        // Limpiar ghost después de que el browser lo capture
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (ghostRef.current) {
                    document.body.removeChild(ghostRef.current);
                    ghostRef.current = null;
                }
            });
        });
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

                {/* Pegman: icono libre draggable */}
                <div
                    ref={pegmanRef}
                    draggable
                    onDragStart={handleDragStart}
                    onDragEnd={() => setIsDragging(false)}
                    className={`cursor-grab active:cursor-grabbing select-none transition-all duration-150 ${
                        isDragging ? "opacity-0" : "opacity-70 hover:opacity-100"
                    }`}
                    style={{ transformOrigin: "top center" }}
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
