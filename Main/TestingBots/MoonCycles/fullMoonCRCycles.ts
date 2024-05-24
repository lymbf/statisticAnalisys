import {fetchData, fetchDataset} from "../../../Fetch/fetch";
import {Candle, Timestamp} from "../../../Interfaces/Candle";
import {getCumulativeReturnsMap} from "../../Libs/ChangeAnalisys/CumulativeReturns/cumulativeReturns";
import {TradeDirection, TradeResult} from "../../../Interfaces/Trades";
import {compareTimestampsByDayPlus} from "../../../Libs/Date/dateLib";
import {getChange} from "../../../Libs/Tools/myMath";
import * as fs from "fs";


const fullMoonDates: Timestamp[] = fetchDataset('fullMoonDates');
const data = fetchData('QQQ', '1D');

const performTrade = function (signal: Timestamp, data: Candle[]) {
    let followUpReturns = getCumulativeReturnsMap(data, signal, 10);
    const direction: TradeDirection = followUpReturns[5][1] > 0 ? -1 : 1;
    console.log('direction: ', direction);
    console.log('followup return day 5: ', followUpReturns[5][1])
    console.log('signal date: ', new Date(signal))
    let i = data.findIndex((e) => {
        return compareTimestampsByDayPlus(e[0] * 1000, signal)
    })
    let [t, o, h, l, c] = [...data[i + 4]]
    let [t2, o2, h2, l2, c2] = [...data[i + 6]]
    let result: TradeResult = {
        return: getChange(c, c2) * direction,
        highVariance: direction > 0 ? getChange(c, Math.max(data[i + 5][2], h2)) : getChange(c, Math.min(data[i + 5][3], l2)) * -1,
        lowVariance: direction > 0 ? getChange(c, Math.min(data[i + 5][3], l2)) : getChange(c, Math.max(data[i + 5][2], h2)) * -1,
        duration: 3,
        open: t * 1000,
        close: t2 * 1000
    }
    console.log('open date: ', new Date(result.open))
    console.log('result: ', result)
}

performTrade(fullMoonDates[fullMoonDates.length - 2], data);

fullMoonDates.forEach((timestamp) => {

})