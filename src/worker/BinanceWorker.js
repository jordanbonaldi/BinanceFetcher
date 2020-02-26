const Worker = require('./Worker');
const Utils = require('../utils/Utils');

class BinanceWorker extends Worker {

    /**
     *
     * @param interval
     * @param callback
     */
    constructor(interval, callback) {
        super(`Binance Worker ${interval}`, Utils.intervalToNum(interval));

        this._callback = callback;
        this.binanceInstance = null;
    }

    /**
     *
     * @param binanceInstance
     * @returns {Promise<*>}
     */
    load(binanceInstance) {
        /** @type BinanceAPI **/
        this.binanceInstance = binanceInstance;
        return super.load(this.binanceInstance);
    }

    /**
     *
     * @returns {Promise<*>}
     */
    run(params = {}) {
        return this._callback(this.binanceInstance);
    }
}

module.exports = (interval, callback) => new BinanceWorker(interval, callback);