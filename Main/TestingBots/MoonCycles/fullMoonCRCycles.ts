import {fetchData, fetchDataset} from "../../../Fetch/fetch";
import {Candle, Timestamp} from "../../../Interfaces/Candle";
import {getCumulativeReturnsMap} from "../../Libs/ChangeAnalisys/CumulativeReturns/cumulativeReturns";
import {SetupResult, TradeDirection, TradeResult} from "../../../Interfaces/Trades";
import {compareTimestampsByDayPlus} from "../../../Libs/Date/dateLib";
import {getChange} from "../../../Libs/Tools/myMath";
import * as fs from "fs";
import {mean, std} from "mathjs";


const fullMoonDates: Timestamp[] = fetchDataset('fullMoonDates');
const data = fetchData('QQQ', '1D');

const performTrade = function (signal: Timestamp, data: Candle[]) {
    let time = signal;
    if (new Date(signal).getDay() === 0) time = signal + 1000 * 60 * 60 * 24
    if (new Date(signal).getDay() === 6) time = signal + 1000 * 60 * 60 * 24 * 2
    let followUpReturns = getCumulativeReturnsMap(data, signal, 10);
    if (!followUpReturns || followUpReturns.length < 8) {
        console.log('followupreturns not long enough: ')
        return null
    }
    let i = data.findIndex((e) => {
        return compareTimestampsByDayPlus(e[0] * 1000, time)
    })
    if (i === -1) return null
    const direction: TradeDirection = followUpReturns[5][1] > 0 ? -1 : 1;
    let [t, o, h, l, c] = [...data[i + 4]]
    let [t2, o2, h2, l2, c2] = [...data[i + 6]];
    let highVariance = direction > 0 ? getChange(c, Math.max(data[i + 5][2], h2)) : getChange(c, Math.min(data[i + 5][3], l2)) * -1;
    let lowVariance = direction > 0 ? getChange(c, Math.min(data[i + 5][3], l2)) : getChange(c, Math.max(data[i + 5][2], h2)) * -1;
    let ret = getChange(c, c2) * direction;
    let sl: number = 0;
    (lowVariance < -1) && (sl = -0.4)
    // console.log('sl: ', sl)
    let result: TradeResult = {
        return: sl < 0 ? sl : ret,
        highVariance: highVariance,
        lowVariance: lowVariance,
        duration: 3,
        open: t * 1000,
        close: t2 * 1000
    }
    // console.log('result: ', result)
    return result
    // console.log('signal date: ', new Date(signal))
    // console.log('open date: ', new Date(result.open))

}

performTrade(fullMoonDates[fullMoonDates.length - 2], data);

const testSetup = function (): SetupResult {
    let won: number = 0;
    let lost: number = 0;
    let trades: TradeResult[] = [];
    let sum = 1;
    fullMoonDates.slice(fullMoonDates.length - 100, fullMoonDates.length).forEach((timestamp) => {
        let trade = performTrade(timestamp, data)
        if (trade) {
            trade.return > 0 ? won++ : lost++;
            sum = sum + trade.return / 100 * sum
            trades.push(trade);
        }
    })
    let returns = trades.map(t => {
        return t.return
    });
    return {

        trades: trades,
        stdDev: std(...returns),
        mean: mean(returns),
        return: (sum - 1),
        won: won,
        lost: lost,
        winrate: won / (won + lost)
    }
}
console.log(testSetup())
