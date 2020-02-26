const BinanceAPI = require('./BinanceAPI');

class BinanceTests {
    /**
     *
     * @param binanceAPI
     */
    constructor(binanceAPI) {
        this.binanceAPI = binanceAPI;
    }

    /**
     *
     * @param _message
     * @returns {Error}
     */
    error(_message) {
        return new Error(_message);
    }

    /**
     *
     * @returns {Promise<*>}
     */
    testUptime() {
        return this.binanceAPI.getServerUptime().then(a => {
            if (a.ping !== 'OK' || a.upTime == null)
                throw this.error(`Problem with server upTime ping KO`);
        })
    }

    /**
     *
     * @returns {Promise<*>}
     */
    testAssets() {
        return this.binanceAPI.getAllSymbols().then((symbols) => {
            if (symbols == null || symbols.length === 0)
                throw this.error(`Error with all symbols call`);

            return this.binanceAPI.getAllSymbols('BTC', 'USDT').then((_symbols) => {
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
    testCandles(symbol = null){
        return this.binanceAPI.getCandles(symbol == null ? "BTCUSDT" : symbol, "1m").then(symbol => {
            if (symbol == null || symbol.length !== 1000)
                throw this.error(`Amount of symbol expected: 1000, got ${symbol == null ? '0' : symbol.length}`)
        });
    }

    /**
     *
     * @param symbol
     * @returns {Promise<*>}
     */
    testStats(symbol = null){
        return this.binanceAPI.getSymbolStats(symbol == null ? "BTCUSDT" : symbol).then(stats => {
            if (stats == null)
                throw this.error(`Symbols Statistics is null`);
        });
    }

    /**
     *
     * @returns {Promise<string|null>}
     */
    launchTest() {
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
module.exports = (binanceAPI) => new BinanceTests(binanceAPI).launchTest();