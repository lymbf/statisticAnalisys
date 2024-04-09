import {Candle} from "../../../Interfaces/Candle";
import {getOCChange, rangeToOHLC} from "../../../Libs/Tools/candleOps";
import {FollowUpRangeMap} from "../../../Interfaces/FollowUpRange";
import * as fs from "fs";
import * as path from "path";

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
    return res;
}

function checkFollowUpRangeChange(data: Candle[], candle: CandleIndexArray, distance: number): number {
    let i: number = candle[1];
    let range = data.slice(i + 1, distance);
    return getOCChange(rangeToOHLC(data, [i, i + distance]))
}

function getFollowUpRangeMap(data: Candle[], distance: number, change: number, greater: string): FollowUpRangeMap {
    let candles: CandleIndexArray[] = findCandlesByChange(data, change, greater);
    let res: FollowUpRangeMap = [];
    candles.forEach(candle => {
        res.push(checkFollowUpRangeChange(data, candle, distance))
    })
    fs.writeFileSync(path.join(__dirname, 'Temp/changeFollowup.json'), JSON.stringify(res))
    return res;
}

export {CandleIndexArray, findCandlesByChange, checkFollowUpRangeChange, getFollowUpRangeMap}