"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowUpRangeMap = exports.checkFollowUpRangeChange = exports.findCandlesByChange = void 0;
var candleOps_1 = require("../../../Libs/Tools/candleOps");
var fs = require("fs");
var path = require("path");
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
    return res;
}
exports.findCandlesByChange = findCandlesByChange;
function checkFollowUpRangeChange(data, candle, distance) {
    var i = candle[1];
    var range = data.slice(i + 1, distance);
    return (0, candleOps_1.getOCChange)((0, candleOps_1.rangeToOHLC)(data, [i, i + distance]));
}
exports.checkFollowUpRangeChange = checkFollowUpRangeChange;
function getFollowUpRangeMap(data, distance, change, greater) {
    var candles = findCandlesByChange(data, change, greater);
    var res = [];
    candles.forEach(function (candle) {
        res.push(checkFollowUpRangeChange(data, candle, distance));
    });
    fs.writeFileSync(path.join(__dirname, 'Temp/changeFollowup.json'), JSON.stringify(res));
    return res;
}
exports.getFollowUpRangeMap = getFollowUpRangeMap;
