"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = require("../utils/Utils");
var Worker_1 = require("./Worker");
var BinanceWorker = /** @class */ (function (_super) {
    __extends(BinanceWorker, _super);
    /**
     *
     * @param interval
     * @param callback
     */
    function BinanceWorker(interval, callback) {
        var _this = _super.call(this, "Binance Worker " + interval, Utils_1.intervalToNum(interval)) || this;
        _this.callback = callback;
        return _this;
    }
    /**
     *
     * @param binanceInstance
     */
    BinanceWorker.prototype.load = function (binanceInstance) {
        this.binanceInstance = binanceInstance;
        return _super.prototype.load.call(this, this.binanceInstance);
    };
    /**
     *
     * @param params
     */
    BinanceWorker.prototype.run = function (params) {
        if (params === void 0) { params = {}; }
        return this.callback(this.binanceInstance);
    };
    return BinanceWorker;
}(Worker_1.default));
exports.default = BinanceWorker;
