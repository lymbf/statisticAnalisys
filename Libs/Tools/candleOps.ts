import {Candle, OHLC} from "../../Interfaces/Candle";
import {getChange} from "./myMath";

function isGreen(candle: Candle): boolean {
    let [t, o, h, l, c] = candle;
    return c - o > 0
}

function getOCChange(candle: Candle) {
    let [t, o, h, l, c] = candle;
    return getChange(o, c)
}

function getCCChange(candle1: Candle, candle2: Candle): number {
    let [t, o, h, l, c] = candle1;
    let [t2, o2, h2, l2, c2] = candle2;
    return getChange(c, c2)
}

function getATRChange(candle: Candle): number {
    let [t, o, h, l, c] = candle;
    return getChange(l, h)
}

function rangeToOHLC(arr: Candle[], se: [start: number, end: number], returnRangeData: boolean): Candle | [Candle, Candle[]] {
    let [s, e] = se;
    let ohlc: OHLC = [0, 0, 0, 0];
    let rangeData: Candle[] = [];
    for (let i: number = s; i < e + 1; i++) {
        returnRangeData && rangeData.push(arr[i]);
        i === e && (ohlc[3] = arr[i][4]);
        i === s && (ohlc[0] = arr[i][1]);
        ohlc[2] = ohlc[2] !== 0 ? Math.min(ohlc[2], arr[i][3]) : arr[i][3];
        ohlc[1] = Math.max(ohlc[1], arr[i][2])
    }

    if (returnRangeData) return [[0, ...ohlc], rangeData];
    else return [0, ...ohlc];
}

export {getATRChange, getCCChange, getOCChange, getChange, isGreen}