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

const PEGMAN_WIDTH = 28;
const PEGMAN_HEIGHT = 38;

// Pegman con silueta inspirada en Google Maps.
// Base neutra; durante drag se eleva el brazo derecho.
const PEGMAN_SVG = `
<svg width="${PEGMAN_WIDTH}" height="${PEGMAN_HEIGHT}" viewBox="0 0 28 38" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="14" cy="35.5" rx="6.5" ry="1.8" fill="rgba(0,0,0,0.14)"/>
  <g data-j="body" style="transform-origin: 14px 16px; transform-box: fill-box;">
    <g data-j="leg-l" style="transform-origin: 14px 24px; transform-box: fill-box;">
      <line x1="14" y1="24" x2="9.5" y2="33" stroke="#d08700" stroke-width="3.2" stroke-linecap="round"/>
    </g>
    <g data-j="leg-r" style="transform-origin: 14px 24px; transform-box: fill-box;">
      <line x1="14" y1="24" x2="18.5" y2="33" stroke="#d08700" stroke-width="3.2" stroke-linecap="round"/>
    </g>
    <ellipse cx="9.3" cy="33.4" rx="2.1" ry="1" fill="#b46a00"/>
    <ellipse cx="18.7" cy="33.4" rx="2.1" ry="1" fill="#b46a00"/>
    <g data-j="arm-l" style="transform-origin: 14px 16px; transform-box: fill-box;">
      <line x1="14" y1="16" x2="8" y2="22" stroke="#d08700" stroke-width="3.2" stroke-linecap="round"/>
    </g>
    <g data-j="arm-r" style="transform-origin: 14px 16px; transform-box: fill-box;">
      <line x1="14" y1="16" x2="20" y2="22" stroke="#d08700" stroke-width="3.2" stroke-linecap="round"/>
    </g>
    <rect x="10" y="13.2" width="8" height="11.2" rx="4.2" fill="#fbbc04" stroke="#d08700" stroke-width="1"/>
    <g data-j="head" style="transform-origin: 14px 8px; transform-box: fill-box;">
      <circle cx="14" cy="8" r="5.3" fill="#fbbc04" stroke="#d08700" stroke-width="1"/>
      <rect x="10.7" y="6.2" width="6.6" height="2.5" rx="1.2" fill="#8f5a00"/>
      <circle cx="12.2" cy="7.5" r="0.6" fill="#fdf7e3"/>
      <circle cx="15.8" cy="7.5" r="0.6" fill="#fdf7e3"/>
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
    const pegmanRef = useRef<HTMLSpanElement | null>(null);
    const ghostRef = useRef<HTMLDivElement | null>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        const pegmanIcon = pegmanRef.current;
        if (!pegmanIcon) return;

        setIsDragging(true);

        const sourceRect = pegmanIcon.getBoundingClientRect();
        const grabOffsetX = clamp(e.clientX - sourceRect.left, 0, sourceRect.width);
        const grabOffsetY = clamp(e.clientY - sourceRect.top, 0, sourceRect.height);

        const ghost = document.createElement("div");
        ghost.innerHTML = pegmanIcon.innerHTML;
        ghost.style.cssText = `
            position: fixed;
            z-index: 99999;
            pointer-events: none;
            width: ${sourceRect.width}px;
            height: ${sourceRect.height}px;
            filter: drop-shadow(0 6px 14px rgba(0,0,0,0.3));
            left: ${e.clientX - grabOffsetX}px;
            top: ${e.clientY - grabOffsetY}px;
            animation: pegman-pickup 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        `;
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
            armR:  { el: q("arm-r"), angle: -42, vel: 0 },
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
            j.body.vel += -j.body.angle * 0.07;
            j.body.vel *= 0.86;
            j.body.angle = clamp(j.body.angle + j.body.vel, -32, 32);

            // ── Head: whiplash counter-rotation ──
            const headTarget = -j.body.angle * 0.30;
            j.head.vel += (headTarget - j.head.angle) * 0.20;
            j.head.vel *= 0.70;
            j.head.angle = clamp(j.head.angle + j.head.vel, -18, 18);

            // ── Right arm: raised while dragging ──
            const rightArmTarget = -48 - j.body.angle * 0.2;
            j.armR.vel += (rightArmTarget - j.armR.angle) * 0.20;
            j.armR.vel *= 0.74;
            j.armR.angle = clamp(j.armR.angle + j.armR.vel, -78, -16);

            // ── Left arm: loose pendulum ──
            j.armL.vel += (-j.body.vel * 1.8 - j.armL.angle * 0.06);
            j.armL.vel *= 0.80;
            j.armL.angle = clamp(j.armL.angle + j.armL.vel, -60, 60);

            // ── Legs: walking cycle ──
            const speed = Math.abs(smoothVx);
            walkPhase += speed * 0.15 + 0.02;
            const walkAmp = clamp(speed * 7, 3, 22);
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
                ghostRef.current.style.left = `${ev.clientX - grabOffsetX}px`;
                ghostRef.current.style.top = `${ev.clientY - grabOffsetY}px`;
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
                <button
                    type="button"
                    onMouseDown={handleMouseDown}
                    className={`select-none appearance-none bg-transparent border-0 p-0 leading-none transition-opacity duration-200 ${
                        isDragging ? "opacity-30" : "pegman-icon cursor-grab active:cursor-grabbing"
                    }`}
                    title="Arrastra al mapa"
                    aria-label="Arrastra pegman al mapa"
                    style={{ width: `${PEGMAN_WIDTH}px`, height: `${PEGMAN_HEIGHT}px` }}
                >
                    <span
                        ref={pegmanRef}
                        className="block leading-none"
                        style={{ width: `${PEGMAN_WIDTH}px`, height: `${PEGMAN_HEIGHT}px` }}
                        dangerouslySetInnerHTML={{ __html: PEGMAN_SVG }}
                    />
                </button>
            </div>
        </nav>
    );
}
