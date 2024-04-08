"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGreen = exports.getChange = exports.getOCChange = exports.getCCChange = exports.getATRChange = void 0;
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
