import {fetchDataset} from "../../../Fetch/fetch";
import {Candle, Timestamp} from "../../../Interfaces/Candle";
import {getCumulativeReturnsMap} from "../../Libs/ChangeAnalisys/CumulativeReturns/cumulativeReturns";
import {TradeDirection} from "../../../Interfaces/Trades";


const fullMoonDates: Timestamp[] = fetchDataset('fullMoonDates');

const performTrade = function (signal: Timestamp, data: Candle[]) {

}

fullMoonDates.forEach((timestamp) => {

})