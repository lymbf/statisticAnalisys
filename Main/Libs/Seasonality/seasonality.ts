import {Change} from "../../../Interfaces/Volatility";
import {Candle} from "../../../Interfaces/Candle";
import {getOCChange} from "../../../Libs/Tools/candleOps";
import {fetchData} from "../../../Fetch/fetch";
import {mean, median} from "mathjs";
import {months} from "../../../Constants/months";
import {BasicStatistics} from "../../../Interfaces/Stats";

interface SeasonalityStats {
    rawData: Candle[],
    data: BasicStatistics[]
}

const getMonthlySeasonalityChange = (data: Candle[], options?: {
    dailyData?: boolean,
    presentable?: boolean,
    median?: boolean
}): Change[] => {
    let arr = new Array(12).fill(null).map(() => Array());
    let candles = data;
    if (options && options.dailyData) {
        /* handle mapping daily candles into monthly candles */
    }
    candles.forEach(c => {
        let m = new Date(c[0] * 1000).getMonth();
        arr[m].push(getOCChange(c));

    })

    return arr.map(e => {
        if (!options) return mean(e)
        if (options.presentable) {
            return (options.median ? median(e) * 100 : mean(e) * 100)
        }
        return (options.median ? median(e) : mean(e))
    })
}

let data = fetchData('KGHM', '1M')
let res1 = getMonthlySeasonalityChange(data, {presentable: true, median: true});
console.log('median seasonality:')
console.log('-------------')
res1.forEach((m, i) => {
    console.log(`${months[i]}: ${m.toFixed(3)}%`)
})
console.log('-------------')
console.log(' mean seasonality: ')
console.log('-------------')
let res2 = getMonthlySeasonalityChange(data, {presentable: true, median: false});
res2.forEach((m, i) => {
    console.log(`${months[i]}: ${m.toFixed(3)}%`)
})