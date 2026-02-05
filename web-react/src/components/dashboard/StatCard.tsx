import { LucideIcon } from "lucide-react";

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
    change: string;
    isPositive: boolean;
}

export function StatCard({
    icon: Icon,
    label,
    value,
    change,
    isPositive,
}: StatCardProps) {
    return (
        <div className="bg-[#F6F4F0] p-5 rounded-xl border border-transparent hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-2 text-slate-500 mb-6">
                <div className="p-1.5 bg-white rounded-md shadow-sm">
                    <Icon className="w-4 h-4 text-slate-700 stroke-[1.5]" />
                </div>
                <span className="text-xs font-semibold">{label}</span>
            </div>
            <div className="flex items-end justify-between">
                <span className="text-3xl font-bold font-nunito text-slate-900">
                    {value}
                </span>
                <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${isPositive
                            ? "text-green-600 bg-green-100/50"
                            : "text-red-500 bg-red-100/50"
                        }`}
                >
                    {change}
                </span>
            </div>
        </div>
    );
}
