"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Worker = /** @class */ (function () {
    /**
     *
     * @param name
     * @param delay
     * @param params
     */
    function Worker(name, delay, params) {
        if (params === void 0) { params = {}; }
        this.name = name;
        this.delay = delay;
        this.params = params;
        console.log(this.name + " running");
    }
    Worker.prototype.load = function (params, perm) {
        var _this = this;
        if (params === void 0) { params = {}; }
        if (perm === void 0) { perm = true; }
        if (params !== {})
            this.params = params;
        if (!perm)
            return this.run(this.params);
        return this.run(this.params).then(function () {
            return new Promise(function (res) { return setTimeout(res, _this.delay * 1000); })
                .then(function () { return _this.load(_this.params); })
                .catch(function (e) {
                console.log("Trying to handle error and rebuild " + _this.name + (": " + e));
                return new Promise(function (res) { return setTimeout(res, 240 * 1000); })
                    .then(function () {
                    console.log("Error handled with success and system rebuilt");
                    return _this.load(_this.params);
                });
            });
        });
    };
    return Worker;
}());
exports.default = Worker;
