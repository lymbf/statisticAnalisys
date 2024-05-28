"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    /* declare all vars for TradeResult */
    var highVariance = 0;
    var lowVariance = 0;
    var duration = 0;
    var open = signal;
    var close;
    var indicatorsUponSignal = {};
    /*then start the loop */
    for (var i = index; i < data.length; i++) {
        highVariance = options.calcHighVariance(highVariance, data[i]);
        lowVariance = options.calcLowVariance(lowVariance, data[i]);
        duration++;
        var SL = options.throwSL.apply(options, __spreadArray([i, data], options.slArgs, false));
        var TP = options.throwSL.apply(options, __spreadArray([i, data], options.tpArgs, false));
        /* <---------to be implemented--->
        * if both SL and TP -> findWhichOccurredFirst */
        if (TP && SL)
            console.log("both happened");
        if (SL) {
            close = data[i][0] * 1000;
            return {
                return: SL,
                highVariance: highVariance,
                lowVariance: lowVariance,
                duration: duration,
                open: open,
                close: close,
                indicatorsUponSignal: {}
            };
        }
        if (TP) {
            close = data[i][0] * 1000;
            return {
                return: TP,
                highVariance: highVariance,
                lowVariance: lowVariance,
                duration: duration,
                open: open,
                close: close,
                indicatorsUponSignal: {}
            };
        }
    }
    return null;
};
var runBotEngine = function (data, options) {
    /* adjust signals in case extra mapping needed ( optional )*/
    var signals = options.signals, throwSL = options.throwSL, throwTP = options.throwTP, signalsMapping = options.signalsMapping, slArgs = options.slArgs, tpArgs = options.tpArgs, indicatorsOptions = options.indicatorsOptions;
    signalsMapping && (signals = signalsMapping(signals));
    /*get MA arrays; volatility arrays;
    * important to get in advance here, instead of calculating for each trade*/
    var MA = {};
    var Volatility = {};
    indicatorsOptions.ranges.forEach(function (l) {
        MA[l] = (0, movingAverage_1.getMAByPrice)(data, l);
        Volatility[l] = (0, movingAverage_1.getMAByCCChange)(data, l);
    });
    /* construct options for perform trade*/
    var tradeOptions = __assign(__assign({}, options), { indicatorsOptions: __assign(__assign({}, options.indicatorsOptions), { MATable: MA, VolatilityTable: Volatility }) });
    signals.forEach(function (t) {
        var tradeRes = performTrade(t, data, tradeOptions);
    });
    return null;
};
var data = (0, fetch_1.fetchData)('QQQ', '1D');
runBotEngine(data, { signals: (0, fetch_1.fetchDataset)('fullMoonDates'), indicatorsOptions: { ranges: [10, 17, 25, 50] } });
