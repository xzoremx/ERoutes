import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
    return (
        <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-8 border border-white/60 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-50 pointer-events-none"></div>
            <div className="w-14 h-14 bg-[#F6F4F0] rounded-2xl flex items-center justify-center mb-6 text-slate-900 shadow-sm group-hover:scale-110 transition-transform duration-300 border border-white">
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A] font-nunito mb-3">
                {title}
            </h3>
            <p className="text-[15px] leading-relaxed text-slate-600 font-sans">
                {description}
            </p>
        </div>
    );
}

interface FeaturesSectionProps {
    badge?: string;
    title: string;
    description: string;
    features: FeatureCardProps[];
}

export function FeaturesSection({
    badge = "ERoutes",
    title,
    description,
    features,
}: FeaturesSectionProps) {
    return (
        <section className="w-full max-w-7xl mx-auto px-4 md:px-6 py-24 relative z-10">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
                <span className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-4 block font-sans">
                    {badge}
                </span>
                <h2 className="md:text-5xl text-3xl font-semibold text-[#1A1A1A] tracking-tight font-nunito mb-6">
                    {title}
                </h2>
                <p className="text-lg text-slate-600 font-medium font-sans">
                    {description}
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                ))}
            </div>
        </section>
    );
}
