import {fetchDataset} from "../../../Fetch/fetch";
import {Candle, Timestamp} from "../../../Interfaces/Candle";


const fullMoonDates: Timestamp[] = fetchDataset('fullMoonDates');

const performTrade = function (signal: Timestamp, data: Candle[]) {

}

fullMoonDates.forEach((timestamp) => {

})