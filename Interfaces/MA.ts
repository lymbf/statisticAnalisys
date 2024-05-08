import {Change, Price, Time} from "./Volatility";

type MA = [Time, Price | Change][];

interface MADeviations {
    closeDeviation: number,
    openDeviation: number,
    highDeviation: number,
    lowDeviation: number
}

export {MA, MADeviations}