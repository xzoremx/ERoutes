"use client";

import { useState, useEffect } from "react";
import { MapPin, Fuel, TrendingUp, Clock, RefreshCw } from "lucide-react";

interface StatsData {
    stationCount: number;
    prices: {
        gasohol90: { avg: number; min: number; max: number } | null;
        dieselB5: { avg: number; min: number; max: number } | null;
    };
    lastUpdate: string | null;
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

export function PublicDashboard() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                setLoading(true);
                const response = await fetch("/api/stats");
                const result = await response.json();

                if (result.success) {
                    setStats(result.data);
                } else {
                    setError("No se pudieron cargar las estadísticas");
                }
            } catch {
                setError("Error de conexión");
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

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
        </div>
    );
}
