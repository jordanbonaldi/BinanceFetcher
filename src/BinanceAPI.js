const api = require('binance-api-node')["default"];
const BinanceTests = require('./BinanceTests');

class BinanceAPI {
    /**
     *
     * @param apiKey
     * @param apiSecret
     * @param time
     * @returns {Promise<*>}
     */
    constructor(apiKey = null, apiSecret = null, time = null) {
        this.binance = apiKey == null ? api() : api({
            apiKey: apiKey,
            apiSecret: apiSecret,
            time: time
        });

        BinanceTests(this).then((response) =>
            response == null ? process.exit(1) : console.log(`All tests passed on binance fetcher`)
        );
    }

    /**
     *
     * @param symbols
     * @returns {Promise<*>}
     */
    getAllSymbols(...symbols) {
        return this.binance['prices']().then((assets) => {
            if (symbols.length === 0)
                return Object.keys(assets);

            let assetsSymbols = [];

            symbols.map(symbol => assetsSymbols[symbol] = Object.keys(assets).filter(asset => asset.includes(symbol)));

            return assetsSymbols;
        });
    }

    /**
     *
     * @param symbol Asset symbol name
     * @param interval Intervals: 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M
     * @param limit 1 to 1000
     * @param startTime
     * @param endTime
     *
     * @returns {Promise<*>}
     */
    getCandles(symbol = "BTCUSDT", interval = "30m", limit = 1000, startTime = null, endTime = null) {
        let constructor = {
            symbol: symbol,
            interval: interval,
            limit: limit
        };

        if (startTime != null)
            constructor = {
                ...constructor,
                startTime: startTime
            };
        if (endTime != null)
            constructor = {
                ...constructor,
                endTime: endTime
            };

        return this.binance['candles'](constructor);
    }

    /**
     *
     * @param symbol
     * @returns {Promise<*>}
     */
    getSymbolStats(symbol = "BTCUSDT") {
        return this.binance.dailyStats({symbol: symbol});
    }

    /**
     *
     * @returns {Promise<*>}
     */
    getServerUptime() {
        let _ = (_object) => { return {..._object} };

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

/**
 *
 * @param apiKey Binance API Key
 * @param apiSecret Binance Secret key
 * @param time The time exposure that we want our api to start on
 * @returns {BinanceAPI}
 */
module.exports = (apiKey = null, apiSecret = null, time = null) => new BinanceAPI(apiKey, apiSecret, time);