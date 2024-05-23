import {RawData} from "../Interfaces/Candle";
import * as fs from "fs";
import * as path from "path";
import {DATA_BASE_PATH, DATASETS_PATH} from "../Constants/paths";
import {Dataset} from "../Interfaces/Other";

const fetchData = function (symbol: string, interval: string): RawData {
    return JSON.parse(fs.readFileSync(path.join(DATA_BASE_PATH, symbol, interval, 'data.json')).toString());
}

const fetchDataset = function (name: string): Dataset {
    switch (name) {
        case 'fullMoonDates':
            return JSON.parse(fs.readFileSync(path.join(DATASETS_PATH, 'MoonPhases', 'fullMoonDates.json')).toString());
        case 'newMoonDates':
            return JSON.parse(fs.readFileSync(path.join(DATASETS_PATH, 'MoonPhases', 'newMoonDates.json')).toString());
        default:
            return null
    }
}
export {fetchData, fetchDataset}