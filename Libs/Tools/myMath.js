"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getChange(open, close) {
    return parseFloat((((close - open) / open) * 100).toFixed(6));
}
function getAverage(arr, f) {
    var data;
    console.log(typeof arr);
}
getAverage([1, 2, 4, 5]);
