"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @type {BinanceAPI}
 */
var BinanceAPI_1 = require("./BinanceAPI");
var BinanceWorker_1 = require("./worker/BinanceWorker");
exports.binanceWorker = BinanceWorker_1.default;
var Worker_1 = require("./worker/Worker");
exports.defaultWorker = Worker_1.default;
function binanceAPI(apiKey, apiSecret) {
    if (apiKey === void 0) { apiKey = null; }
    if (apiSecret === void 0) { apiSecret = null; }
    return new BinanceAPI_1.default(apiKey, apiSecret);
}
exports.default = binanceAPI;
/**
 *
 * @param interval
 * @param callback
 * @returns {BinanceWorker}
 */
function intervalFetcher(interval, callback) {
    return new BinanceWorker_1.default(interval, callback);
}
exports.intervalFetcher = intervalFetcher;
