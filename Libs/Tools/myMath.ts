import {Candle, CandleToNumberMapper} from "../../Interfaces/Candle";

function getChange(open: number, close: number): number {
    return parseFloat((((close - open) / open) * 100).toFixed(6))
}


function getAverage(arr: number[]) {
    return parseFloat((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(6))
}

function getAverageWMapper(arr: Candle[], f: CandleToNumberMapper) {
    let data: number[];
    data = arr.map(el => {
        return f(el)
    })
    return parseFloat((data.reduce((a, b) => a + b, 0) / arr.length).toFixed(6))
}

console.log(getChange(12, 18))
export {getChange, getAverage, getAverageWMapper}