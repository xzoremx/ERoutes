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

// Pegman estilo traffic sign — silueta sólida, sin cara ni ropa
// Brazo izquierdo dibujado arriba (levantado = "lo estamos sosteniendo")
const PEGMAN_SVG = `
<svg width="44" height="60" viewBox="0 0 44 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="22" cy="57" rx="7" ry="2" fill="rgba(0,0,0,0.10)"/>
  <g data-j="body" style="transform-origin: 22px 16px;">
    <g data-j="leg-l" style="transform-origin: 22px 36px;">
      <line x1="22" y1="36" x2="14" y2="52" stroke="#d97706" stroke-width="4" stroke-linecap="round"/>
    </g>
    <g data-j="leg-r" style="transform-origin: 22px 36px;">
      <line x1="22" y1="36" x2="30" y2="52" stroke="#d97706" stroke-width="4" stroke-linecap="round"/>
    </g>
    <line x1="22" y1="18" x2="22" y2="36" stroke="#d97706" stroke-width="4" stroke-linecap="round"/>
    <g data-j="arm-l" style="transform-origin: 22px 23px;">
      <line x1="22" y1="23" x2="14" y2="13" stroke="#d97706" stroke-width="4" stroke-linecap="round"/>
    </g>
    <g data-j="arm-r" style="transform-origin: 22px 23px;">
      <line x1="22" y1="23" x2="32" y2="33" stroke="#d97706" stroke-width="4" stroke-linecap="round"/>
    </g>
    <g data-j="head" style="transform-origin: 22px 16px;">
      <circle cx="22" cy="10" r="7" fill="#d97706"/>
    </g>
  </g>
</svg>`;

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
    const ghostRef = useRef<HTMLDivElement | null>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);

        const ghost = document.createElement("div");
        ghost.style.cssText = `
            position: fixed;
            z-index: 99999;
            pointer-events: none;
            filter: drop-shadow(0 6px 14px rgba(0,0,0,0.3));
            left: ${e.clientX - 22}px;
            top: ${e.clientY - 10}px;
            animation: pegman-pickup 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        `;
        ghost.innerHTML = PEGMAN_SVG;
        document.body.appendChild(ghost);
        ghostRef.current = ghost;

        document.body.style.cursor = "grabbing";
        document.body.style.userSelect = "none";

        document.dispatchEvent(new CustomEvent("eroutes:pegman-drag-start"));

        // --- Skeleton physics ---
        const q = (s: string) => ghost.querySelector(`[data-j="${s}"]`) as SVGGElement | null;
        const j = {
            body:  { el: q("body"),  angle: 0, vel: 0 },
            head:  { el: q("head"),  angle: 0, vel: 0 },
            armL:  { el: q("arm-l"), angle: 0, vel: 0 },
            armR:  { el: q("arm-r"), angle: 0, vel: 0 },
            legL:  { el: q("leg-l"), angle: 0, vel: 0 },
            legR:  { el: q("leg-r"), angle: 0, vel: 0 },
        };

        let walkPhase = 0;
        let smoothVx = 0;
        let lastX = e.clientX;
        let lastY = e.clientY;
        let rafId: number;

        const physicsLoop = () => {
            // ── Body: main pendulum ──
            j.body.vel += -j.body.angle * 0.06;
            j.body.vel *= 0.88;
            j.body.angle = clamp(j.body.angle + j.body.vel, -45, 45);

            // ── Head: whiplash counter-rotation ──
            j.head.vel += (-j.body.vel * 0.5 - j.head.angle * 0.10);
            j.head.vel *= 0.72;
            j.head.angle = clamp(j.head.angle + j.head.vel, -25, 25);

            // ── Left arm: raised — stiff spring, small wiggles only ──
            j.armL.vel += (-j.body.vel * 0.3 - j.armL.angle * 0.15);
            j.armL.vel *= 0.78;
            j.armL.angle = clamp(j.armL.angle + j.armL.vel, -15, 20);

            // ── Right arm: loose pendulum ──
            j.armR.vel += (-j.body.vel * 2.2 - j.armR.angle * 0.04);
            j.armR.vel *= 0.80;
            j.armR.angle = clamp(j.armR.angle + j.armR.vel, -65, 65);

            // ── Legs: walking cycle ──
            const speed = Math.abs(smoothVx);
            walkPhase += speed * 0.15 + 0.02;
            const walkAmp = clamp(speed * 10, 3, 30);
            const walkTarget = Math.sin(walkPhase) * walkAmp;

            j.legL.vel += (walkTarget - j.legL.angle) * 0.18;
            j.legL.vel *= 0.72;
            j.legL.angle += j.legL.vel;

            j.legR.vel += (-walkTarget - j.legR.angle) * 0.18;
            j.legR.vel *= 0.72;
            j.legR.angle += j.legR.vel;

            // ── Apply transforms ──
            for (const part of Object.values(j)) {
                if (part.el) {
                    part.el.style.transform = `rotate(${part.angle}deg)`;
                }
            }

            smoothVx *= 0.90;
            rafId = requestAnimationFrame(physicsLoop);
        };
        rafId = requestAnimationFrame(physicsLoop);

        const onMouseMove = (ev: MouseEvent) => {
            const dx = ev.clientX - lastX;
            const dy = ev.clientY - lastY;

            smoothVx = smoothVx * 0.5 + dx * 0.5;
            j.body.vel += dx * 0.5;
            j.body.vel += dy * 0.08;

            lastX = ev.clientX;
            lastY = ev.clientY;

            if (ghostRef.current) {
                ghostRef.current.style.left = `${ev.clientX - 22}px`;
                ghostRef.current.style.top = `${ev.clientY - 10}px`;
            }

            document.dispatchEvent(new CustomEvent("eroutes:pegman-drag-move", {
                detail: { clientX: ev.clientX, clientY: ev.clientY },
            }));
        };

        const onMouseUp = (ev: MouseEvent) => {
            cancelAnimationFrame(rafId);

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

                {/* Pegman: hover sway + drag con skeleton physics */}
                <div
                    onMouseDown={handleMouseDown}
                    className={`select-none transition-opacity duration-200 ${
                        isDragging ? "opacity-30" : "pegman-icon cursor-grab"
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
