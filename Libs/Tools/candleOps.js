"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rangeToOHLC = exports.isGreen = exports.getChange = exports.getOCChange = exports.getCCChange = exports.getATRChange = void 0;
var myMath_1 = require("./myMath");
Object.defineProperty(exports, "getChange", { enumerable: true, get: function () { return myMath_1.getChange; } });
function isGreen(candle) {
    var t = candle[0], o = candle[1], h = candle[2], l = candle[3], c = candle[4];
    return c - o > 0;
}
exports.isGreen = isGreen;
function getOCChange(candle) {
    var t = candle[0], o = candle[1], h = candle[2], l = candle[3], c = candle[4];
    return (0, myMath_1.getChange)(o, c);
}
exports.getOCChange = getOCChange;
function getCCChange(candle1, candle2) {
    var t = candle1[0], o = candle1[1], h = candle1[2], l = candle1[3], c = candle1[4];
    var t2 = candle2[0], o2 = candle2[1], h2 = candle2[2], l2 = candle2[3], c2 = candle2[4];
    return (0, myMath_1.getChange)(c, c2);
}
exports.getCCChange = getCCChange;
function getATRChange(candle) {
    var t = candle[0], o = candle[1], h = candle[2], l = candle[3], c = candle[4];
    return (0, myMath_1.getChange)(l, h);
}
exports.getATRChange = getATRChange;
function rangeToOHLC(arr, se) {
    var s = se[0], e = se[1];
    var ohlc = [0, 0, 0, 0];
    for (var i = s; i < e + 1; i++) {
        i === e && (ohlc[3] = arr[i][4]);
        i === s && (ohlc[0] = arr[i][1]);
        ohlc[2] = ohlc[2] !== 0 ? Math.min(ohlc[2], arr[i][3]) : arr[i][3];
        ohlc[1] = Math.max(ohlc[1], arr[i][2]);
    }
    console.log('range to ohlc: ', __spreadArray([0], ohlc, true));
    return __spreadArray([0], ohlc, true);
}
exports.rangeToOHLC = rangeToOHLC;
