import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface CtaButton {
    text: string;
    href?: string;
    onClick?: () => void;
    loading?: boolean;
}

interface HeroSectionProps {
    title: ReactNode;
    description: string;
    primaryCta?: CtaButton;
    secondaryCta?: CtaButton;
}

export function HeroSection({
    title,
    description,
    primaryCta = { text: "Navegar", href: "#" },
    secondaryCta,
}: HeroSectionProps) {
    const primaryButtonClasses = "text-[17px] hover:bg-black transition-all hover:shadow-xl hover:-translate-y-0.5 sm:w-auto font-medium text-white bg-[#1A1A1A] w-full rounded-full pt-3.5 pr-8 pb-3.5 pl-8 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed";
    const secondaryButtonClasses = "bg-white/40 backdrop-blur-md border border-white/50 text-[#1A1A1A] text-[17px] font-medium px-8 py-3.5 rounded-full hover:bg-white/60 transition-all w-full sm:w-auto flex items-center justify-center gap-2";

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
                {primaryCta.onClick ? (
                    <button
                        onClick={primaryCta.onClick}
                        disabled={primaryCta.loading}
                        className={primaryButtonClasses}
                    >
                        {primaryCta.loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {primaryCta.text}
                    </button>
                ) : (
                    <a href={primaryCta.href || "#"} className={primaryButtonClasses}>
                        {primaryCta.text}
                    </a>
                )}
                {secondaryCta && (
                    secondaryCta.onClick ? (
                        <button
                            onClick={secondaryCta.onClick}
                            className={secondaryButtonClasses}
                        >
                            {secondaryCta.text}
                        </button>
                    ) : (
                        <a href={secondaryCta.href || "#"} className={secondaryButtonClasses}>
                            {secondaryCta.text}
                        </a>
                    )
                )}
            </div>
        </div>
    );
}
