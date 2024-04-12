"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var candleOps_1 = require("../../../Libs/Tools/candleOps");
var fetch_1 = require("../../../Fetch/fetch");
var mathjs_1 = require("mathjs");
function getRangeByIndexesATR(arr, se) {
    var s = se[0], e = se[1];
    var range = (0, candleOps_1.rangeToOHLC)(arr, [s, e]);
    return (0, candleOps_1.getATRChange)(range);
}
function getRangeFullATR(arr) {
    var range = (0, candleOps_1.rangeToOHLC)(arr, [0, arr.length - 1]);
    return (0, candleOps_1.getATRChange)(range);
}
function getATRMap(arr) {
    return arr.map(function (c) {
        return (0, candleOps_1.getATRChange)(c);
    });
}
function getRollingVolatilityMap(arr, distance) {
    var res = [];
    for (var i = distance - 1; i < arr.length; i++) {
        var temp = arr.slice(i - distance + 1, i).map(function (c) {
            return (0, candleOps_1.getATRChange)(c);
        });
        res.push([arr[i][0] * 1000, (0, mathjs_1.mean)(temp)]);
    }
    return res;
}
function getVolatility(arr, i, distance) {
    var temp = arr.slice(i - distance + 1, i).map(function (c) {
        return (0, candleOps_1.getATRChange)(c);
    });
    return [arr[i][0] * 1000, (0, mathjs_1.mean)(temp)];
}
var data = (0, fetch_1.fetchData)('DAX', '1D');
console.log(getRollingVolatilityMap(data.slice(data.length - 100, data.length), 10));
