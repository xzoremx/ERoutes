import {
    Home,
    Users,
    FolderOpen,
    Clock,
    Receipt,
    FileText,
    DollarSign,
    TrendingUp,
    Landmark,
    ArrowLeftCircle,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface NavItem {
    icon: LucideIcon;
    label: string;
    href: string;
    isActive?: boolean;
}

interface SidebarProps {
    brandName?: string;
    mainNavItems?: NavItem[];
    toolsNavItems?: NavItem[];
}

const defaultMainNav: NavItem[] = [
    { icon: Home, label: "Home", href: "#", isActive: true },
    { icon: Users, label: "Clients", href: "#" },
    { icon: FolderOpen, label: "Projects", href: "#" },
    { icon: Clock, label: "Time tracking", href: "#" },
];

const defaultToolsNav: NavItem[] = [
    { icon: Receipt, label: "Invoices", href: "#" },
    { icon: FileText, label: "Contracts", href: "#" },
    { icon: DollarSign, label: "Balance", href: "#" },
    { icon: TrendingUp, label: "Accounting", href: "#" },
    { icon: Landmark, label: "Taxes", href: "#" },
];

export function Sidebar({
    brandName = "OnePro",
    mainNavItems = defaultMainNav,
    toolsNavItems = defaultToolsNav,
}: SidebarProps) {
    return (
        <aside className="hidden md:flex flex-col w-64 border-r border-slate-100 p-6 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-8 px-2">
                <div className="w-5 h-5 bg-black rounded-tr-md rounded-bl-md"></div>
                <span className="text-lg font-bold text-slate-900 font-nunito">
                    {brandName}
                </span>
                <div className="ml-auto">
                    <ArrowLeftCircle className="w-5 h-5 text-slate-400 stroke-[1.5]" />
                </div>
            </div>

            <nav className="space-y-1 mb-8">
                {mainNavItems.map((item, index) => (
                    <a
                        key={index}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm ${item.isActive
                                ? "bg-[#EAE5DC] text-slate-900"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                            }`}
                    >
                        <item.icon className="w-4 h-4 stroke-[1.5]" />
                        {item.label}
                    </a>
                ))}
            </nav>

            <div className="mt-auto">
                <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Tools
                </p>
                <nav className="space-y-1">
                    {toolsNavItems.map((item, index) => (
                        <a
                            key={index}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors font-medium text-sm"
                        >
                            <item.icon className="w-4 h-4 stroke-[1.5]" />
                            {item.label}
                        </a>
                    ))}
                </nav>
            </div>
        </aside>
    );
}
