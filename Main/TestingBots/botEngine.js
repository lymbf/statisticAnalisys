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
var dateLib_1 = require("../../Libs/Date/dateLib");
var fetch_1 = require("../../Fetch/fetch");
var movingAverage_1 = require("../Libs/Indicators/MovingAverage/movingAverage");
var performTrade = function (signal, data, options) {
    /* get Index of signal bar */
    var index = data.findIndex(function (e) {
        return (0, dateLib_1.compareTimestampsByDayPlus)(e[0] * 1000, signal);
    });
    /*then start the loop */
    for (var i = index; i < data.length; i++) {
        var SL = options.throwSL.apply(options, __spreadArray([i, data], options.slArgs, false));
        var TP = options.throwSL.apply(options, __spreadArray([i, data], options.tpArgs, false));
    }
    return null;
};
var runBotEngine = function (data, options) {
    /* adjust signals in case extra mapping needed ( optional )*/
    var signals = options.signals, throwSL = options.throwSL, throwTP = options.throwTP, signalsMapping = options.signalsMapping, indicatorsOptions = options.indicatorsOptions;
    signalsMapping && (signals = signalsMapping(signals));
    /*get MA arrays; volatility array;
    * important to get in advance here, instead of calculating for each trade*/
    var MA = {};
    var Volatility = {};
    indicatorsOptions.ranges.forEach(function (l) {
        MA[l] = (0, movingAverage_1.getMAByPrice)(data, l);
        Volatility[l] = (0, movingAverage_1.getMAByCCChange)(data, l);
    });
    console.log('MA: ', MA);
    console.log('Volatility: ', Volatility);
    signals.forEach(function (t) {
    });
    return null;
};
var data = (0, fetch_1.fetchData)('QQQ', '1D');
runBotEngine(data, { signals: (0, fetch_1.fetchDataset)('fullMoonDates'), indicatorsOptions: { ranges: [10, 17, 25, 50] } });
