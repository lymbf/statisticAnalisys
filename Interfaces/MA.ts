import {Change, Price, Time} from "./Volatility";

type MA = [Time, Price | Change][];

interface MADeviations {
    closeDeviation: number,
    openDeviation: number,
    highDeviation: number,
    lowDeviation: number
}

interface MAHashTable {
    [key: string]: MA
}

interface VolatilityHashTable {
    [key: string]: MA
}

export {MA, MADeviations, MAHashTable, VolatilityHashTable}