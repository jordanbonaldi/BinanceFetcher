import { CandleChartInterval, CandleChartResult, DailyStatsResult } from "binance-api-node";
import BinanceWorker from "./worker/BinanceWorker";
import { Ping } from "./models/Ping";
export default class BinanceAPI {
    private readonly binance;
    /**
     *
     * @param apiKey
     * @param apiSecret
     */
    constructor(apiKey?: string | null, apiSecret?: string | null);
    launch(): Promise<BinanceAPI>;
    /**
     *
     * @param binanceWorker
     */
    createWorker<T>(...binanceWorker: BinanceWorker[]): Promise<T[]>;
    /**
     *
     * @param symbols
     * @returns {Promise<*>}
     */
    getAllSymbols(...symbols: string[]): Promise<{
        [p: string]: string[];
    } | string[]>;
    /**
     *
     * @param symbol
     * @param interval
     * @param limit
     * @param startTime
     * @param endTime
     */
    getCandles(symbol?: string, interval?: CandleChartInterval, limit?: number, startTime?: Date | null, endTime?: Date | null): Promise<CandleChartResult[]>;
    /**
     *
     * @param symbol
     */
    getSymbolStats(symbol?: string): Promise<DailyStatsResult | DailyStatsResult[]>;
    getServerUptime(): Promise<Ping>;
}
