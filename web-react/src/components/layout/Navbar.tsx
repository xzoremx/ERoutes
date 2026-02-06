"use client";

import { useState, useRef, useCallback } from "react";
import { Fuel } from "lucide-react";

interface NavLink {
    href: string;
    label: string;
}

interface NavbarProps {
    brandName?: string;
    links?: NavLink[];
}

const PEGMAN_SIZE = 30;

function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
}

export function Navbar({
    brandName = "ERoutes",
    links = [
        { href: "#footer", label: "Contacto" },
    ],
}: NavbarProps) {
    const [isDragging, setIsDragging] = useState(false);
    const pegmanRef = useRef<HTMLButtonElement | null>(null);
    const ghostRef = useRef<HTMLDivElement | null>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        const pegmanControl = pegmanRef.current;
        if (!pegmanControl) return;

        setIsDragging(true);

        const sourceRect = pegmanControl.getBoundingClientRect();
        const grabOffsetX = clamp(e.clientX - sourceRect.left, 0, sourceRect.width);
        const grabOffsetY = clamp(e.clientY - sourceRect.top, 0, sourceRect.height);

        const ghost = document.createElement("div");
        ghost.className = "pegman-control pegman-control-ghost";
        ghost.innerHTML = '<span class="pegman-button" aria-hidden="true"></span>';
        ghost.style.cssText = `
            position: fixed;
            z-index: 99999;
            pointer-events: none;
            width: ${sourceRect.width}px;
            height: ${sourceRect.height}px;
            left: ${e.clientX - grabOffsetX}px;
            top: ${e.clientY - grabOffsetY}px;
        `;
        document.body.appendChild(ghost);
        ghostRef.current = ghost;

        document.body.style.cursor = "grabbing";
        document.body.style.userSelect = "none";

        document.dispatchEvent(new CustomEvent("eroutes:pegman-drag-start"));

        const onMouseMove = (ev: MouseEvent) => {
            if (ghostRef.current) {
                ghostRef.current.style.left = `${ev.clientX - grabOffsetX}px`;
                ghostRef.current.style.top = `${ev.clientY - grabOffsetY}px`;
            }

            document.dispatchEvent(new CustomEvent("eroutes:pegman-drag-move", {
                detail: { clientX: ev.clientX, clientY: ev.clientY },
            }));
        };

        const onMouseUp = (ev: MouseEvent) => {
            document.dispatchEvent(new CustomEvent("eroutes:pegman-drag-end", {
                detail: { clientX: ev.clientX, clientY: ev.clientY },
            }));

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
                <Fuel className="w-6 h-6 text-slate-900" />
                <span className="text-xl font-bold text-slate-900 tracking-tight font-nunito">
                    {brandName}
                </span>
            </div>

            <div className="flex items-center gap-4 md:gap-8 text-[15px] font-medium text-slate-700">
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            className="hover:text-black transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Pegman: sprite states inspired by leaflet-pegman */}
                <button
                    ref={pegmanRef}
                    type="button"
                    onMouseDown={handleMouseDown}
                    className={`pegman-control select-none appearance-none border-0 p-0 leading-none transition-opacity duration-200 ${
                        isDragging ? "opacity-30 dragging" : ""
                    }`}
                    title="Arrastra al mapa"
                    aria-label="Arrastra pegman al mapa"
                    style={{ width: `${PEGMAN_SIZE}px`, height: `${PEGMAN_SIZE}px` }}
                >
                    <span
                        className="pegman-button"
                        aria-hidden="true"
                    />
                </button>
            </div>
        </nav>
    );
}
