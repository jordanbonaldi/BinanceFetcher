/**
 *
 * @type {function(*=, *=, *=): BinanceAPI}
 */
exports.binanceAPI = require('./src/BinanceAPI');

/**
 *
 * @type {function(*=, *=): BinanceWorker}
 */
exports.binanceWorker = require('./src/worker/BinanceWorker');

/**
 *
 * @type {Worker}
 */
exports.defaultWorker = require('./src/worker/Worker');

/**
 *
 * @param interval
 * @param callback
 * @returns {BinanceWorker}
 */
exports.intervalFetcher = (interval, callback) => exports.binanceWorker(interval, callback);