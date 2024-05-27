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
exports.getMADeviations = exports.getMAByPrice = exports.getMAByCCChange = exports.getMAByOCChange = exports.getMAOptions = void 0;
var candleOps_1 = require("../../../../Libs/Tools/candleOps");
var mathjs_1 = require("mathjs");
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
exports.getMAByPrice = getMAByPrice;
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
exports.getMAByOCChange = getMAByOCChange;
function getMAByCCChange(arr, distance) {
    var res = [];
    for (var i = distance + 1; i < arr.length; i++) {
        var temp = arr.slice(i - distance - 1, i).map(function (c, j, t) {
            if (j + 1 < t.length) {
                return (0, candleOps_1.getCCChange)(c, t[j + 1]);
            }
        }).filter(function (e) {
            return !isNaN(e);
        });
        res.push([arr[i][0], (0, mathjs_1.mean)(temp)]);
    }
    return res;
}
exports.getMAByCCChange = getMAByCCChange;
function getMADeviations(MA, candle) {
    var _a = __spreadArray([], candle, true), t = _a[0], o = _a[1], h = _a[2], l = _a[3], c = _a[4];
    var filteredMA = MA.filter(function (el) {
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
exports.getMADeviations = getMADeviations;
// ----->>>>>> returns hashlist of MA [interval, value] pairs; <<<<<--------
function getMAOptions(timestamp, data, options) {
    var opts = {};
    var temp = options && options.range ? options.range : [10, 15, 17, 20, 30, 50, 100, 200];
    if (options && options.type && options.type === 'CC') {
        temp.forEach(function (dist) {
            var ma = getMAByCCChange(data, dist).filter(function (e) {
                return e[0] * 1000 === timestamp;
            });
            opts["".concat(dist)] = ma.length ? ma[0][1] : null;
        });
    }
    else if (options && options.type && options.type === 'OC') {
        temp.forEach(function (dist) {
            var ma = getMAByOCChange(data, dist).filter(function (e) {
                return e[0] * 1000 === timestamp;
            });
            opts[dist] = ma.length ? ma[0][1] : null;
        });
    }
    else {
        temp.forEach(function (dist) {
            var ma = getMAByPrice(data, dist).filter(function (e) {
                return e[0] * 1000 === timestamp;
            });
            opts[dist] = ma.length ? getMADeviations(ma, data[data.findIndex(function (e) {
                return e[0] * 1000 === timestamp;
            })]).closeDeviation : null;
        });
    }
    return opts;
}
exports.getMAOptions = getMAOptions;
// let data: RawData = fetchData('QQQ', '1D');
// data = data.slice(data.length - 250, data.length)
// let MA = getMAByPrice(data, 50);
//
//
// // console.log('MA deviations: ', getMADeviations(MA, data[21]));
// let res = []
// for (let i: number = 51; i < data.length; i++) {
//     res.push(math.abs(getMADeviations(MA, data[i]).closeDeviation))
// }
//
// console.log('average deviation: ', mean([...res]));
// console.log('std dev: ', std([...res]))
