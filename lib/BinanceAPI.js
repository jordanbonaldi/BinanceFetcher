"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var binance_api_node_1 = require("binance-api-node");
var BinanceTests_1 = require("./BinanceTests");
var BinanceAPI = /** @class */ (function () {
    /**
     *
     * @param apiKey
     * @param apiSecret
     */
    function BinanceAPI(apiKey, apiSecret) {
        if (apiKey === void 0) { apiKey = null; }
        if (apiSecret === void 0) { apiSecret = null; }
        this.binance = apiKey != null && apiSecret != null ? binance_api_node_1.default({
            apiKey: apiKey,
            apiSecret: apiSecret
        }) : binance_api_node_1.default();
        BinanceTests_1.default(this).then(function (response) {
            return response == null ? process.exit(1) : console.log("All tests passed on binance fetcher");
        });
    }
    /**
     *
     * @param binanceWorker
     */
    BinanceAPI.prototype.createWorker = function () {
        var _this = this;
        var binanceWorker = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            binanceWorker[_i] = arguments[_i];
        }
        return Promise.all(binanceWorker.map(function (worker) { return worker.load(_this); }));
    };
    /**
     *
     * @param symbols
     * @returns {Promise<*>}
     */
    BinanceAPI.prototype.getAllSymbols = function () {
        var symbols = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            symbols[_i] = arguments[_i];
        }
        return this.binance['prices']().then(function (assets) {
            if (symbols.length === 0)
                return Object.keys(assets);
            var assetsSymbols = [];
            symbols.map(function (symbol) { return assetsSymbols[symbol] = Object.keys(assets).filter(function (asset) { return asset.includes(symbol); }); });
            return assetsSymbols;
        });
    };
    /**
     *
     * @param symbol
     * @param interval
     * @param limit
     * @param startTime
     * @param endTime
     */
    BinanceAPI.prototype.getCandles = function (symbol, interval, limit, startTime, endTime) {
        if (symbol === void 0) { symbol = "BTCUSDT"; }
        if (interval === void 0) { interval = binance_api_node_1.CandleChartInterval.THIRTY_MINUTES; }
        if (limit === void 0) { limit = 1000; }
        if (startTime === void 0) { startTime = null; }
        if (endTime === void 0) { endTime = null; }
        var constructor = {
            symbol: symbol,
            interval: interval,
            limit: limit
        };
        if (startTime != null)
            constructor = __assign(__assign({}, constructor), { startTime: new Date(startTime).getTime() });
        if (endTime != null)
            constructor = __assign(__assign({}, constructor), { endTime: new Date(endTime).getTime() });
        return this.binance['candles'](constructor);
    };
    /**
     *
     * @param symbol
     */
    BinanceAPI.prototype.getSymbolStats = function (symbol) {
        if (symbol === void 0) { symbol = "BTCUSDT"; }
        return this.binance.dailyStats({ symbol: symbol });
    };
    BinanceAPI.prototype.getServerUptime = function () {
        var _ = function (_object) { return __assign({}, _object); };
        return this.binance.time().then(function (timestamp) { return _({
            ping: "OK",
            upTime: new Date(timestamp)
        }); }).catch(function () { return _({
            ping: "KO",
            upTime: null
        }); });
    };
    return BinanceAPI;
}());
exports.default = BinanceAPI;
