"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var paths_1 = require("./Constants/paths");
var fetch_1 = require("./Fetch/fetch");
console.log(paths_1.DATASETS_PATH);
var data = (0, fetch_1.fetchData)('QQQ', '1D');
console.log(data);
