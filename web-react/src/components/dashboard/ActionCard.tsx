import { LucideIcon } from "lucide-react";

interface ActionCardProps {
    icon: LucideIcon;
    label: string;
    onClick?: () => void;
}

export function ActionCard({ icon: Icon, label, onClick }: ActionCardProps) {
    return (
        <div
            onClick={onClick}
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-start justify-center gap-3 hover:border-slate-300 transition-colors cursor-pointer group"
        >
            <div className="p-2 bg-[#F6F4F0] rounded-lg group-hover:bg-[#EAE5DC] transition-colors">
                <Icon className="w-5 h-5 text-slate-700 stroke-[1.5]" />
            </div>
            <span className="text-[11px] font-semibold text-slate-700">{label}</span>
        </div>
    );
}

interface ActionsGridProps {
    actions: ActionCardProps[];
}

export function ActionsGrid({ actions }: ActionsGridProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            {actions.map((action, index) => (
                <ActionCard key={index} {...action} />
            ))}
        </div>
    );
}
