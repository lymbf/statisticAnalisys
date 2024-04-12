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

function getHigh(candle: Candle): number {
    let [t, o, h, l, c] = candle;
    return h;
}

function getLow(candle: Candle): number {
    let [t, o, h, l, c] = candle;
    return h;
}

function getOpen(candle: Candle): number {
    let [t, o, h, l, c] = candle;
    return o;
}

function getClose(candle: Candle): number {
    let [t, o, h, l, c] = candle;
    return c;
}

function getTime(candle: Candle): number {
    let [t, o, h, l, c] = candle;
    return t * 1000;
}

function rangeToOHLC(arr: Candle[], se: [start: number, end: number]): Candle {
    let [s, e] = se;

    let ohlc: OHLC = [0, 0, 0, 0];
    if (e >= arr.length) return [0, ...ohlc];
    for (let i: number = s; i < e + 1; i++) {
        i === e && (ohlc[3] = arr[i][4]);
        i === s && (ohlc[0] = arr[i][1]);
        ohlc[2] = ohlc[2] !== 0 ? Math.min(ohlc[2], arr[i][3]) : arr[i][3];
        ohlc[1] = Math.max(ohlc[1], arr[i][2])
    }
    // console.log('signal: ', new Date(arr[s - 1][0] * 1000))
    // console.log('date: ', new Date(arr[s - 1][0] * 1000).toLocaleDateString())
    // console.log('range: ', [0, ...ohlc])
    return [0, ...ohlc];
}

export {getATRChange, getCCChange, getOCChange, getChange, isGreen, rangeToOHLC}