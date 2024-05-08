import {Candle, RawData} from "../../../Interfaces/Candle";
import {CandleIndexArray, findCandlesByChange} from "../ChangeAnalisys/changeFollowup";
import {FollowupRange, RangeDown, RangeUp} from "../../../Interfaces/FollowUpRange";
import {getChange, getClose, getHigh, getLow} from "../../../Libs/Tools/candleOps";
import {fetchData} from "../../../Fetch/fetch";
import * as fs from "fs";
import * as path from "path";

function getFollowupMoveRange(data: Candle[], candle: CandleIndexArray): FollowupRange {
    let current = candle[0];
    let following = data[candle[1] + 1];
    let rangeDown: RangeDown = getChange(getClose(current), getLow(following))
    let rangeUp: RangeUp = getChange(getClose(current), getHigh(following))
    return [candle[0][0], rangeDown, rangeUp]
}

function getFollowupMoveRangeMap(data: Candle[], signals: CandleIndexArray[]): FollowupRange[] {
    let res: FollowupRange[] = [];
    signals.forEach((el) => {
        res.push(getFollowupMoveRange(data, el))
    })
    fs.writeFileSync(path.join(__dirname, 'Temp', 'rangeDown.json'), JSON.stringify(res.map(el => {
        return el[1];
    })))
    fs.writeFileSync(path.join(__dirname, 'Temp', 'rangeUp.json'), JSON.stringify(res.map(el => {
        return el[2];
    })))
    fs.writeFileSync(path.join(__dirname, 'Temp', 'dates.json'), JSON.stringify(res.map(el => {
        return el[0];
    })))
    return res
}

let data: RawData = fetchData('QQQ', '1D');
let signals: CandleIndexArray[] = findCandlesByChange(data, -0.75, 'LESSER')
let res = getFollowupMoveRangeMap(data, signals);
console.log(res.slice(res.length - 5, res.length));
console.log(new Date(res[res.length - 1][0] * 1000).toLocaleDateString())
