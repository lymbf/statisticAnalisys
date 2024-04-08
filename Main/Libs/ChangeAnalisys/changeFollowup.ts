import {Candle} from "../../../Interfaces/Candle";
import {getOCChange, rangeToOHLC} from "../../../Libs/Tools/candleOps";

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

export {CandleIndexArray, findCandlesByChange, checkFollowUpRangeChange}