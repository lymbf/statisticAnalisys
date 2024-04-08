import {Candle} from "../../Interfaces/Candle";
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

export {getATRChange, getCCChange, getOCChange, getChange, isGreen}