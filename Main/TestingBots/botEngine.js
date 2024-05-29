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
Object.defineProperty(exports, "__esModule", { value: true });
var dateLib_1 = require("../../Libs/Date/dateLib");
var fetch_1 = require("../../Fetch/fetch");
var movingAverage_1 = require("../Libs/Indicators/MovingAverage/movingAverage");
var mathjs_1 = require("mathjs");
var myMath_1 = require("../../Libs/Tools/myMath");
var performTrade = function (signal, data, options) {
    /* get Index of signal bar */
    var index = data.findIndex(function (e) {
        return (0, dateLib_1.compareTimestampsByDayPlus)(e[0] * 1000, signal);
    });
    if (index < 0)
        return null;
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
        var SL = options.throwSL(index, i, data);
        var TP = options.throwTP(index, i, data);
        /* <---------to be implemented--->
        * if both SL and TP -> findWhichOccurredFirst */
        if (TP && SL)
            console.log("sl: ", SL, 'tp: ', TP);
        /* if ret has value ( sl or tp got hit ) return "TradeResult" */
        var ret = null;
        if (SL)
            ret = SL;
        if (TP)
            ret = TP;
        if (ret) {
            close = data[i][0] * 1000;
            return {
                return: ret,
                highVariance: highVariance,
                lowVariance: lowVariance,
                duration: duration,
                open: open,
                close: close,
                /* <----------  to be implemented ------->*/
                /* indicators for signal occurance for TradeResult*/
                indicatorsUponSignal: {},
                dateString: new Date(signal).toUTCString()
            };
        }
    }
    return null;
};
var runBotEngine = function (data, options) {
    /* adjust signals in case extra mapping needed ( optional )*/
    var signals = options.signals, throwSL = options.throwSL, throwTP = options.throwTP, signalsMapping = options.signalsMapping, indicatorsOptions = options.indicatorsOptions;
    signalsMapping && (signals = signalsMapping(signals));
    /*get MA arrays; volatility arrays;
    * important to get in advance here, instead of calculating for each trade*/
    var MA = {};
    var Volatility = {};
    indicatorsOptions.ranges.forEach(function (l) {
        MA[l] = (0, movingAverage_1.getMAByPrice)(data, l);
        Volatility[l] = (0, movingAverage_1.getMAByCCChange)(data, l);
    });
    /* setup result vars and calc functions (getters) init */
    /*-------------------------- */
    var won = 0;
    var lost = 0;
    var trades = [];
    var getReturn = function (trades) {
        var temp = trades.map(function (t) {
            return t.return;
        });
        var s = 0;
        for (var i = 0; i < temp.length; i++) {
            s += temp[i];
        }
        return s;
    };
    var getCompoundReturn = function (returns) {
        var temp = trades.map(function (t) {
            return t.return;
        });
        var s = 1;
        for (var i = 0; i < temp.length; i++) {
            s = s + parseFloat((s * temp[i]).toFixed(6));
        }
        return s - 1;
    };
    var getWinrate = function (won, lost) {
        return won / (won + lost);
    };
    var getMean = function (trades) {
        var temp = trades.map(function (t) {
            return t.return;
        });
        return mathjs_1.mean.apply(void 0, temp);
    };
    var getStdDev = function (returns) {
        var temp = trades.map(function (t) {
            return t.return;
        });
        return mathjs_1.std.apply(void 0, temp);
    };
    /* ------------------------ */
    /* construct options for perform trade*/
    var tradeOptions = __assign(__assign({}, options), { indicatorsOptions: __assign(__assign({}, options.indicatorsOptions), { MATable: MA, VolatilityTable: Volatility }) });
    /* loop through signals -> push trade res to trades array, increment won and lost vars */
    signals.forEach(function (t) {
        var trade = performTrade(t, data, tradeOptions);
        if (trade) {
            trades.push(trade);
            trade.return > 0 ? won++ : lost++;
        }
    });
    /* if trades array is not empty, return "SetupResult" */
    if (!trades.length)
        return null;
    return {
        trades: trades,
        won: won,
        lost: lost,
        winrate: getWinrate(won, lost),
        return: getReturn(trades),
        compoundReturn: getCompoundReturn(trades),
        mean: getMean(trades)
    };
};
var data = (0, fetch_1.fetchData)('QQQ', '1D');
var res = runBotEngine(data, {
    signals: (0, fetch_1.fetchDataset)('fullMoonDates'),
    signalsMapping: function (signals) {
        return signals.map(function (e) {
            return (0, dateLib_1.getClosestTradingDay)(e);
        });
    },
    indicatorsOptions: { ranges: [10, 17, 25, 50] },
    throwTP: function (i, j, data) {
        if (i + 6 > data.length - 1)
            return null;
        var direction = (0, myMath_1.getChange)(data[i][4], data[i + 4][4]) >= 0 ? -1 : 1;
        if (j === i + 6) {
            if (direction > 0) {
                return (0, myMath_1.getChange)(data[i + 4][4], data[j][4]);
            }
            else {
                return (0, myMath_1.getChange)(data[i + 4][4], data[j][4]) * -1;
            }
        }
        else
            return null;
    },
    throwSL: function (i, j, data) {
        if (i + 6 > data.length - 1)
            return null;
        if ((0, myMath_1.getChange)(data[i + 4][4], data[j][4]) < -0.25) {
            return -0.4;
        }
        else {
            return null;
        }
    },
    calcLowVariance: function (current, candle) {
        return -2;
    },
    calcHighVariance: function (current, candle) {
        return 3;
    }
});
console.log('setup result: ', res);
