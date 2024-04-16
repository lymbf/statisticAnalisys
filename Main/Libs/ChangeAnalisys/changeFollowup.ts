import {Candle, RawData} from "../../../Interfaces/Candle";
import {getOCChange, rangeToOHLC} from "../../../Libs/Tools/candleOps";
import {RangeMap} from "../../../Interfaces/FollowUpRange";
import * as fs from "fs";
import * as path from "path";
import {fetchData} from "../../../Fetch/fetch";
import * as Mathjs from 'mathjs'

type CandleIndexArray = [Candle, number]


// greater: 'GREATER' || 'LESSER'
function findCandlesByChange(arr: Candle[], change: number, greater: string): CandleIndexArray[] {
    let res: CandleIndexArray[] = [];
    for (let i: number = 0; i < arr.length; i++) {
        switch (greater) {
            case 'LESSER':
                if (getOCChange(arr[i]) <= change) {
                    res.push([arr[i], i]);
                }
                break;
            case 'GREATER':
                if (getOCChange(arr[i]) >= change) {
                    res.push([arr[i], i]);
                }
                break;
            default:
                break;
        }
    }
    let br: number = 1000 * 60 * 60 * 24 * 5
    return res.filter((el, i, arr) => {
        if (i === 0) return true
        return !((el[0][0] * 1000 - br) < arr[i - 1][0][0] * 1000)
    })
}

function checkFollowUpRangeChange(data: Candle[], candle: CandleIndexArray, distance: number): number {
    let i: number = candle[1];
    return getOCChange(rangeToOHLC(data, [i + 1, i + distance]))
}

function checkPreviousRangeChange(data: Candle[], candle: CandleIndexArray, distance: number): number {
    let i: number = candle[1];
    return getOCChange(rangeToOHLC(data, [i - distance, i]))
}

function getFollowUpRangeMap(data: Candle[], distance: number, signalCandles: CandleIndexArray[], greater: string): RangeMap {
    let candles: CandleIndexArray[] = signalCandles
    let res: RangeMap = [];
    candles.forEach(candle => {
        res.push(checkFollowUpRangeChange(data, candle, distance))
    })
    fs.writeFileSync(path.join(__dirname, 'Temp/changeFollowup.json'), JSON.stringify(res))
    return res;
}

function getDatesMap(data: Candle[], change: number, greater: string): string[] {
    let r: string[] = findCandlesByChange(data, change, greater).map((el: CandleIndexArray) => {
        return new Date(el[0][0] * 1000).toLocaleDateString()
    });
    fs.writeFileSync(path.join(__dirname, 'Temp/dates.json'), JSON.stringify(r));
    return r;
}

// function getSignalDates()
let distance: number = 7;
let change: number = 1;
let greater: string = 'LESSER'

let data: RawData = fetchData('DAX', '1D');
// console.log(new Date(data[0][0] * 1000).toLocaleString())
// console.log(new Date(data[data.length - 1][0] * 1000).toLocaleString())
// let signalCandles: CandleIndexArray[] = findCandlesByChange(data, change, greater)
// let res: RangeMap = getFollowUpRangeMap(data, distance, signalCandles, greater);
// let dates: string[] = getDatesMap(data, change, greater)
// console.log('length: ', res.length)
// console.log('avg: ', Mathjs.mean(res))

for (let i: number = 1; i < 2; i++) {
    for (let j: number = -1.5; j > -2; j -= 0.25) {
        console.log('------>>>><<<<<<<-----')
        console.log('distance: ', i, 'signal change: ', j);
        let signalCandles: CandleIndexArray[] = findCandlesByChange(data, j, greater)
        let r = getFollowUpRangeMap(data, i, signalCandles, greater)
        r.length && console.log(Mathjs.mean(r))
        r.length && console.log('length: ', r.length, 'probability: ', r.map((el: number): number => {
            return el > 0 ? 1 : 0
        }).reduce((acc: number, curr: number) => {
            return acc + curr
        }, 0) / r.length
        )
        console.log('------>>>><<<<<<<-----')
    }
}
// console.log('res: ', res)
// console.log('dates: ', dates)

export {CandleIndexArray, findCandlesByChange, checkFollowUpRangeChange, getFollowUpRangeMap}