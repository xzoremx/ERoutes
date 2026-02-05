import { ChevronDown, Download } from "lucide-react";

interface EarningsChartProps {
    title?: string;
    data?: number[];
    months?: string[];
    highlightedIndices?: number[];
}

export function EarningsChart({
    title = "Earning over time",
    data = [30, 65, 25, 35, 25, 38, 58, 18, 32, 48, 12, 42],
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    highlightedIndices = [6, 9, 11],
}: EarningsChartProps) {
    return (
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-sm text-slate-900">{title}</h3>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50">
                        Month <ChevronDown className="w-3 h-3" />
                    </button>
                    <button className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50">
                        <Download className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold mb-6">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="text-slate-600">Bilable</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-200"></span>
                    <span className="text-slate-400">Non Billable</span>
                </div>
            </div>

            {/* Chart Visualization */}
            <div className="h-48 w-full flex items-end justify-between gap-2 md:gap-4 px-2">
                {data.map((height, index) => {
                    const isHighlighted = highlightedIndices.includes(index);
                    return (
                        <div
                            key={index}
                            className="w-full flex flex-col justify-end gap-0.5 h-full group"
                        >
                            <div
                                className={`w-full rounded-t-sm transition-colors ${isHighlighted
                                        ? "bg-blue-300/60 group-hover:bg-blue-400/60"
                                        : "bg-blue-200/40 group-hover:bg-blue-300/50"
                                    }`}
                                style={{ height: `${height}%` }}
                            ></div>
                            <div className="text-[9px] text-center text-slate-400 mt-2">
                                {months[index]}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
