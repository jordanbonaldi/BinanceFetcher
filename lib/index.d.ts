/**
 *
 * @type {BinanceAPI}
 */
import BinanceAPI from "./BinanceAPI";
import BinanceWorker from "./worker/BinanceWorker";
import Worker from "./worker/Worker";
export default function binanceAPI(apiKey?: string | null, apiSecret?: string | null): BinanceAPI;
/**
 *
 * @type {BinanceWorker}
 */
export { BinanceWorker as binanceWorker, Worker as defaultWorker, BinanceAPI as BinanceAPI };
/**
 *
 * @param interval
 * @param callback
 * @returns {BinanceWorker}
 */
export declare function intervalFetcher(interval: string, callback: (binanceApi: BinanceAPI) => Promise<any>): BinanceWorker;
