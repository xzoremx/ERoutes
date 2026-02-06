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
const GHOST_SIZE = 48;
const CENTER_FRAME = 8;
const MAX_FRAME = 16;

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

        // Ghost grab offset: centered horizontally, near top vertically (hang point)
        const ghostGrabX = GHOST_SIZE / 2;
        const ghostGrabY = GHOST_SIZE * 0.12;

        const ghost = document.createElement("div");
        ghost.className = "pegman-control pegman-control-ghost";
        ghost.innerHTML = '<span class="pegman-button" aria-hidden="true"></span>';
        ghost.style.cssText = `
            position: fixed;
            z-index: 99999;
            pointer-events: none;
            width: ${GHOST_SIZE}px;
            height: ${GHOST_SIZE}px;
            left: ${e.clientX - ghostGrabX}px;
            top: ${e.clientY - ghostGrabY}px;
        `;
        document.body.appendChild(ghost);
        ghostRef.current = ghost;

        const pegmanSpan = ghost.querySelector(".pegman-button") as HTMLElement;

        // --- Sprite sway engine: velocity → frame index → background-position ---
        let lastClientX = e.clientX;
        let smoothed = 0;   // smoothed normalized velocity, range -1..1
        let target = 0;

        // After pickup animation (220ms) ends, clear it so JS can drive updates
        const pickupTimer = setTimeout(() => {
            if (ghostRef.current) {
                ghostRef.current.style.animation = "none";
            }
        }, 250);

        // rAF loop: lerp smoothed toward target, decay target, pick frame
        const updateFrame = () => {
            smoothed += (target - smoothed) * 0.18;
            target *= 0.92;
            if (Math.abs(smoothed) < 0.02) smoothed = 0;

            const frameIndex = clamp(
                CENTER_FRAME + Math.round(smoothed * 8),
                0,
                MAX_FRAME,
            );
            if (pegmanSpan) {
                pegmanSpan.style.backgroundPosition = `0 -${frameIndex * GHOST_SIZE}px`;
            }
            animFrame = requestAnimationFrame(updateFrame);
        };
        let animFrame = requestAnimationFrame(updateFrame);
        // --- End sprite sway engine ---

        document.body.style.cursor = "grabbing";
        document.body.style.userSelect = "none";

        document.dispatchEvent(new CustomEvent("eroutes:pegman-drag-start"));

        const onMouseMove = (ev: MouseEvent) => {
            if (ghostRef.current) {
                ghostRef.current.style.left = `${ev.clientX - ghostGrabX}px`;
                ghostRef.current.style.top = `${ev.clientY - ghostGrabY}px`;

                // Velocity → normalized target (-1..1); 12px delta = full swing
                const deltaX = ev.clientX - lastClientX;
                target = clamp(-deltaX / 12, -1, 1);
                lastClientX = ev.clientX;
            }

            document.dispatchEvent(new CustomEvent("eroutes:pegman-drag-move", {
                detail: { clientX: ev.clientX, clientY: ev.clientY },
            }));
        };

        const onMouseUp = (ev: MouseEvent) => {
            clearTimeout(pickupTimer);
            cancelAnimationFrame(animFrame);

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

            <div className="flex items-center gap-2 md:gap-3 text-[15px] font-medium text-[#F2B832]">
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
