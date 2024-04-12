//calculates by closing prices
import {Candle} from "../../../../Interfaces/Candle";
import {getCCChange, getClose, getOCChange} from "../../../../Libs/Tools/candleOps";
import {mean} from "mathjs";
import {MA} from "../../../../Interfaces/MA";

function getMAByPrice(arr: Candle[], distance: number): MA {
    let res: MA = [];
    for (let i: number = distance - 1; i < arr.length; i++) {
        let temp: number[] = arr.slice(i - distance + 1, i).map((c) => {
            return getClose(c);
        })
        res.push([arr[i][0], mean(temp)])
    }
    return res
}

function getMAByOCChange(arr: Candle[], distance: number): MA {
    let res: MA = [];
    for (let i: number = distance - 1; i < arr.length; i++) {
        let temp: number[] = arr.slice(i - distance + 1, i).map((c) => {
            return getOCChange(c)
        })
        res.push([arr[i][0], mean(temp)])
    }
    return res;
}

function getMAByCCChange(arr: Candle[], distance: number): MA {
    let res: MA = [];
    for (let i: number = distance + 1; i < arr.length; i++) {
        let temp: number[] = arr.slice(i - distance - 1, i).map((c, j, t) => {
            return getCCChange(c, t[j + 1])
        })
        res.push([arr[i][0], mean(temp)])
    }
    return res;
}