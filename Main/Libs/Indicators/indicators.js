"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndicatorsForTimestamp = void 0;
var movingAverage_1 = require("./MovingAverage/movingAverage");
var dateLib_1 = require("../../../Libs/Date/dateLib");
function getIndicatorsForTimestamp(timestamp, data) {
    var i = data.findIndex(function (e) {
        return e[0] * 1000 === timestamp;
    });
    i === -1 && (i = data.findIndex(function (e) {
        return (0, dateLib_1.compareTimestampsByDayPlus)(timestamp, e[0] * 1000);
    }));
    var t;
    if (i < 0)
        return null;
    else
        t = data[i][0] * 1000;
    return {
        MADeviation: (0, movingAverage_1.getMAOptions)(t, data, { type: 'P' }),
        AverageVolatility: (0, movingAverage_1.getMAOptions)(t, data, { type: 'CC' })
    };
}
exports.getIndicatorsForTimestamp = getIndicatorsForTimestamp;
