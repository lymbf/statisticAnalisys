"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCumulativeReturnsMap = void 0;
var myMath_1 = require("../../../../Libs/Tools/myMath");
var fs = require("fs");
var path = require("path");
var dateLib_1 = require("../../../../Libs/Date/dateLib");
//includes signal in an array
var getCumulativeReturnsMap = function (data, timestamp, length) {
    var time = timestamp;
    if (new Date(timestamp).getDay() === 0)
        time = timestamp + 1000 * 60 * 60 * 24;
    if (new Date(timestamp).getDay() === 6)
        time = timestamp + 1000 * 60 * 60 * 24 * 2;
    var i = data.findIndex(function (c) {
        return (0, dateLib_1.compareTimestampsByDayPlus)(c[0] * 1000, time);
    });
    if (i === -1)
        return false;
    var arr = data.slice(i, data.length);
    console.log('starting candle: ', new Date(arr[0][0] * 1000).toLocaleString());
    console.log('last candle: ', new Date((arr[length] ? arr[length][0] : arr[arr.length - 1][0]) * 1000).toLocaleString());
    var map = [];
    var x = arr[0][1];
    for (var j = 0; (j < length && j < arr.length); j++) {
        var temp = arr[j][4];
        map.push([arr[j][0], (0, myMath_1.getChange)(x, temp)]);
    }
    fs.writeFileSync(path.join(__dirname, 'Temp', 'temp.json'), JSON.stringify(map));
    fs.writeFileSync(path.join(__dirname, 'Temp', 'tempNoTimestamp.json'), JSON.stringify(map.map(function (el) {
        return el[1];
    })));
    return map;
};
exports.getCumulativeReturnsMap = getCumulativeReturnsMap;
