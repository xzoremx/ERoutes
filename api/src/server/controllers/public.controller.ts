import type { Request, Response, NextFunction } from "express";
import { countActiveStations } from "../repositories/stations.repo";
import { getAveragePrices, getPriceTrends, getLastEtlRun } from "../repositories/prices.repo";

export async function getStats(req: Request, res: Response, next: NextFunction) {
    try {
        const [stationCount, avgPrices, lastEtl] = await Promise.all([
            countActiveStations(),
            getAveragePrices(),
            getLastEtlRun()
        ]);

        // Extract specific fuel prices
        const gasohol90 = avgPrices.find(p => p.fuel_code === "GASOHOL_90");
        const dieselB5 = avgPrices.find(p => p.fuel_code === "DIESEL_B5");

        res.json({
            success: true,
            data: {
                stationCount,
                prices: {
                    gasohol90: gasohol90 ? {
                        avg: gasohol90.avg_price,
                        min: gasohol90.min_price,
                        max: gasohol90.max_price,
                        stationCount: gasohol90.station_count
                    } : null,
                    dieselB5: dieselB5 ? {
                        avg: dieselB5.avg_price,
                        min: dieselB5.min_price,
                        max: dieselB5.max_price,
                        stationCount: dieselB5.station_count
                    } : null,
                    all: avgPrices
                },
                lastUpdate: lastEtl ? lastEtl.finished_at : null,
                etlStatus: lastEtl ? lastEtl.status : null
            }
        });
    } catch (error) {
        next(error);
    }
}

export async function getPriceTrendsHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const months = parseInt(req.query.months as string) || 12;
        const trends = await getPriceTrends(months);

        // Group by month for chart consumption
        const grouped: Record<string, Record<string, number>> = {};
        for (const item of trends) {
            if (!grouped[item.month]) {
                grouped[item.month] = {};
            }
            grouped[item.month][item.fuel_code] = item.avg_price;
        }

        // Convert to array format for charts
        const chartData = Object.entries(grouped).map(([month, fuels]) => ({
            month,
            ...fuels
        }));

        res.json({
            success: true,
            data: {
                trends: chartData,
                raw: trends
            }
        });
    } catch (error) {
        next(error);
    }
}
