/*!
 * Copyright (C) 2018-2019  Zachary Kohnen (DusterTheFirst)
 */

import dayjs from "dayjs";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ICalendarEvent } from "../util/calendarUtil";

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFEEFF",
        flex: 1,
        marginVertical: 20,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    times: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center"
    },
    title: {
        flex: 1,
        fontSize: 20,
        fontWeight: "bold"
    },
    titleView: {
        flex: 1,
        flexDirection: "row"
    }
});

interface ITodayEventProps {
    event: ICalendarEvent;
}
export default function TodayEvent({event}: ITodayEventProps) {
    return (
        <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.title}>{event.name}</Text>
                <Text style={styles.times}>{event.isAllDay ? "All Day" : `${dayjs(event.start).format("hh:mm A")} - ${dayjs(event.end).format("hh:mm A")}`}</Text>
            </View>
            <Text>{event.description}</Text>
            <Text>{event.location}</Text>
        </View>
    );
}