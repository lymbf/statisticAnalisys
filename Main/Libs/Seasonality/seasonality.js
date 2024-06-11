"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var candleOps_1 = require("../../../Libs/Tools/candleOps");
var fetch_1 = require("../../../Fetch/fetch");
var mathjs_1 = require("mathjs");
var months_1 = require("../../../Constants/months");
var getMonthlySeasonalityChange = function (data, options) {
    var arr = new Array(12).fill(null).map(function () { return Array(); });
    var candles = data;
    if (options && options.dailyData) {
        /* handle mapping daily candles into monthly candles */
    }
    candles.forEach(function (c) {
        var m = new Date(c[0] * 1000).getMonth();
        arr[m].push((0, candleOps_1.getOCChange)(c));
    });
    return arr.map(function (e) {
        if (!options)
            return (0, mathjs_1.mean)(e);
        if (options.presentable) {
            return (options.median ? (0, mathjs_1.median)(e) * 100 : (0, mathjs_1.mean)(e) * 100);
        }
        return (options.median ? (0, mathjs_1.median)(e) : (0, mathjs_1.mean)(e));
    });
};
var data = (0, fetch_1.fetchData)('KGHM', '1M');
var res1 = getMonthlySeasonalityChange(data, { presentable: true, median: true });
console.log('median seasonality:');
console.log('-------------');
res1.forEach(function (m, i) {
    console.log("".concat(months_1.months[i], ": ").concat(m.toFixed(3), "%"));
});
console.log('-------------');
console.log(' mean seasonality: ');
console.log('-------------');
var res2 = getMonthlySeasonalityChange(data, { presentable: true, median: false });
res2.forEach(function (m, i) {
    console.log("".concat(months_1.months[i], ": ").concat(m.toFixed(3), "%"));
});
