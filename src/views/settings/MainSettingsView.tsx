/*!
 * Copyright (C) 2018-2019  Zachary Kohnen (DusterTheFirst)
 */

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Linking, ScrollView, StyleSheet, View } from "react-native";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import useRouter from "use-react-router";
import { SinglelineHeader } from "../../components/header/Header";
import IconComponent from "../../components/IconComponent";
import { CalendarContext, ReloadFunctionContext } from "../../contexts";

dayjs.extend(relativeTime);

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    redbutton: {
        color: "#FF5050"
    }
});

function ClearCalCacheCell() {
    const calendar = useContext(CalendarContext);
    let [fromNow, setFromNow] = useState(dayjs(calendar.updated).fromNow());
    const load = useContext(ReloadFunctionContext);

    useEffect(() => {
        let interval = setInterval(() => setFromNow(dayjs(calendar.updated).fromNow()), 1000);

        return () => clearInterval(interval);
    }, []);

    const clearCalendarCache = () => {
        load(true);
    };

    return (
        <Cell title="Clear Calendar Cache" detail={`Last update: ${fromNow}`} cellStyle="Subtitle" titleTextStyle={styles.redbutton} onPress={clearCalendarCache} />
    );
}

export default function MainView() {
    const { history, match, location } = useRouter();

    function navigateTo(to: string) {
        return () => {
            history.push(to);
        };
    }

    function openLink(link: string) {
        return () => {
            Alert.alert("Open link in browser?", undefined, [{
                onPress: () => {
                    Linking.openURL(link);
                },
                style: "default",
                text: "Open"
            },
            {
                style: "cancel",
                text: "Cancel"
            }]);
        };
    }

    return (
        <View style={styles.container}>
            <SinglelineHeader title="Settings" />
            <ScrollView>
                <TableView>
                    <Section header="Debugging Tools">
                        <Cell title="Current Match" cellStyle="RightDetail" detail={match.path} />
                        <Cell title="Current Match Exact" cellStyle="RightDetail" detail={match.isExact.toString()} />
                        <Cell title="Current Path" cellStyle="RightDetail" detail={location.pathname} />
                    </Section>
                    <Section header="Class Settings">
                        <Cell title="Configure Classes" accessory="DisclosureIndicator" onPress={navigateTo("/settings/classes")} />
                        <Cell title="Configure Lunches" accessory="DisclosureIndicator" onPress={navigateTo("/settings/lunches")} isDisabled={true} />
                        <Cell title="Configure Advisory" accessory="DisclosureIndicator" onPress={navigateTo("/settings/advisory")} />
                    </Section>
                    <Section header="Legal">
                        <Cell title="View License" cellAccessoryView={<IconComponent name="open" />} onPress={openLink("https://github.com/DusterTheFirst/whs.js/blob/master/LICENSE")} />
                        <Cell title="View 3rd Party Licenses" accessory="DisclosureIndicator" onPress={openLink("")} isDisabled={true} />
                    </Section>
                    <Section header="App Info">
                        <Cell title="Changelog" accessory="DisclosureIndicator" onPress={navigateTo("/settings/changelog")} isDisabled={true} />
                        <Cell title="Help" accessory="Detail" onPress={navigateTo("/settings/help")} isDisabled={true} />
                        <Cell title="Source Code" cellAccessoryView={<IconComponent name="open" />} onPress={openLink("https://github.com/DusterTheFirst/whs.js")} />
                    </Section>
                    <Section header="Cache" footer="If your schedule shows up incorrectly, clearing the caches may help.">
                        <ClearCalCacheCell />
                    </Section>
                </TableView>
            </ScrollView>
        </View>
    );
}