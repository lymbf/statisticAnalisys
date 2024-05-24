"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDataset = exports.fetchData = void 0;
var fs = require("fs");
var path = require("path");
var paths_1 = require("../Constants/paths");
var fetchData = function (symbol, interval) {
    return JSON.parse(fs.readFileSync(path.join(paths_1.DATA_BASE_PATH, symbol, interval, 'data.json')).toString());
};
exports.fetchData = fetchData;
var fetchDataset = function (name) {
    switch (name) {
        case 'fullMoonDates':
            return JSON.parse(fs.readFileSync(path.join(paths_1.DATASETS_PATH, 'MoonPhases', 'fullMoonDates.json')).toString());
        case 'newMoonDates':
            return JSON.parse(fs.readFileSync(path.join(paths_1.DATASETS_PATH, 'MoonPhases', 'newMoonDates.json')).toString());
        default:
            return null;
    }
};
exports.fetchDataset = fetchDataset;
