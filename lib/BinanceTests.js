"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var binance_api_node_1 = require("binance-api-node");
var BinanceTests = /** @class */ (function () {
    /**
     *
     * @param binanceAPI
     */
    function BinanceTests(binanceAPI) {
        this.binanceAPI = binanceAPI;
    }
    /**
     *
     * @param _message
     * @returns {Error}
     */
    BinanceTests.prototype.error = function (_message) {
        return new Error(_message);
    };
    BinanceTests.prototype.testUptime = function () {
        var _this = this;
        return this.binanceAPI.getServerUptime().then(function (ping) {
            if (ping.ping !== 'OK' || ping.upTime == null)
                throw _this.error("Problem with server upTime ping KO");
            return ping;
        });
    };
    BinanceTests.prototype.testAssets = function () {
        var _this = this;
        return this.binanceAPI.getAllSymbols().then(function (symbols) {
            if (symbols == null || symbols.length === 0)
                throw _this.error("Error with all symbols call");
            return _this.binanceAPI.getAllSymbols('BTC', 'USDT').then(function (_symbols) {
                if (Object.keys(_symbols).length !== 2)
                    throw _this.error("Error with specific symbols amount required: 2 got " + Object.keys(_symbols).length);
                else if (_symbols['BTC'].length <= 10 || _symbols['USDT'].length <= 10)
                    throw _this.error("Error with specific symbols " + (_symbols['BTC'].length <= 10 ? 'BTC' : 'USDT') + " amount lower than expected : " + (_symbols['BTC'].length <= 10 ? _symbols['BTC'].length : _symbols['USDT'].length));
            }).then(function () {
                /**
                 * We are checking 100 random assets since we can't test more than 100 per minutes.
                 */
                var numbers = [];
                for (var i = 0; i < 100; i++)
                    numbers.push(Math.floor(Math.random() * Math.floor(symbols.length)));
                return Promise.all([
                    numbers.map(function (number) { return _this.testStats(symbols[number]); }),
                    numbers.map(function (number) { return _this.testCandles(symbols[number]); })
                ]);
            });
        });
    };
    /**
     *
     * @param symbol
     * @returns {Promise<*>}
     */
    BinanceTests.prototype.testCandles = function (symbol) {
        var _this = this;
        if (symbol === void 0) { symbol = null; }
        return this.binanceAPI.getCandles(symbol == null ? "BTCUSDT" : symbol, binance_api_node_1.CandleChartInterval.ONE_MINUTE)
            .then(function (symbols) {
            if (symbols == null || symbols.length !== 1000)
                throw _this.error("Amount of symbol expected: 1000, got " + (symbols == null ? '0' : symbols.length));
            return symbols;
        });
    };
    /**
     *
     * @param symbol
     * @returns {Promise<*>}
     */
    BinanceTests.prototype.testStats = function (symbol) {
        var _this = this;
        if (symbol === void 0) { symbol = null; }
        return this.binanceAPI.getSymbolStats(symbol == null ? "BTCUSDT" : symbol).then(function (stats) {
            if (stats == null)
                throw _this.error("Symbols Statistics is null");
            return stats;
        });
    };
    /**
     *
     * @returns {Promise<string|null>}
     */
    BinanceTests.prototype.launchTest = function () {
        return Promise.all([
            this.testUptime(),
            this.testAssets(),
            this.testCandles(),
            this.testStats()
        ]).then(function () { return 'OK'; }).catch(function (e) {
            console.log("Error while loading API : " + e);
            return null;
        });
    };
    return BinanceTests;
}());
/**
 *
 * @param binanceAPI
 * @returns {Promise<string|null>}
 */
function default_1(binanceAPI) { return new BinanceTests(binanceAPI).launchTest(); }
exports.default = default_1;
;
