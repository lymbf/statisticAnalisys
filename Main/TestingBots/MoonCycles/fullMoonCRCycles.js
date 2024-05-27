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
var fetch_1 = require("../../../Fetch/fetch");
var cumulativeReturns_1 = require("../../Libs/ChangeAnalisys/CumulativeReturns/cumulativeReturns");
var dateLib_1 = require("../../../Libs/Date/dateLib");
var myMath_1 = require("../../../Libs/Tools/myMath");
var mathjs_1 = require("mathjs");
var indicators_1 = require("../../Libs/Indicators/indicators");
var fullMoonDates = (0, fetch_1.fetchDataset)('fullMoonDates');
var data = (0, fetch_1.fetchData)('QQQ', '1D');
var performTrade = function (signal, data) {
    var time = (0, dateLib_1.getClosestTradingDay)(signal);
    // if (new Date(signal).getDay() === 0) time = signal + 1000 * 60 * 60 * 24
    // if (new Date(signal).getDay() === 6) time = signal + 1000 * 60 * 60 * 24 * 2
    var followUpReturns = (0, cumulativeReturns_1.getCumulativeReturnsMap)(data, signal, 10);
    if (!followUpReturns || followUpReturns.length < 8) {
        console.log('followupreturns not long enough: ');
        return null;
    }
    var i = data.findIndex(function (e) {
        return (0, dateLib_1.compareTimestampsByDayPlus)(e[0] * 1000, time);
    });
    if (i === -1)
        return null;
    var direction = followUpReturns[5][1] > 0 ? -1 : 1;
    var _a = __spreadArray([], data[i + 4], true), t = _a[0], o = _a[1], h = _a[2], l = _a[3], c = _a[4];
    var _b = __spreadArray([], data[i + 6], true), t2 = _b[0], o2 = _b[1], h2 = _b[2], l2 = _b[3], c2 = _b[4];
    var highVariance = direction > 0 ? (0, myMath_1.getChange)(c, Math.max(data[i + 5][2], h2)) : (0, myMath_1.getChange)(c, Math.min(data[i + 5][3], l2)) * -1;
    var lowVariance = direction > 0 ? (0, myMath_1.getChange)(c, Math.min(data[i + 5][3], l2)) : (0, myMath_1.getChange)(c, Math.max(data[i + 5][2], h2)) * -1;
    var ret = (0, myMath_1.getChange)(c, c2) * direction;
    var sl = 0;
    (lowVariance < -1) && (sl = -0.4);
    // console.log('sl: ', sl)
    var result = {
        return: sl < 0 ? sl : ret,
        highVariance: highVariance,
        lowVariance: lowVariance,
        duration: 3,
        open: t * 1000,
        close: t2 * 1000,
        // indicatorsUponSignal: {}
    };
    console.log((0, indicators_1.getIndicatorsForTimestamp)(signal, data));
    // console.log('result: ', result)
    return result;
    // console.log('signal date: ', new Date(signal))
    // console.log('open date: ', new Date(result.open))
};
performTrade(fullMoonDates[fullMoonDates.length - 2], data);
var testSetup = function () {
    var won = 0;
    var lost = 0;
    var trades = [];
    var sum = 0;
    var s = 1;
    fullMoonDates.slice(fullMoonDates.length - 100, fullMoonDates.length).forEach(function (timestamp) {
        var trade = performTrade(timestamp, data);
        if (trade) {
            trade.return > 0 ? won++ : lost++;
            sum += trade.return;
            s = s + parseFloat((s * trade.return).toFixed(5));
            trades.push(trade);
        }
    });
    var returns = trades.map(function (t) {
        return t.return;
    });
    return {
        trades: trades,
        stdDev: mathjs_1.std.apply(void 0, returns),
        mean: (0, mathjs_1.mean)(returns),
        return: sum,
        compoundReturn: s,
        won: won,
        lost: lost,
        winrate: won / (won + lost)
    };
};
// console.log(testSetup())
