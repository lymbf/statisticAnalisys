"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var candleOps_1 = require("../../../../Libs/Tools/candleOps");
var mathjs_1 = require("mathjs");
function getMAByPrice(arr, distance) {
    var res = [];
    for (var i = distance - 1; i < arr.length; i++) {
        var temp = arr.slice(i - distance + 1, i).map(function (c) {
            return (0, candleOps_1.getClose)(c);
        });
        res.push([arr[i][0], (0, mathjs_1.mean)(temp)]);
    }
    return res;
}
function getMAByOCChange(arr, distance) {
    var res = [];
    for (var i = distance - 1; i < arr.length; i++) {
        var temp = arr.slice(i - distance + 1, i).map(function (c) {
            return (0, candleOps_1.getOCChange)(c);
        });
        res.push([arr[i][0], (0, mathjs_1.mean)(temp)]);
    }
    return res;
}
function getMAByCCChange(arr, distance) {
    var res = [];
    for (var i = distance + 1; i < arr.length; i++) {
        var temp = arr.slice(i - distance - 1, i).map(function (c, j, t) {
            return (0, candleOps_1.getCCChange)(c, t[j + 1]);
        });
        res.push([arr[i][0], (0, mathjs_1.mean)(temp)]);
    }
    return res;
}
