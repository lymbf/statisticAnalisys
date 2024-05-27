import {Candle, Timestamp} from "../../../Interfaces/Candle";
import {HashTable} from "../../../Interfaces/DataTypes";
import {getMAOptions} from "./MovingAverage/movingAverage";
import {Index} from "../../../Interfaces/Other";
import {compareTimestampsByDayPlus} from "../../../Libs/Date/dateLib";

function getIndicatorsForTimestamp(timestamp: Timestamp, data: Candle[]): HashTable {
    let i: Index = data.findIndex((e) => {
        return e[0] * 1000 === timestamp
    })
    i === -1 && (i = data.findIndex(e => {
        return compareTimestampsByDayPlus(timestamp, e[0] * 1000)
    }))

    let t: Timestamp
    if (i < 0) return null
    else t = data[i][0] * 1000
    return {
        MADeviation: getMAOptions(t, data, {type: 'P'}),
        AverageVolatility: getMAOptions(t, data, {type: 'CC'})
    }
}

export {getIndicatorsForTimestamp}