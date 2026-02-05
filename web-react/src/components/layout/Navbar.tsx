"use client";

import { useState } from "react";
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

                {/* Pegman: icono draggable para fijar ubicación en el mapa */}
                <div
                    draggable
                    onDragStart={(e) => {
                        e.dataTransfer.setData("application/eroutes-pegman", "1");
                        e.dataTransfer.effectAllowed = "move";
                        setIsDragging(true);
                    }}
                    onDragEnd={() => setIsDragging(false)}
                    className={`cursor-grab active:cursor-grabbing p-2 rounded-lg transition-all select-none ${
                        isDragging
                            ? "opacity-30 scale-90"
                            : "hover:bg-slate-100 opacity-100"
                    }`}
                    title="Arrastra al mapa para fijar ubicación"
                >
                    <PersonStanding className="w-5 h-5 text-slate-700" />
                </div>
            </div>
        </nav>
    );
}
