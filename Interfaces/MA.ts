import {Change, Price, Time} from "./Volatility";

type MA = [Time, Price | Change][];

interface MADeviations {
    closeDeviation: number,
    openDeviation: number,
    highDeviation: number,
    lowDeviation: number
}


interface MAOptions {
    '10': number,
    '15': number,
    '17': number
    '20': number,
    '50': number,
    '100': number,
    '200': number,
}

export {MA, MADeviations, MAOptions}