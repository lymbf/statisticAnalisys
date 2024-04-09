"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var paths_1 = require("./Constants/paths");
var fetch_1 = require("./Fetch/fetch");
var changeFollowup_1 = require("./Main/Libs/ChangeAnalisys/changeFollowup");
console.log(paths_1.DATASETS_PATH);
var data = (0, fetch_1.fetchData)('QQQ', '1D');
var res = (0, changeFollowup_1.getFollowUpRangeMap)(data, 5, 2, 'GREATER');
console.log('res: ', res);
