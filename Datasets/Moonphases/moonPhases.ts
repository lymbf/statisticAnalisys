import * as fs from "fs";
import * as path from "path";

const cycleLength = 1000 * 60 * 60 * 24 * 29.53059
const referenceFullMoon = new Date('2000-01-21 05:40:24 GMT').getTime();
let fullMoonDates: number[] = [];
let newMoonDates: number[] = [];

let tempDate = referenceFullMoon;
while (tempDate < new Date().getTime()) {
    fullMoonDates.push(tempDate);
    newMoonDates.push(tempDate + cycleLength / 2);
    tempDate += cycleLength;
}


fs.writeFileSync(path.join(__dirname, 'fullMoonDates.json'), JSON.stringify(fullMoonDates))
fs.writeFileSync(path.join(__dirname, 'newMoonDates.json'), JSON.stringify(newMoonDates))








