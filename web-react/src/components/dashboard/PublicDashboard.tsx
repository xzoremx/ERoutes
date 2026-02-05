"use client";

import { useState, useEffect } from "react";
import { MapPin, Fuel, TrendingUp, Clock, RefreshCw, BarChart3 } from "lucide-react";

interface StatsData {
    stationCount: number;
    prices: {
        gasohol90: { avg: number; min: number; max: number } | null;
        dieselB5: { avg: number; min: number; max: number } | null;
    };
    lastUpdate: string | null;
}

interface TrendMonthData {
    month: string;
    [fuelCode: string]: string | number | null | undefined;
}

interface PriceTrendsData {
    trends: TrendMonthData[];
}

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: string;
    subtext?: string;
    loading?: boolean;
}

function StatCard({ icon: Icon, label, value, subtext, loading }: StatCardProps) {
    return (
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-white/60 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#ABCDE9]/30 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-slate-700" />
                </div>
                <span className="text-sm text-slate-500 font-medium">{label}</span>
            </div>
            {loading ? (
                <div className="h-8 bg-slate-200 rounded animate-pulse w-24" />
            ) : (
                <>
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                    {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
                </>
            )}
        </div>
    );
}

export interface PublicDashboardProps {
    stats?: StatsData | null;
    loading?: boolean;
    error?: string | null;
    trends?: PriceTrendsData | null;
    trendsLoading?: boolean;
    trendsError?: string | null;
}

export function PublicDashboard({
    stats: propStats,
    loading: propLoading,
    error: propError,
    trends: propTrends,
    trendsLoading: propTrendsLoading,
    trendsError: propTrendsError
}: PublicDashboardProps = {}) {
    const [internalStats, setInternalStats] = useState<StatsData | null>(null);
    const [internalLoading, setInternalLoading] = useState(true);
    const [internalError, setInternalError] = useState<string | null>(null);

    const [internalTrends, setInternalTrends] = useState<PriceTrendsData | null>(null);
    const [internalTrendsLoading, setInternalTrendsLoading] = useState(true);
    const [internalTrendsError, setInternalTrendsError] = useState<string | null>(null);

    // Si no se pasan props, hacer fetch internamente (backwards compatible)
    const statsManaged = propStats !== undefined;
    const stats = statsManaged ? propStats : internalStats;
    const loading = statsManaged ? (propLoading ?? false) : internalLoading;
    const error = statsManaged ? (propError ?? null) : internalError;

    const trendsManaged = propTrends !== undefined;
    const trends = trendsManaged ? propTrends : internalTrends;
    const trendsLoading = trendsManaged ? (propTrendsLoading ?? false) : internalTrendsLoading;
    const trendsError = trendsManaged ? (propTrendsError ?? null) : internalTrendsError;

    useEffect(() => {
        if (statsManaged) return;

        async function fetchStats() {
            try {
                setInternalLoading(true);
                const response = await fetch("/api/stats");
                const result = await response.json();

                if (result.success) {
                    setInternalStats(result.data);
                } else {
                    setInternalError("No se pudieron cargar las estadísticas");
                }
            } catch {
                setInternalError("Error de conexión");
            } finally {
                setInternalLoading(false);
            }
        }

        fetchStats();
    }, [statsManaged]);

    useEffect(() => {
        if (trendsManaged) return;

        async function fetchTrends() {
            try {
                setInternalTrendsLoading(true);
                setInternalTrendsError(null);
                const response = await fetch("/api/prices-trends");
                const result = await response.json();

                if (result.success && Array.isArray(result.data?.trends)) {
                    setInternalTrends({ trends: result.data.trends });
                } else {
                    setInternalTrendsError("No se pudo cargar la evolución de precios");
                }
            } catch {
                setInternalTrendsError("Error de conexión en evolución de precios");
            } finally {
                setInternalTrendsLoading(false);
            }
        }

        fetchTrends();
    }, [trendsManaged]);

    const toNumber = (value: unknown): number | null => {
        if (value == null) return null;
        const parsed =
            typeof value === "number"
                ? value
                : typeof value === "string"
                    ? Number.parseFloat(value)
                    : Number.NaN;

        return Number.isFinite(parsed) ? parsed : null;
    };

    const formatPrice = (price: unknown) => {
        const value = toNumber(price);
        if (value == null) return "—";
        return `S/. ${value.toFixed(2)}`;
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "Sin datos";
        const date = new Date(dateStr);
        return date.toLocaleDateString("es-PE", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const formatMonth = (month: string) => {
        const [year, monthNum] = month.split("-").map(Number);
        if (!Number.isFinite(year) || !Number.isFinite(monthNum)) return month;

        const date = new Date(Date.UTC(year, monthNum - 1, 1));
        return date.toLocaleDateString("es-PE", {
            month: "short",
        }).replace(".", "");
    };

    const trendRows = trends?.trends ?? [];
    const preferredFuelCodes = ["GASOHOL_90", "DIESEL_B5"];
    const detectedFuelCodes = Array.from(
        new Set(
            trendRows.flatMap((row) =>
                Object.keys(row).filter((key) => key !== "month" && toNumber(row[key]) != null)
            )
        )
    );
    const fuelCodesForChart = [
        ...preferredFuelCodes.filter((code) => detectedFuelCodes.includes(code)),
        ...detectedFuelCodes.filter((code) => !preferredFuelCodes.includes(code))
    ].slice(0, 2);

    const fuelMetadata = fuelCodesForChart.map((code, index) => {
        if (code === "GASOHOL_90") {
            return {
                code,
                label: "Gasohol 90",
                dotClassName: "bg-blue-500",
                barClassName: "bg-blue-500/85 hover:bg-blue-500"
            };
        }

        if (code === "DIESEL_B5") {
            return {
                code,
                label: "Diesel B5",
                dotClassName: "bg-slate-500",
                barClassName: "bg-slate-500/80 hover:bg-slate-600"
            };
        }

        return {
            code,
            label: code.replaceAll("_", " "),
            dotClassName: index % 2 === 0 ? "bg-blue-500" : "bg-slate-500",
            barClassName: index % 2 === 0 ? "bg-blue-500/85 hover:bg-blue-500" : "bg-slate-500/80 hover:bg-slate-600"
        };
    });

    const chartBars = trendRows.map((row) => ({
        month: row.month,
        monthLabel: formatMonth(row.month),
        values: fuelMetadata.map((fuel) => ({
            code: fuel.code,
            value: toNumber(row[fuel.code])
        }))
    }));

    const allTrendValues = chartBars.flatMap((row) =>
        row.values
            .map((entry) => entry.value)
            .filter((value): value is number => value != null)
    );

    const minTrendValue = allTrendValues.length ? Math.min(...allTrendValues) : 0;
    const maxTrendValue = allTrendValues.length ? Math.max(...allTrendValues) : 0;
    const rangeTrendValue = maxTrendValue - minTrendValue;

    const getBarHeight = (value: number | null) => {
        if (value == null) return 0;
        if (rangeTrendValue === 0) return 70;

        const normalized = ((value - minTrendValue) / rangeTrendValue) * 100;
        return Math.max(12, Math.min(100, normalized));
    };

    if (error) {
        return (
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 text-center">
                <RefreshCw className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 text-sm text-blue-600 hover:underline"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/60">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Estadísticas en Tiempo Real</h3>
                    <p className="text-sm text-slate-500">Datos actualizados de OSINERGMIN</p>
                </div>
                {stats?.lastUpdate && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {formatDate(stats.lastUpdate)}
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={MapPin}
                    label="Estaciones"
                    value={loading ? "—" : stats?.stationCount?.toLocaleString() || "0"}
                    subtext="monitoreadas"
                    loading={loading}
                />
                <StatCard
                    icon={Fuel}
                    label="Gasohol 90"
                    value={formatPrice(stats?.prices?.gasohol90?.avg)}
                    subtext={stats?.prices?.gasohol90
                        ? `Min: ${formatPrice(stats.prices.gasohol90.min)} | Max: ${formatPrice(stats.prices.gasohol90.max)}`
                        : undefined
                    }
                    loading={loading}
                />
                <StatCard
                    icon={Fuel}
                    label="Diesel B5"
                    value={formatPrice(stats?.prices?.dieselB5?.avg)}
                    subtext={stats?.prices?.dieselB5
                        ? `Min: ${formatPrice(stats.prices.dieselB5.min)} | Max: ${formatPrice(stats.prices.dieselB5.max)}`
                        : undefined
                    }
                    loading={loading}
                />
                <StatCard
                    icon={TrendingUp}
                    label="Ahorro Potencial"
                    value={(() => {
                        const min = toNumber(stats?.prices?.gasohol90?.min);
                        const max = toNumber(stats?.prices?.gasohol90?.max);
                        if (min == null || max == null) return "—";
                        return `S/. ${((max - min) * 10).toFixed(2)}`;
                    })()}
                    subtext="por tanque (10 gal)"
                    loading={loading}
                />
            </div>

            {/* Price Trends Bar Chart */}
            <div className="mt-6 bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-white/60 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#ABCDE9]/30 rounded-xl flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-slate-700" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900">Evolución de Precios</h4>
                            <p className="text-xs text-slate-500">Promedio mensual por combustible</p>
                        </div>
                    </div>

                    {allTrendValues.length > 0 && (
                        <div className="text-xs text-slate-400 font-medium">
                            Rango: {formatPrice(minTrendValue)} - {formatPrice(maxTrendValue)}
                        </div>
                    )}
                </div>

                {trendsLoading ? (
                    <div className="h-56 rounded-xl border border-slate-100 bg-slate-50/50 p-4 animate-pulse">
                        <div className="h-full flex items-end gap-3">
                            {[28, 52, 38, 67, 50, 40, 60, 45, 56, 42].map((height, index) => (
                                <div key={index} className="flex-1 h-full flex items-end justify-center gap-1.5">
                                    <div className="w-3 rounded-t-md bg-slate-200" style={{ height: `${height}%` }} />
                                    <div className="w-3 rounded-t-md bg-slate-300" style={{ height: `${Math.max(18, height - 12)}%` }} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : trendsError ? (
                    <div className="h-56 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-center text-center px-6">
                        <p className="text-sm text-slate-500">{trendsError}</p>
                    </div>
                ) : chartBars.length === 0 || fuelMetadata.length === 0 ? (
                    <div className="h-56 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-center text-center px-6">
                        <p className="text-sm text-slate-500">No hay datos históricos suficientes para mostrar el gráfico.</p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-600 mb-4">
                            {fuelMetadata.map((fuel) => (
                                <div key={fuel.code} className="flex items-center gap-2">
                                    <span className={`w-2.5 h-2.5 rounded-full ${fuel.dotClassName}`} />
                                    <span>{fuel.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="relative h-48 overflow-x-auto no-scrollbar">
                            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between pb-6">
                                {[0, 1, 2, 3].map((line) => (
                                    <div key={line} className="border-t border-dashed border-slate-200/80" />
                                ))}
                            </div>

                            <div className="relative z-10 h-full flex items-end gap-3 min-w-max px-1">
                                {chartBars.map((row) => (
                                    <div key={row.month} className="h-full w-11 flex flex-col items-center justify-end">
                                        <div className="w-full h-full flex items-end justify-center gap-1.5">
                                            {row.values.map((item, index) => {
                                                const metadata = fuelMetadata[index];

                                                return (
                                                    <div
                                                        key={`${row.month}-${item.code}`}
                                                        className={`w-3 rounded-t-md transition-all duration-500 ${metadata.barClassName}`}
                                                        style={{ height: `${getBarHeight(item.value)}%` }}
                                                        title={`${metadata.label}: ${item.value != null ? formatPrice(item.value) : "Sin dato"}`}
                                                    />
                                                );
                                            })}
                                        </div>
                                        <span className="mt-2 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                            {row.monthLabel}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
