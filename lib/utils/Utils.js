"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function intervalToNum(interval) {
    var charInterval = interval[interval.length - 1];
    var formula = charInterval === 'm' ? 60 :
        charInterval === 'h' ? 60 * 60 :
            charInterval === 'd' ? 60 * 60 * 25 :
                60 * 60 * 24 * 2;
    return parseInt(interval) * formula;
}
exports.intervalToNum = intervalToNum;
;
