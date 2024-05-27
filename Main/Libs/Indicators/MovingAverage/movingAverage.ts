//calculates by closing prices
import {Candle, RawData, Timestamp} from "../../../../Interfaces/Candle";
import {getCCChange, getChange, getClose, getOCChange} from "../../../../Libs/Tools/candleOps";
import {mean, std} from "mathjs";
import {MA, MADeviations, MAOptions} from "../../../../Interfaces/MA";
import {fetchData} from "../../../../Fetch/fetch";
import math = require("mathjs");
import {Index} from "../../../../Interfaces/Other";

function getMAByPrice(arr: Candle[], distance: number): MA {
    let res: MA = [];
    for (let i: number = distance - 1; i < arr.length; i++) {
        let temp: number[] = arr.slice(i - distance + 1, i).map((c) => {
            return getClose(c);
        })
        res.push([arr[i][0], mean(temp)])
    }
    return res
}

function getMAByOCChange(arr: Candle[], distance: number): MA {
    let res: MA = [];
    for (let i: number = distance - 1; i < arr.length; i++) {
        let temp: number[] = arr.slice(i - distance + 1, i).map((c) => {
            return getOCChange(c)
        })
        res.push([arr[i][0], mean(temp)])
    }
    return res;
}

function getMAByCCChange(arr: Candle[], distance: number): MA {
    let res: MA = [];
    for (let i: number = distance + 1; i < arr.length; i++) {
        let temp: number[] = arr.slice(i - distance - 1, i).map((c, j, t) => {
            return getCCChange(c, t[j + 1])
        })
        res.push([arr[i][0], mean(temp)])
    }
    return res;
}

function getMADeviations(MA: MA, candle: Candle): MADeviations {
    let [t, o, h, l, c] = [...candle];
    const filteredMA: number = MA.filter((el) => {
        if (el[0] === t) console.log('MA value: ', el[1])
        return el[0] === t
    })[0][1]
    let closeDeviation: number = -1 * getChange(c, filteredMA)
    let openDeviation: number = -1 * getChange(o, filteredMA)
    let highDeviation: number = -1 * getChange(h, filteredMA);
    let lowDeviation: number = -1 * getChange(l, filteredMA);
    // console.log('timestamp: ', new Date(t * 1000).toLocaleString());
    // console.log('close: ', c)
    return {closeDeviation, highDeviation, lowDeviation, openDeviation}
}

function getMAOptions(index: Index, data: Candle[], options?: { type?: 'CC' | 'OC' }): MAOptions {
    let opts: MAOptions;
    let temp = [10, 15, 17, 20, 30, 50, 100, 200]
    let timestamp: Timestamp = data[index][0];

    if (options.type && options.type === 'CC') {
        temp.forEach(dist => {
            let ma: MA = getMAByCCChange(data, dist).filter((e) => {
                e[0] === timestamp
            })
            opts[dist] = ma.length ? ma[0] : null
        })
    } else {
        temp.forEach(dist => {
            let ma: MA = getMAByOCChange(data, dist).filter((e) => {
                e[0] === timestamp
            })
            opts[dist] = ma.length ? ma[0] : null
        })
    }

    return opts;
}

export {getMAOptions, getMAByOCChange, getMAByCCChange, getMAByPrice, getMADeviations}

let data: RawData = fetchData('QQQ', '1D');
data = data.slice(data.length - 250, data.length)
let MA = getMAByPrice(data, 50);


// console.log('MA deviations: ', getMADeviations(MA, data[21]));
let res = []
for (let i: number = 51; i < data.length; i++) {
    res.push(math.abs(getMADeviations(MA, data[i]).closeDeviation))
}

console.log('average deviation: ', mean([...res]));
console.log('std dev: ', std([...res]))