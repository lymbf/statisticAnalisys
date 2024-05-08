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
var candleOps_1 = require("../../../../Libs/Tools/candleOps");
var mathjs_1 = require("mathjs");
var fetch_1 = require("../../../../Fetch/fetch");
var math = require("mathjs");
function getMAByPrice(arr, distance) {
    var res = [];
    for (var i = distance - 1; i < arr.length; i++) {
        var temp = arr.slice(i - distance + 1, i).map(function (c) {
            return (0, candleOps_1.getClose)(c);
        });
        res.push([arr[i][0], (0, mathjs_1.mean)(temp)]);
    }
    return res;
}
function getMAByOCChange(arr, distance) {
    var res = [];
    for (var i = distance - 1; i < arr.length; i++) {
        var temp = arr.slice(i - distance + 1, i).map(function (c) {
            return (0, candleOps_1.getOCChange)(c);
        });
        res.push([arr[i][0], (0, mathjs_1.mean)(temp)]);
    }
    return res;
}
function getMAByCCChange(arr, distance) {
    var res = [];
    for (var i = distance + 1; i < arr.length; i++) {
        var temp = arr.slice(i - distance - 1, i).map(function (c, j, t) {
            return (0, candleOps_1.getCCChange)(c, t[j + 1]);
        });
        res.push([arr[i][0], (0, mathjs_1.mean)(temp)]);
    }
    return res;
}
function getMADeviations(MA, candle) {
    var _a = __spreadArray([], candle, true), t = _a[0], o = _a[1], h = _a[2], l = _a[3], c = _a[4];
    var filteredMA = MA.filter(function (el) {
        if (el[0] === t)
            console.log('MA value: ', el[1]);
        return el[0] === t;
    })[0][1];
    var closeDeviation = -1 * (0, candleOps_1.getChange)(c, filteredMA);
    var openDeviation = -1 * (0, candleOps_1.getChange)(o, filteredMA);
    var highDeviation = -1 * (0, candleOps_1.getChange)(h, filteredMA);
    var lowDeviation = -1 * (0, candleOps_1.getChange)(l, filteredMA);
    // console.log('timestamp: ', new Date(t * 1000).toLocaleString());
    // console.log('close: ', c)
    return { closeDeviation: closeDeviation, highDeviation: highDeviation, lowDeviation: lowDeviation, openDeviation: openDeviation };
}
var data = (0, fetch_1.fetchData)('QQQ', '1D');
data = data.slice(data.length - 250, data.length);
var MA = getMAByPrice(data, 50);
// console.log('MA deviations: ', getMADeviations(MA, data[21]));
var res = [];
for (var i = 51; i < data.length; i++) {
    res.push(math.abs(getMADeviations(MA, data[i]).closeDeviation));
}
console.log('average deviation: ', (0, mathjs_1.mean)(__spreadArray([], res, true)));
console.log('std dev: ', (0, mathjs_1.std)(__spreadArray([], res, true)));
