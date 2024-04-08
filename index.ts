import {DATA_BASE_PATH, DATASETS_PATH} from "./Constants/paths";
import {Candle, RawData} from "./Interfaces/Candle";
import {fetchData} from "./Fetch/fetch";
import {
    CandleIndexArray,
    checkFollowUpRangeChange,
    findCandlesByChange
} from "./Main/Libs/ChangeAnalisys/changeFollowup";
import {getOCChange} from "./Libs/Tools/candleOps";

console.log(DATASETS_PATH)

let data: RawData = fetchData('QQQ', '1D')

let res: CandleIndexArray[] = findCandlesByChange(data, 2, 'GREATER');
res = res.slice(res.length - 5, res.length)
console.log(new Date(res[0][0][0] * 1000).toLocaleString())
console.log(res.map(el => {
    return getOCChange(el[0])
}))

console.log(checkFollowUpRangeChange(data, res[0], 5))