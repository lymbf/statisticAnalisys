import {Timestamp} from "./Candle";
import {HashTable} from "./DataTypes";

// import {MAOptions} from "./MA";

interface TradeResult {
    return: number,
    highVariance: number,
    lowVariance: number,
    duration: number, //number of Candles
    open: Timestamp,
    close: Timestamp,
    indicatorsUponSignal: HashTable,
    dateString: string
}

interface SetupResult {
    mean?: number,
    stdDev?: number,
    return?: number,
    compoundReturn: number,
    trades?: TradeResult[],
    // biggestDrawdown?: number,
    won: number,
    lost: number,
    winrate: number
}

type TradeDirection = 1 | -1 //1 = buy;  -1 = sell

export {TradeResult, SetupResult, TradeDirection}