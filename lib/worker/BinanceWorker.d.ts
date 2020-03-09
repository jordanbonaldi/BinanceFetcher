import BinanceAPI from "../BinanceAPI";
import Worker from "./Worker";
export default class BinanceWorker extends Worker {
    callback: (binance: BinanceAPI) => Promise<any>;
    binanceInstance: BinanceAPI;
    /**
     *
     * @param interval
     * @param callback
     */
    constructor(interval: string, callback: (binance: BinanceAPI) => Promise<any>);
    /**
     *
     * @param binanceInstance
     */
    load<T>(binanceInstance: BinanceAPI): Promise<T>;
    /**
     *
     * @param params
     */
    run(params?: object): Promise<any>;
}
