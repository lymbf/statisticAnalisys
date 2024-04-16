"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getATRChange = exports.getRangeFullATR = exports.getRangeByIndexesATR = exports.getATRMap = exports.getRollingVolatilityMap = exports.getVolatility = void 0;
var candleOps_1 = require("../../../Libs/Tools/candleOps");
Object.defineProperty(exports, "getATRChange", { enumerable: true, get: function () { return candleOps_1.getATRChange; } });
var fetch_1 = require("../../../Fetch/fetch");
var mathjs_1 = require("mathjs");
function getRangeByIndexesATR(arr, se) {
    var s = se[0], e = se[1];
    var range = (0, candleOps_1.rangeToOHLC)(arr, [s, e]);
    return (0, candleOps_1.getATRChange)(range);
}
exports.getRangeByIndexesATR = getRangeByIndexesATR;
function getRangeFullATR(arr) {
    var range = (0, candleOps_1.rangeToOHLC)(arr, [0, arr.length - 1]);
    return (0, candleOps_1.getATRChange)(range);
}
exports.getRangeFullATR = getRangeFullATR;
function getATRMap(arr) {
    return arr.map(function (c) {
        return (0, candleOps_1.getATRChange)(c);
    });
}
exports.getATRMap = getATRMap;
function getRollingVolatilityMap(arr, distance) {
    var res = [];
    for (var i = distance - 1; i < arr.length; i++) {
        var temp = arr.slice(i - distance + 1, i).map(function (c) {
            return (0, candleOps_1.getATRChange)(c);
        });
        res.push([arr[i][0], (0, mathjs_1.mean)(temp)]);
    }
    return res;
}
exports.getRollingVolatilityMap = getRollingVolatilityMap;
function getVolatility(arr, i, distance) {
    var temp = arr.slice(i - distance + 1, i).map(function (c) {
        return (0, candleOps_1.getATRChange)(c);
    });
    return [arr[i][0], (0, mathjs_1.mean)(temp)];
}
exports.getVolatility = getVolatility;
// function finCandlesByVolToAvgVol(arr: Candle[], predictor: number, RV_Length: number): CandleIndexArray[] {
//
// }
var data = (0, fetch_1.fetchData)('DAX', '1D');
console.log(getRollingVolatilityMap(data.slice(data.length - 100, data.length), 10));
