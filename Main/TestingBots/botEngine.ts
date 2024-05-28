import {SetupResult, TradeResult} from "../../Interfaces/Trades";
import {Candle, Timestamp} from "../../Interfaces/Candle";
import {compareTimestampsByDayPlus} from "../../Libs/Date/dateLib";
import {fetchData, fetchDataset} from "../../Fetch/fetch";
import {MA} from "../../Interfaces/MA";
import {HashTable} from "../../Interfaces/DataTypes";
import {getMAByCCChange, getMAByPrice} from "../Libs/Indicators/MovingAverage/movingAverage";
import {max} from "mathjs";

interface BotEngineOptions {
    signals: Timestamp[],

    signalsMapping?(signals: Timestamp[]): Timestamp[]

    slArgs?: any[],

    throwSL?(...args: any[]): number,

    tpArgs?: any[],

    throwTP?(...args: any[]): number,

    calcHighVariance?(current: number, candle: Candle): number,

    calcLowVariance?(current: number, candle: Candle): number,

    lowVarianceArgs?: any[],
    indicatorsOptions: {
        ranges: number[],
        MATable?: HashTable,
        VolatilityTable?: HashTable
    }
}


const performTrade = function (signal: Timestamp, data: Candle[], options: BotEngineOptions): TradeResult {
    /* get Index of signal bar */
    let index = data.findIndex(e => {
        return compareTimestampsByDayPlus(e[0] * 1000, signal)
    })
    /* declare all vars for TradeResult */
    let highVariance = 0;
    let lowVariance = 0;
    let duration = 0;
    let open = signal;
    let close: Timestamp;
    let indicatorsUponSignal: HashTable = {};
    /*then start the loop */
    for (let i = index; i < data.length; i++) {
        highVariance = options.calcHighVariance(highVariance, data[i])
        lowVariance = options.calcLowVariance(lowVariance, data[i]);
        duration++;
        let SL = options.throwSL(i, data, ...options.slArgs)
        let TP = options.throwSL(i, data, ...options.tpArgs)

        /* <---------to be implemented--->
        * if both SL and TP -> findWhichOccurredFirst */
        if (TP && SL) console.log("both happened");

        if (SL) {
            close = data[i][0] * 1000;
            return {
                return: SL,
                highVariance,
                lowVariance,
                duration,
                open,
                close,
                indicatorsUponSignal: {}
            }
        }
        if (TP) {
            close = data[i][0] * 1000;
            return {
                return: TP,
                highVariance,
                lowVariance,
                duration,
                open,
                close,
                indicatorsUponSignal: {}
            }
        }
    }

    return null
}

const runBotEngine = function (data: Candle[], options: BotEngineOptions): SetupResult {
    /* adjust signals in case extra mapping needed ( optional )*/
    let {signals, throwSL, throwTP, signalsMapping, slArgs, tpArgs, indicatorsOptions} = options;
    signalsMapping && (signals = signalsMapping(signals))

    /*get MA arrays; volatility arrays;
    * important to get in advance here, instead of calculating for each trade*/
    let MA: HashTable = {};
    let Volatility: HashTable = {};
    indicatorsOptions.ranges.forEach(l => {
        MA[l] = getMAByPrice(data, l);
        Volatility[l] = getMAByCCChange(data, l);
    })

    /* construct options for perform trade*/
    let tradeOptions: BotEngineOptions = {...options, indicatorsOptions: {...options.indicatorsOptions, MATable: MA, VolatilityTable: Volatility}}

    signals.forEach(t => {
        let tradeRes: TradeResult = performTrade(t, data, tradeOptions)
    })
    return null

}

let data = fetchData('QQQ', '1D')
runBotEngine(data, {signals: fetchDataset('fullMoonDates'), indicatorsOptions: {ranges: [10, 17, 25, 50]}})