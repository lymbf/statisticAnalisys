import {DATA_BASE_PATH, DATASETS_PATH} from "./Constants/paths";
import {Candle, RawData} from "./Interfaces/Candle";
import {fetchData} from "./Fetch/fetch";
import {
    CandleIndexArray,
    checkFollowUpRangeChange,
    findCandlesByChange, getFollowUpRangeMap
} from "./Main/Libs/ChangeAnalisys/changeFollowup";
import {getOCChange} from "./Libs/Tools/candleOps";




