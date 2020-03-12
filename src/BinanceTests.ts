import BinanceAPI from "./BinanceAPI";
import {Ping} from "./models/Ping";
import {CandleChartInterval, CandleChartResult, DailyStatsResult} from "binance-api-node";


class BinanceTests {

    private binanceAPI: BinanceAPI;

    /**
     *
     * @param binanceAPI
     */
    constructor(binanceAPI: BinanceAPI) {
        this.binanceAPI = binanceAPI;
    }

    /**
     *
     * @param _message
     * @returns {Error}
     */
    error(_message: string): Error {
        return new Error(_message);
    }

    testUptime(): Promise<Ping | Error> {
        return this.binanceAPI.getServerUptime().then((ping: Ping) => {
            if (ping.ping !== 'OK' || ping.upTime == null)
                throw this.error(`Problem with server upTime ping KO`);

            return ping;
        })
    }

    testAssets(): Promise<unknown> {
        return this.binanceAPI.getAllSymbols().then((symbols: any) => {
            if (symbols == null || symbols.length === 0)
                throw this.error(`Error with all symbols call`);

            return this.binanceAPI.getAllSymbols('BTC', 'USDT').then((_symbols: any) => {
                if (Object.keys(_symbols).length !== 2)
                    throw this.error(`Error with specific symbols amount required: 2 got ${Object.keys(_symbols).length}`);
                else if (_symbols['BTC'].length <= 10 || _symbols['USDT'].length <= 10)
                    throw this.error(`Error with specific symbols ${
                        _symbols['BTC'].length <= 10 ? 'BTC' : 'USDT'
                    } amount lower than expected : ${
                        _symbols['BTC'].length <= 10 ? _symbols['BTC'].length : _symbols['USDT'].length
                    }`);
            }).then(() => {
                /**
                 * We are checking 100 random assets since we can't test more than 100 per minutes.
                 */
                let numbers = [];
                for (let i = 0; i < 100; i++)
                    numbers.push(Math.floor(Math.random() * Math.floor(symbols.length)));

                return Promise.all([
                    numbers.map(number => this.testStats(symbols[number])),
                    numbers.map(number => this.testCandles(symbols[number]))
                ]);
            });
        });
    }

    /**
     *
     * @param symbol
     * @returns {Promise<*>}
     */
    testCandles(symbol: string | null = null): Promise<CandleChartResult[]>{
        return this.binanceAPI.getCandles(symbol == null ? "BTCUSDT" : symbol, CandleChartInterval.ONE_MINUTE)
            .then((symbols: CandleChartResult[]) => {
                if (symbols == null || symbols.length !== 1000)
                    throw this.error(`Amount of symbol expected: 1000, got ${symbols == null ? '0' : symbols.length}`);
                return symbols;
        });
    }

    /**
     *
     * @param symbol
     * @returns {Promise<*>}
     */
    testStats(symbol: string | null = null): Promise<DailyStatsResult | DailyStatsResult[]> {
        return this.binanceAPI.getSymbolStats(symbol == null ? "BTCUSDT" : symbol).then(stats => {
            if (stats == null)
                throw this.error(`Symbols Statistics is null`);

            return stats;
        });
    }

    /**
     *
     * @returns {Promise<string|null>}
     */
    launchTest(): Promise<null | string> {
        return Promise.all([
            this.testUptime(),
            this.testAssets(),
            this.testCandles(),
            this.testStats()
        ]).then(() => 'OK').catch((e) => {
            console.log(`Error while loading API : ${e}`);

            return null;
        });
    }
}

/**
 *
 * @param binanceAPI
 * @returns {Promise<string|null>}
 */
export default function (binanceAPI: BinanceAPI) { return new BinanceTests(binanceAPI).launchTest() };