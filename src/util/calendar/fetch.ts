/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import { Result } from "@badrap/result";

/** The calender with only school days on it */
const DAYONLYCALENDAR = "https://calendar.google.com/calendar/ical/wellesleyps.org_qvqdo2dkb151vorl1f0dkigin0%40group.calendar.google.com/public/basic.ics";
// const ALLCALENDAR = " http://goo.gl/FR0zjg";

/** Simply fetch the calendar from the url */
export default async function fetchCalendar(): Promise<Result<string>> {
    // Get the calendar
    const response = await fetch(DAYONLYCALENDAR);

    if (!response.ok) {
        return Result.err(new Error(`${response.status}: ${response.statusText}`));
    }

    // Get the full text body
    return Result.ok(await response.text());
}
