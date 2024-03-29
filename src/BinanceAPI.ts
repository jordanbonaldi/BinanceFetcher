import binance_api_node, {
    Binance,
    CandleChartInterval,
    CandleChartResult,
    CandlesOptions,
    DailyStatsResult,
    Candle
} from "binance-api-node";
import BinanceWorker from "./worker/BinanceWorker";
import {Ping} from "./models/Ping";
import BinanceTests from "./BinanceTests";
import CandleModel from "./models/CandleModel";
import {intervalToNum} from "./utils/Utils";

const apiOverride = require('../api/BinanceSocket')();

export default class BinanceAPI {

    private readonly binance: Binance;

    /**
     *
     * @param apiKey
     * @param apiSecret
     */
    constructor(apiKey: string | null = null, apiSecret: string | null = null) {
        this.binance = apiKey != null && apiSecret != null ? binance_api_node({
            apiKey: apiKey,
            apiSecret: apiSecret
        }) : binance_api_node();
    }

    public launch(): Promise<BinanceAPI> {
        return BinanceTests(this).then((response) =>
            response == null ? process.exit(1) : console.log(`All tests passed on binance fetcher`)
        ).then(() => this);
    }

    socketWatcher(asset: string, period: string, slow: boolean, callback: (candles: CandleModel[]) => void): void {
        let interval: number = intervalToNum(period);
        let called: number = 0;

        return apiOverride.websockets.chart(asset, period, (_symbol: string, _interval: string, chart: any) => {
            if (slow && called++ % (interval / 2) !== 0) return;

            callback(Object.keys(chart).map((key: string) => chart[key] as CandleModel))
        })
    }

    /**
     *
     * @param binanceWorker
     */
    createWorker<T>(...binanceWorker: BinanceWorker[]): Promise<T[]> {
        return Promise.all(binanceWorker.map((worker: BinanceWorker) => worker.load<T>(this)));
    }

    /**
     *
     * @param symbols
     * @returns {Promise<*>}
     */
    getAllSymbols(...symbols: string[]): Promise<string[]> {
        return this.binance['prices']().then((assets) => {
            if (symbols.length === 0)
                return Object.keys(assets);

            let assetsSymbols: string[] = [];

            symbols.map((symbol: string) =>
                Object.keys(assets).filter((asset: string) => asset.includes(symbol))
            ).forEach((arrayOfAssets: string[]) => assetsSymbols.push(...arrayOfAssets));

            return assetsSymbols;
        });
    }

    /**
     *
     * @param symbol
     * @param interval
     * @param limit
     * @param startTime
     * @param endTime
     */
    getCandles(
        symbol: string = "BTCUSDT",
        interval: CandleChartInterval | string | any = CandleChartInterval.THIRTY_MINUTES,
        limit: number = 1000,
        startTime: Date | null = null,
        endTime: Date | null = null
    ): Promise<CandleModel[]> {
        let constructor: CandlesOptions = {
            symbol: symbol,
            interval: interval,
            limit: limit
        };

        if (startTime != null)
            constructor = {
                ...constructor,
                startTime: new Date(startTime).getTime()
            };
        if (endTime != null)
            constructor = {
                ...constructor,
                endTime: new Date(endTime).getTime()
            };

        return this.binance['candles'](constructor).then((candlesChart: CandleChartResult[]) =>
            candlesChart.map(e => {
                return {
                    close: parseFloat(e.close),
                    high: parseFloat(e.high),
                    low: parseFloat(e.low),
                    open: parseFloat(e.open),
                    volume: parseFloat(e.volume)
                } as CandleModel
            })
        );
    }

    /**
     *
     * @param symbol
     */
    getSymbolStats(symbol: string = "BTCUSDT"): Promise<DailyStatsResult | DailyStatsResult[]> {
        return this.binance.dailyStats({symbol: symbol});
    }

    getServerUptime(): Promise<Ping> {
        let _ = (_object: Ping): Ping  => { return {..._object} };

        return this.binance.time().then((timestamp) => _({
                ping: "OK",
                upTime: new Date(timestamp)
            })
        ).catch(() => _({
                ping: "KO",
                upTime: null
            })
        );
    }

}