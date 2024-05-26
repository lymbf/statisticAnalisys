import {Timestamp} from "./Candle";

interface TradeResult {
    return: number,
    highVariance: number,
    lowVariance: number,
    duration: number, //number of Candles
    open: Timestamp,
    close: Timestamp
}

interface SetupResult {
    mean?: number,
    stdDev?: number,
    return?: number,
    trades?: TradeResult[],
    // biggestDrawdown?: number,
    won: number,
    lost: number,
    winrate: number
}

type TradeDirection = 1 | -1 //1 = buy;  -1 = sell

export {TradeResult, SetupResult, TradeDirection}