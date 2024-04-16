"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowUpRangeMap = exports.checkFollowUpRangeChange = exports.findCandlesByChange = void 0;
var candleOps_1 = require("../../../Libs/Tools/candleOps");
var fs = require("fs");
var path = require("path");
var fetch_1 = require("../../../Fetch/fetch");
var Mathjs = require("mathjs");
// greater: 'GREATER' || 'LESSER'
function findCandlesByChange(arr, change, greater) {
    var res = [];
    for (var i = 0; i < arr.length; i++) {
        switch (greater) {
            case 'LESSER':
                if ((0, candleOps_1.getOCChange)(arr[i]) <= change) {
                    res.push([arr[i], i]);
                }
                break;
            case 'GREATER':
                if ((0, candleOps_1.getOCChange)(arr[i]) >= change) {
                    res.push([arr[i], i]);
                }
                break;
            default:
                break;
        }
    }
    var br = 1000 * 60 * 60 * 24 * 5;
    return res.filter(function (el, i, arr) {
        if (i === 0)
            return true;
        return !((el[0][0] * 1000 - br) < arr[i - 1][0][0] * 1000);
    });
}
exports.findCandlesByChange = findCandlesByChange;
function checkFollowUpRangeChange(data, candle, distance) {
    var i = candle[1];
    return (0, candleOps_1.getOCChange)((0, candleOps_1.rangeToOHLC)(data, [i + 1, i + distance]));
}
exports.checkFollowUpRangeChange = checkFollowUpRangeChange;
function checkPreviousRangeChange(data, candle, distance) {
    var i = candle[1];
    return (0, candleOps_1.getOCChange)((0, candleOps_1.rangeToOHLC)(data, [i - distance, i]));
}
function getFollowUpRangeMap(data, distance, signalCandles, greater) {
    var candles = signalCandles;
    var res = [];
    candles.forEach(function (candle) {
        res.push(checkFollowUpRangeChange(data, candle, distance));
    });
    fs.writeFileSync(path.join(__dirname, 'Temp/changeFollowup.json'), JSON.stringify(res));
    return res;
}
exports.getFollowUpRangeMap = getFollowUpRangeMap;
function getDatesMap(data, change, greater) {
    var r = findCandlesByChange(data, change, greater).map(function (el) {
        return new Date(el[0][0] * 1000).toLocaleDateString();
    });
    fs.writeFileSync(path.join(__dirname, 'Temp/dates.json'), JSON.stringify(r));
    return r;
}
// function getSignalDates()
var distance = 7;
var change = 1;
var greater = 'LESSER';
var data = (0, fetch_1.fetchData)('DAX', '1D');
// console.log(new Date(data[0][0] * 1000).toLocaleString())
// console.log(new Date(data[data.length - 1][0] * 1000).toLocaleString())
// let signalCandles: CandleIndexArray[] = findCandlesByChange(data, change, greater)
// let res: RangeMap = getFollowUpRangeMap(data, distance, signalCandles, greater);
// let dates: string[] = getDatesMap(data, change, greater)
// console.log('length: ', res.length)
// console.log('avg: ', Mathjs.mean(res))
for (var i = 1; i < 2; i++) {
    for (var j = -1.5; j > -2; j -= 0.25) {
        console.log('------>>>><<<<<<<-----');
        console.log('distance: ', i, 'signal change: ', j);
        var signalCandles = findCandlesByChange(data, j, greater);
        var r = getFollowUpRangeMap(data, i, signalCandles, greater);
        r.length && console.log(Mathjs.mean(r));
        r.length && console.log('length: ', r.length, 'probability: ', r.map(function (el) {
            return el > 0 ? 1 : 0;
        }).reduce(function (acc, curr) {
            return acc + curr;
        }, 0) / r.length);
        console.log('------>>>><<<<<<<-----');
    }
}
