"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var changeFollowup_1 = require("../ChangeAnalisys/changeFollowup");
var candleOps_1 = require("../../../Libs/Tools/candleOps");
var fetch_1 = require("../../../Fetch/fetch");
var fs = require("fs");
var path = require("path");
function getFollowupMoveRange(data, candle) {
    var current = candle[0];
    var following = data[candle[1] + 1];
    var rangeDown = (0, candleOps_1.getChange)((0, candleOps_1.getClose)(current), (0, candleOps_1.getLow)(following));
    var rangeUp = (0, candleOps_1.getChange)((0, candleOps_1.getClose)(current), (0, candleOps_1.getHigh)(following));
    return [candle[0][0], rangeDown, rangeUp];
}
function getFollowupMoveRangeMap(data, signals) {
    var res = [];
    signals.forEach(function (el) {
        res.push(getFollowupMoveRange(data, el));
    });
    fs.writeFileSync(path.join(__dirname, 'Temp', 'rangeDown.json'), JSON.stringify(res.map(function (el) {
        return el[1];
    })));
    fs.writeFileSync(path.join(__dirname, 'Temp', 'rangeUp.json'), JSON.stringify(res.map(function (el) {
        return el[2];
    })));
    fs.writeFileSync(path.join(__dirname, 'Temp', 'dates.json'), JSON.stringify(res.map(function (el) {
        return el[0];
    })));
    return res;
}
var data = (0, fetch_1.fetchData)('QQQ', '1D');
var signals = (0, changeFollowup_1.findCandlesByChange)(data, -1.5, 'LESSER');
var res = getFollowupMoveRangeMap(data, signals);
console.log(res.slice(res.length - 5, res.length));
console.log(new Date(res[res.length - 1][0] * 1000).toLocaleDateString());
