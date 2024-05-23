"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMapOfGMTDates = exports.compareTimestampsByDayPlus = exports.getLastDateOfTheMonth = exports.getDateOfNthDayOfTheMonth = exports.getLastDayOfTheMonth = exports.getFirstDayOfTheMonth = exports.getTime = void 0;
var basicConstants_1 = require("../../Constants/basicConstants");
function getLastDateOfTheMonth(timestamp) {
    var m = new Date(timestamp).getMonth();
    var y = new Date(timestamp).getFullYear();
    return new Date(y, m + 1, 0).getDate();
}
exports.getLastDateOfTheMonth = getLastDateOfTheMonth;
function getLastDayOfTheMonth(timestamp, name) {
    var date = new Date(timestamp);
    var y = date.getFullYear();
    var m = date.getMonth();
    var lastDate = getLastDateOfTheMonth(timestamp);
    var d = new Date(y, m, lastDate).getDay();
    if (name)
        return basicConstants_1.days[d];
    else
        return d;
}
exports.getLastDayOfTheMonth = getLastDayOfTheMonth;
function getFirstDayOfTheMonth(timestamp, name) {
    var date = new Date(timestamp);
    var y = date.getFullYear();
    var m = date.getMonth();
    if (!name)
        return new Date(y, m, 1).getDay();
    else
        return basicConstants_1.days[new Date(y, m, 1).getDay()];
}
exports.getFirstDayOfTheMonth = getFirstDayOfTheMonth;
function getDateOfNthDayOfTheMonth(n, day, month, year) {
    if (n > 5)
        return false;
    var d = basicConstants_1.days.indexOf(day);
    var m = basicConstants_1.months.indexOf(month);
    var date = false;
    var temp = 1;
    for (var i = 1; i < 32; i++) {
        var dd = new Date(year, m, i, 15, 30);
        if (dd.getDay() === d) {
            if (temp === n) {
                date = dd.getDate();
                break;
            }
            else {
                temp++;
            }
        }
    }
    if (!date)
        return false;
    else
        return date;
}
exports.getDateOfNthDayOfTheMonth = getDateOfNthDayOfTheMonth;
function getTime(year, month, day, hour, minutes) {
    var date = new Date(year, month, day, hour, minutes);
    return date.getTime();
}
exports.getTime = getTime;
function compareTimestampsByDayPlus(t1, t2) {
    var x = 1000 * 60 * 60 * 24;
    return (t1 - t1 % x) === (t2 - t2 % x);
}
exports.compareTimestampsByDayPlus = compareTimestampsByDayPlus;
function getMapOfGMTDates(start) {
    var res = [];
    var date = new Date(start);
    var temp = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    while (temp < new Date().getTime()) {
        res.push(temp);
        temp += 1000 * 60 * 60 * 24;
    }
    return res;
}
exports.getMapOfGMTDates = getMapOfGMTDates;
