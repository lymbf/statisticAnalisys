import {days, months} from "../../Constants/basicConstants";
import {Timestamp} from "../../Interfaces/Candle";

function getLastDateOfTheMonth(timestamp: number): number {
    let m: number = new Date(timestamp).getMonth();
    let y: number = new Date(timestamp).getFullYear();
    return new Date(y, m + 1, 0).getDate();
}

function getLastDayOfTheMonth(timestamp: number, name: boolean): string | number {
    let date: Date = new Date(timestamp);
    let y: number = date.getFullYear();
    let m: number = date.getMonth();
    let lastDate: number = getLastDateOfTheMonth(timestamp);
    let d: number = new Date(y, m, lastDate).getDay();
    if (name) return days[d]
    else return d;
}

function getFirstDayOfTheMonth(timestamp: number, name: boolean) {
    let date = new Date(timestamp);
    let y: number = date.getFullYear();
    let m: number = date.getMonth();
    if (!name) return new Date(y, m, 1).getDay();
    else return days[new Date(y, m, 1).getDay()];
}

function getDateOfNthDayOfTheMonth(n: number, day: string, month: string, year: number): number | boolean {
    if (n > 5) return false;
    let d: number = days.indexOf(day);
    let m: number = months.indexOf(month);
    let date: boolean | number = false;
    let temp: number = 1;
    for (let i: number = 1; i < 32; i++) {
        let dd: Date = new Date(year, m, i, 15, 30);
        if (dd.getDay() === d) {
            if (temp === n) {
                date = dd.getDate();
                break;
            } else {
                temp++
            }
        }
    }
    if (!date) return false;
    else return date;
}

function getTime(year: number, month: number, day: number, hour: number, minutes: number): number {
    let date: Date = new Date(year, month, day, hour, minutes)
    return date.getTime();
}

function compareTimestampsByDayPlus(t1: Timestamp, t2: Timestamp): boolean {
    let x = 1000 * 60 * 60 * 24;
    return (t1 - t1 % x) === (t2 - t2 % x)
}

function getMapOfGMTDates(start: Timestamp): Timestamp[] {
    let res: Timestamp[] = [];
    let date = new Date(start);
    let temp = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    while (temp < new Date().getTime()) {
        res.push(temp);
        temp += 1000 * 60 * 60 * 24
    }
    return res;
}

function getClosestTradingDay(timestamp: Timestamp): Timestamp {
    let time: Timestamp = timestamp;
    if (new Date(timestamp).getDay() === 0) time = timestamp + 1000 * 60 * 60 * 24
    if (new Date(timestamp).getDay() === 6) time = timestamp + 1000 * 60 * 60 * 24 * 2
    return time - time % 1000 * 60 * 60 * 24
}

export {
    getTime,
    getFirstDayOfTheMonth,
    getLastDayOfTheMonth,
    getDateOfNthDayOfTheMonth,
    getLastDateOfTheMonth,
    compareTimestampsByDayPlus,
    getMapOfGMTDates,
    getClosestTradingDay
}