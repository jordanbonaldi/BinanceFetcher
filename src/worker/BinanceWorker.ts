import {intervalToNum} from "../utils/Utils";
import BinanceAPI from "../BinanceAPI";
import Worker from "./Worker";

export default class BinanceWorker extends Worker {

    callback: (binance: BinanceAPI) => Promise<any>;

    binanceInstance!: BinanceAPI;

    /**
     *
     * @param interval
     * @param callback
     */
    constructor(interval: string, callback: (binance: BinanceAPI) => Promise<any>) {
        super(`Binance Worker ${interval}`, intervalToNum(interval));

        this.callback = callback;
    }

    /**
     *
     * @param binanceInstance
     */
    load<T>(binanceInstance: BinanceAPI): Promise<T> {
        this.binanceInstance = binanceInstance;

        return super.load(this.binanceInstance);
    }

    /**
     *
     * @param params
     */
    run(params: object = {}) {
        return this.callback(this.binanceInstance);
    }
}