/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import { SchoolDay } from "@whsha/classes/v1/calendar/types";
import dayjs from "dayjs";
import ICal from "ical.js";
import { ICalendarInformation, ICalendarSchoolDay } from "./types";

/** The regex used to match school days */
const schoolDayRegex = /^(HALF )?DAY ([1-7])(?: - )?(.*)$/i;

/** The values in the array of the school day match */
enum SchoolDayRegexMatch {
    /** All of the summary matched against */
    All,
    /** If the school day is a half day */
    IsHalf,
    /** The shchool day */
    SchoolDay,
    /** Any metadata about the school day */
    Meta
}

/** Parse an ICal */
export default function parseCalendar(rawical: string): ICalendarInformation {
    // Parse the ICal into a JCal
    const cal = ICal.parse(rawical);
    // Get the top level component
    const calendarComponent = new ICal.Component(cal);
    // The array of school days
    const schoolDays: ICalendarSchoolDay[] = [];
    // Loop through all events in a given calendar
    for (const event of calendarComponent.getAllSubcomponents("vevent")) {
        /** The start date of the event */
        const date = event.getFirstPropertyValue<ICal.Time>("dtstart");
        /** The summary of the event (title) */
        const summary = event.getFirstPropertyValue("summary");
        // The event needs a summary and start date in order to be processed
        if (date === null || summary === null) {
            // Skip the event if it cannot be processed
            console.error("No 'date' or 'summary'");
            continue;
        }
        // Check the summary against the school day regex
        /** The match of the events summary */
        const match = schoolDayRegex.exec(summary);
        // Check if the sumamry was a match
        if (match !== null) {
            // If the summary matched, Add the school day to the array of school days
            schoolDays.push({
                // The date that the school day is on, parsed from the event date
                date: dayjs(date.toJSDate()).format("YYYY-MM-DD"),
                // The day number from the regex match, parsed as an intager
                dayNumber: parseInt(match[SchoolDayRegexMatch.SchoolDay], 10) as SchoolDay,
                // If the day is a half day
                isHalf: (match[SchoolDayRegexMatch.IsHalf] as string | undefined) !== undefined,
                // Any metadata about the school day
                meta: match[SchoolDayRegexMatch.Meta]
            });
        }
    }

    // Return the information about the calendar
    return {
        schoolDays,
        updated: Date.now()
    };
}
