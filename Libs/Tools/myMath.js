"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAverageWMapper = exports.getAverage = exports.getChange = void 0;
function getChange(open, close) {
    return parseFloat((((close - open) / open) * 100).toFixed(6));
}
exports.getChange = getChange;
function getAverage(arr) {
    return parseFloat((arr.reduce(function (a, b) { return a + b; }, 0) / arr.length).toFixed(6));
}
exports.getAverage = getAverage;
function getAverageWMapper(arr, f) {
    var data;
    data = arr.map(function (el) {
        return f(el);
    });
    return parseFloat((data.reduce(function (a, b) { return a + b; }, 0) / arr.length).toFixed(6));
}
exports.getAverageWMapper = getAverageWMapper;
console.log(getChange(12, 18));
