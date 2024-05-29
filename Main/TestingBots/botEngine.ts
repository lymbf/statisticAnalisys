import {SetupResult, TradeResult} from "../../Interfaces/Trades";
import {Candle, Timestamp} from "../../Interfaces/Candle";
import {compareTimestampsByDayPlus, getClosestTradingDay} from "../../Libs/Date/dateLib";
import {fetchData, fetchDataset} from "../../Fetch/fetch";
import {MA} from "../../Interfaces/MA";
import {HashTable} from "../../Interfaces/DataTypes";
import {getMAByCCChange, getMAByPrice} from "../Libs/Indicators/MovingAverage/movingAverage";
import {max, mean, std} from "mathjs";
import {Index} from "../../Interfaces/Other";
import {getChange} from "../../Libs/Tools/myMath";

interface BotEngineOptions {
    signals: Timestamp[],

    signalsMapping?(signals: Timestamp[]): Timestamp[]

    throwSL(signalIndex: Index, currentIndex: Index, data: Candle[]): number,

    throwTP(signalIndex: Index, currentIndex: Index, data: Candle[]): number,

    calcHighVariance(current: number, candle: Candle): number,

    calcLowVariance(current: number, candle: Candle): number,

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
    if (index < 0) return null

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
        let SL = options.throwSL(index, i, data)
        let TP = options.throwTP(index, i, data)

        /* <---------to be implemented--->
        * if both SL and TP -> findWhichOccurredFirst */
        if (TP && SL) console.log("sl: ", SL, 'tp: ', TP);

        /* if ret has value ( sl or tp got hit ) return "TradeResult" */
        let ret: number = null;
        if (SL) ret = SL;
        if (TP) ret = TP;
        if (ret) {
            close = data[i][0] * 1000;
            return {
                return: ret,
                highVariance,
                lowVariance,
                duration,
                open,
                close,
                /* <----------  to be implemented ------->*/
                /* indicators for signal occurance for TradeResult*/
                indicatorsUponSignal: {},
                dateString: new Date(signal).toUTCString()
            }
        }
    }
    return null
}

const runBotEngine = function (data: Candle[], options: BotEngineOptions): SetupResult {
    /* adjust signals in case extra mapping needed ( optional )*/
    let {signals, throwSL, throwTP, signalsMapping, indicatorsOptions} = options;
    signalsMapping && (signals = signalsMapping(signals))

    /*get MA arrays; volatility arrays;
    * important to get in advance here, instead of calculating for each trade*/
    let MA: HashTable = {};
    let Volatility: HashTable = {};
    indicatorsOptions.ranges.forEach(l => {
        MA[l] = getMAByPrice(data, l);
        Volatility[l] = getMAByCCChange(data, l);
    })

    /* setup result vars and calc functions (getters) init */
    /*-------------------------- */
    let won: number = 0;
    let lost: number = 0;
    let trades: TradeResult[] = [];
    const getReturn = (trades: TradeResult[]): number => {
        let temp = trades.map(t => {
            return t.return
        });
        let s = 0
        for (let i = 0; i < temp.length; i++) {
            s += temp[i];
        }
        return s;
    }
    const getCompoundReturn = (returns: TradeResult[]): number => {
        let temp = trades.map(t => {
            return t.return
        });
        let s = 1;
        for (let i = 0; i < temp.length; i++) {
            s = s + parseFloat((s * temp[i]).toFixed(6))
        }
        return s - 1
    }
    let getWinrate = (won: number, lost: number): number => {
        return won / (won + lost)
    }
    let getMean = (trades: TradeResult[]): number => {
        let temp = trades.map(t => {
            return t.return
        });
        return mean(...temp)
    }
    let getStdDev = (returns: TradeResult[]): number => {
        let temp = trades.map(t => {
            return t.return
        });
        return std(...temp)
    }
    /* ------------------------ */

    /* construct options for perform trade*/
    let tradeOptions: BotEngineOptions = {
        ...options,
        indicatorsOptions: {...options.indicatorsOptions, MATable: MA, VolatilityTable: Volatility}
    }
    /* loop through signals -> push trade res to trades array, increment won and lost vars */
    signals.forEach(t => {
        let trade: TradeResult = performTrade(t, data, tradeOptions)
        if (trade) {
            trades.push(trade);
            trade.return > 0 ? won++ : lost++;
        }
    })

    /* if trades array is not empty, return "SetupResult" */
    if (!trades.length) return null;
    return {
        trades,
        won,
        lost,
        winrate: getWinrate(won, lost),
        return: getReturn(trades),
        compoundReturn: getCompoundReturn(trades),
        mean: getMean(trades)
    }

}

let data = fetchData('QQQ', '1D')
let res = runBotEngine(data, {
    signals: fetchDataset('fullMoonDates'),
    signalsMapping(signals: Timestamp[]): Timestamp[] {
        return signals.map(e => {
            return getClosestTradingDay(e);
        })
    },
    indicatorsOptions: {ranges: [10, 17, 25, 50]},
    throwTP(i: number, j: number, data: Candle[]): number {
        if (i + 6 > data.length - 1) return null
        let direction = getChange(data[i][4], data[i + 4][4]) >= 0 ? -1 : 1;
        if (j === i + 6) {
            if (direction > 0) {
                return getChange(data[i + 4][4], data[j][4])
            } else {
                return getChange(data[i + 4][4], data[j][4]) * -1
            }
        } else return null
    },
    throwSL(i: number, j: number, data: Candle[]): number {
        if (i + 6 > data.length - 1) return null
        if (getChange(data[i + 4][4], data[j][4]) < -0.25) {
            return -0.4
        } else {
            return null
        }
    },
    calcLowVariance(current: number, candle: Candle): number {
        return -2
    },
    calcHighVariance(current: number, candle: Candle): number {
        return 3
    }
})

console.log('setup result: ', res)