import {Candle, RawData} from "../../../Interfaces/Candle";
import {getATRChange, rangeToOHLC} from "../../../Libs/Tools/candleOps";
import {Volatility, VolatilityMap} from "../../../Interfaces/Volatility";
import {fetchData} from "../../../Fetch/fetch";
import {mean} from "mathjs";
import {CandleIndexArray} from "../ChangeAnalisys/changeFollowup";

function getRangeByIndexesATR(arr: Candle[], se: [start: number, end: number]): number {
    let [s, e] = se
    let range = rangeToOHLC(arr, [s, e]);
    return getATRChange(range);
}

function getRangeFullATR(arr: Candle[]): number {
    let range = rangeToOHLC(arr, [0, arr.length - 1]);
    return getATRChange(range);
}

function getATRMap(arr: Candle[]): number[] {
    return arr.map((c) => {
        return getATRChange(c);
    })
}

function getRollingVolatilityMap(arr: Candle[], distance: number): VolatilityMap {
    let res: VolatilityMap = [];
    for (let i: number = distance - 1; i < arr.length; i++) {
        let temp: number[] = arr.slice(i - distance + 1, i).map((c) => {
            return getATRChange(c)
        })
        res.push([arr[i][0], mean(temp)])
    }
    return res;
}

function getVolatility(arr: Candle[], i: number, distance: number): Volatility {
    let temp: number[] = arr.slice(i - distance + 1, i).map((c) => {
        return getATRChange(c)
    })
    return [arr[i][0], mean(temp)]
}

// function finCandlesByVolToAvgVol(arr: Candle[], predictor: number, RV_Length: number): CandleIndexArray[] {
//
// }

let data: RawData = fetchData('QQQ', '1D');

export {getVolatility, getRollingVolatilityMap, getATRMap, getRangeByIndexesATR, getRangeFullATR, getATRChange}

console.log(getRollingVolatilityMap(data.slice(data.length - 100, data.length), 10))