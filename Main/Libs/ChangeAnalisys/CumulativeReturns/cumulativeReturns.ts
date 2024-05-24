import {Change} from "../../../../Interfaces/Volatility";
import {Candle, RawData, Timestamp} from "../../../../Interfaces/Candle";
import {getChange} from "../../../../Libs/Tools/myMath";
import {fetchData, fetchDataset} from "../../../../Fetch/fetch";
import * as fs from "fs";
import * as path from "path";
import {compareTimestampsByDayPlus} from "../../../../Libs/Date/dateLib";

//includes signal in an array
const getCumulativeReturnsMap = function (data: Candle[], timestamp: number, length: number): [Timestamp, Change][] | false {
    let time = timestamp;
    if (new Date(timestamp).getDay() === 0) time = timestamp + 1000 * 60 * 60 * 24
    if (new Date(timestamp).getDay() === 6) time = timestamp + 1000 * 60 * 60 * 24 * 2

    let i = data.findIndex((c) => {
        return compareTimestampsByDayPlus(c[0] * 1000, time)
    });
    if (i === -1) return false;
    let arr = data.slice(i, data.length);
    console.log('starting candle: ', new Date(arr[0][0] * 1000).toLocaleString())
    console.log('last candle: ', new Date((arr[length] ? arr[length][0] : arr[arr.length - 1][0]) * 1000).toLocaleString())
    let map: [Timestamp, Change][] = [];
    let x: number = arr[0][1];
    for (let j = 0; (j < length && j < arr.length); j++) {
        let temp: number = arr[j][4];
        map.push([arr[j][0], getChange(x, temp)]);
    }
    fs.writeFileSync(path.join(__dirname, 'Temp', 'temp.json'), JSON.stringify(map))
    fs.writeFileSync(path.join(__dirname, 'Temp', 'tempNoTimestamp.json'), JSON.stringify(map.map((el) => {
        return el[1]
    })))
    return map;
}

export {getCumulativeReturnsMap}