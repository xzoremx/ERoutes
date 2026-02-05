import {
    Search,
    LifeBuoy,
    Folder,
    CircleDollarSign,
    Play,
} from "lucide-react";

interface DashboardHeaderProps {
    userName?: string;
    greeting?: string;
    timerValue?: string;
}

export function DashboardHeader({
    userName = "James",
    greeting = "What are you working on?",
    timerValue = "0:00:00",
}: DashboardHeaderProps) {
    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h2 className="text-xl font-bold text-slate-900 font-nunito">
                    Hello, {userName}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">{greeting}</p>
            </div>

            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[1.5]" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-full text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100 w-64 shadow-sm"
                    />
                </div>

                {/* Icons */}
                <div className="flex items-center gap-3 text-slate-400">
                    <button className="hover:text-slate-900 transition">
                        <LifeBuoy className="w-5 h-5 stroke-[1.5]" />
                    </button>
                    <button className="hover:text-slate-900 transition">
                        <Folder className="w-5 h-5 stroke-[1.5]" />
                    </button>
                    <button className="hover:text-slate-900 transition">
                        <CircleDollarSign className="w-5 h-5 stroke-[1.5]" />
                    </button>
                </div>

                {/* Timer */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <span className="font-mono text-sm font-medium text-slate-700">
                        {timerValue}
                    </span>
                    <button className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white shadow-lg hover:scale-105 transition">
                        <Play className="w-3 h-3 fill-current" />
                    </button>
                </div>
            </div>
        </header>
    );
}
