import {RawData} from "../Interfaces/Candle";
import * as fs from "fs";
import * as path from "path";
import {DATA_BASE_PATH} from "../Constants/paths";

const fetchData = function (symbol: string, interval: string): RawData {
    return JSON.parse(fs.readFileSync(path.join(DATA_BASE_PATH, symbol, interval, 'data.json')).toString());
}

export {fetchData}