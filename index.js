"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var paths_1 = require("./Constants/paths");
var fetch_1 = require("./Fetch/fetch");
var changeFollowup_1 = require("./Main/Libs/ChangeAnalisys/changeFollowup");
var candleOps_1 = require("./Libs/Tools/candleOps");
console.log(paths_1.DATASETS_PATH);
var data = (0, fetch_1.fetchData)('QQQ', '1D');
// console.log(data)
var res = (0, changeFollowup_1.findCandlesByChange)(data, 2, 'GREATER');
res = res.slice(res.length - 5, res.length);
console.log(new Date(res[0][0][0] * 1000).toLocaleString());
console.log(res.map(function (el) {
    return (0, candleOps_1.getOCChange)(el[0]);
}));
console.log((0, changeFollowup_1.checkFollowUpRangeChange)(data, res[0], 5));
