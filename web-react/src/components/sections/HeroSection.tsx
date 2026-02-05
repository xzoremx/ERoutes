import { ReactNode } from "react";

interface HeroSectionProps {
    title: ReactNode;
    description: string;
    primaryCta?: {
        text: string;
        href: string;
    };
    secondaryCta?: {
        text: string;
        href: string;
    };
}

export function HeroSection({
    title,
    description,
    primaryCta = { text: "Navegar", href: "#" },
    secondaryCta = { text: "Ver Dashboard", href: "#" },
}: HeroSectionProps) {
    return (
        <div
            className="text-center max-w-4xl mx-auto mb-16 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
        >
            <h1 className="md:text-[80px] leading-[1] text-6xl font-semibold text-[#1A1A1A] tracking-tight font-nunito mb-8">
                {title}
            </h1>
            <p className="md:text-[19px] leading-relaxed text-lg font-medium text-slate-600 font-sans max-w-2xl mr-auto mb-10 ml-auto">
                {description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                    href={primaryCta.href}
                    className="text-[17px] hover:bg-black transition-all hover:shadow-xl hover:-translate-y-0.5 sm:w-auto font-medium text-white bg-[#1A1A1A] w-full rounded-full pt-3.5 pr-8 pb-3.5 pl-8 shadow-lg"
                >
                    {primaryCta.text}
                </a>
                <a
                    href={secondaryCta.href}
                    className="bg-white/40 backdrop-blur-md border border-white/50 text-[#1A1A1A] text-[17px] font-medium px-8 py-3.5 rounded-full hover:bg-white/60 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
                >
                    {secondaryCta.text}
                </a>
            </div>
        </div>
    );
}
