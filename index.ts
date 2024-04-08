import {DATA_BASE_PATH, DATASETS_PATH} from "./Constants/paths";
import {Candle, RawData} from "./Interfaces/Candle";
import {fetchData} from "./Fetch/fetch";

console.log(DATASETS_PATH)

let data: RawData = fetchData('QQQ', '1D')
console.log(data)

