import {SetupResult, TradeResult} from "../../Interfaces/Trades";
import {Candle, Timestamp} from "../../Interfaces/Candle";
import {compareTimestampsByDayPlus} from "../../Libs/Date/dateLib";
import {fetchData, fetchDataset} from "../../Fetch/fetch";
import {MA} from "../../Interfaces/MA";
import {HashTable} from "../../Interfaces/DataTypes";
import {getMAByCCChange, getMAByPrice} from "../Libs/Indicators/MovingAverage/movingAverage";

interface BotEngineOptions {
    signals: Timestamp[],

    signalsMapping?(signals: Timestamp[]): Timestamp[]

    slArgs?: any[],

    throwSL?(...args: any[]): number,

    tpArgs?: any[],

    throwTP?(...args: any[]): number,

    indicatorsOptions: {
        ranges: number[]
    }
}

const performTrade = function (signal: Timestamp, data: Candle[], options: BotEngineOptions): TradeResult {
    /* get Index of signal bar */
    let index = data.findIndex(e => {
        return compareTimestampsByDayPlus(e[0] * 1000, signal)
    })
    /*then start the loop */
    for (let i = index; i < data.length; i++) {
        let SL = options.throwSL(i, data, ...options.slArgs)
        let TP = options.throwSL(i, data, ...options.tpArgs)
    }

    return null
}

const runBotEngine = function (data: Candle[], options: BotEngineOptions): SetupResult {
    /* adjust signals in case extra mapping needed ( optional )*/
    let {signals, throwSL, throwTP, signalsMapping, indicatorsOptions} = options;
    signalsMapping && (signals = signalsMapping(signals))

    /*get MA arrays; volatility array;
    * important to get in advance here, instead of calculating for each trade*/
    let MA: HashTable = {};
    let Volatility: HashTable = {};
    indicatorsOptions.ranges.forEach(l => {
        MA[l] = getMAByPrice(data, l);
        Volatility[l] = getMAByCCChange(data, l);
    })
    console.log('MA: ', MA)
    console.log('Volatility: ', Volatility)

    signals.forEach(t => {

    })
    return null

}

let data = fetchData('QQQ', '1D')
runBotEngine(data, {signals: fetchDataset('fullMoonDates'), indicatorsOptions: {ranges: [10, 17, 25, 50]}})