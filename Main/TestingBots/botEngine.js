"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dateLib_1 = require("../../Libs/Date/dateLib");
var fetch_1 = require("../../Fetch/fetch");
var performTrade = function (signal, data) {
    /* get Index of signal bar */
    var index = data.findIndex(function (e) {
        return (0, dateLib_1.compareTimestampsByDayPlus)(e[0] * 1000, signal);
    });
    /*then start the loop */
    for (var i = index; i < data.length; i++) {
        console.log('i: ', i);
        if (i === index + 3)
            break;
    }
};
var runBotEngine = function (data, options) {
    var signals = options.signals, throwSL = options.throwSL, throwTP = options.throwTP, signalsMapping = options.signalsMapping;
    signalsMapping && (signals = signalsMapping(signals));
    performTrade(signals[0], data);
    signals.forEach(function (t) {
    });
};
var data = (0, fetch_1.fetchData)('QQQ', '1D');
runBotEngine(data, { signals: (0, fetch_1.fetchDataset)('fullMoonDates') });
