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

// SVG del pegman con articulaciones (cada <g data-j> es un joint)
const PEGMAN_SVG = `
<svg width="44" height="60" viewBox="0 0 44 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="22" cy="58" rx="8" ry="2.5" fill="rgba(0,0,0,0.10)"/>
  <g data-j="body" style="transform-origin: 22px 14px;">
    <g data-j="leg-l" style="transform-origin: 18px 34px;">
      <line x1="18" y1="34" x2="13" y2="50" stroke="#92400e" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="13" cy="50" r="2" fill="#78350f"/>
    </g>
    <g data-j="leg-r" style="transform-origin: 26px 34px;">
      <line x1="26" y1="34" x2="31" y2="50" stroke="#92400e" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="31" cy="50" r="2" fill="#78350f"/>
    </g>
    <rect x="15" y="19" width="14" height="16" rx="4" fill="#f59e0b"/>
    <g data-j="arm-l" style="transform-origin: 15px 21px;">
      <line x1="15" y1="21" x2="6" y2="34" stroke="#fbbf24" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="6" cy="34" r="1.8" fill="#f59e0b"/>
    </g>
    <g data-j="arm-r" style="transform-origin: 29px 21px;">
      <line x1="29" y1="21" x2="38" y2="34" stroke="#fbbf24" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="38" cy="34" r="1.8" fill="#f59e0b"/>
    </g>
    <g data-j="head" style="transform-origin: 22px 17px;">
      <circle cx="22" cy="10" r="8" fill="#fbbf24"/>
      <circle cx="22" cy="10" r="8" fill="none" stroke="#f59e0b" stroke-width="0.8"/>
      <circle cx="19" cy="9" r="1.3" fill="#78350f"/>
      <circle cx="25" cy="9" r="1.3" fill="#78350f"/>
      <path d="M19.5 13 Q22 15.5 24.5 13" stroke="#78350f" stroke-width="0.9" fill="none" stroke-linecap="round"/>
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

        // Crear ghost
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
        let smoothVx = 0;       // smoothed horizontal velocity for legs
        let lastX = e.clientX;
        let lastY = e.clientY;
        let rafId: number;

        const physicsLoop = () => {
            // ── Body: main pendulum driven by mouse impulse ──
            j.body.vel += -j.body.angle * 0.06;
            j.body.vel *= 0.88;
            j.body.angle = clamp(j.body.angle + j.body.vel, -45, 45);

            // ── Head: whiplash — counter-rotates vs body with delay ──
            j.head.vel += (-j.body.vel * 0.5 - j.head.angle * 0.10);
            j.head.vel *= 0.72;
            j.head.angle = clamp(j.head.angle + j.head.vel, -25, 25);

            // ── Arms: loose pendulums, react to body velocity ──
            j.armL.vel += (j.body.vel * 2.2 - j.armL.angle * 0.04);
            j.armL.vel *= 0.80;
            j.armL.angle = clamp(j.armL.angle + j.armL.vel, -65, 65);

            j.armR.vel += (-j.body.vel * 2.2 - j.armR.angle * 0.04);
            j.armR.vel *= 0.80;
            j.armR.angle = clamp(j.armR.angle + j.armR.vel, -65, 65);

            // ── Legs: walking cycle driven by movement speed ──
            const speed = Math.abs(smoothVx);
            walkPhase += speed * 0.15 + 0.02; // base idle sway + speed-driven walk
            const walkAmp = clamp(speed * 10, 3, 30); // min 3° idle sway
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

            // Decay smoothed velocity when mouse isn't moving
            smoothVx *= 0.90;

            rafId = requestAnimationFrame(physicsLoop);
        };
        rafId = requestAnimationFrame(physicsLoop);

        // ── Mouse handlers ──
        const onMouseMove = (ev: MouseEvent) => {
            const dx = ev.clientX - lastX;
            const dy = ev.clientY - lastY;

            // Smoothed velocity for legs walk cycle
            smoothVx = smoothVx * 0.5 + dx * 0.5;

            // Impulse: mouse dx adds angular velocity to body
            j.body.vel += dx * 0.5;

            // Vertical movement also creates slight body tilt (subtle)
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

                {/* Pegman: icono arrastrable con skeleton physics */}
                <div
                    onMouseDown={handleMouseDown}
                    className={`cursor-grab select-none transition-all duration-200 ${
                        isDragging ? "opacity-30 scale-75" : "opacity-70 hover:opacity-100"
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
