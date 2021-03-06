/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import { SchoolDay } from "@whsha/classes/v1/calendar/types";
import { readFileSync } from "fs";
import { resolve } from "path";
import parseCalendar from "./parse";

/** The mock calendar data */
const calendarData = readFileSync(resolve(__dirname, "../../__mocks__/calendar.ics")).toString();

describe("Tests parser with mock data", () => {
    const calendar = parseCalendar(calendarData);

    it("Parses schooldays and matches the snapshot", () => {
        expect(calendar.schoolDays).toMatchSnapshot();
    });

    it("All school days have valid SchoolDay enum values", () => {
        // tslint:disable-next-line: strict-type-predicates
        expect(calendar.schoolDays.every(x => SchoolDay[x.dayNumber] !== undefined)).toBeTruthy();
    });

    it("Sets updated to a date", () => {
        expect(calendar.updated).toBeTruthy();
    });
});