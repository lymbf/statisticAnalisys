import {days, months} from "../../Constants/basicConstants";

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

export {getTime, getFirstDayOfTheMonth, getLastDayOfTheMonth, getDateOfNthDayOfTheMonth, getLastDateOfTheMonth}