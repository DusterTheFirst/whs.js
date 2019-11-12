/*!
 * Copyright (C) 2018-2019  Zachary Kohnen (DusterTheFirst)
 */

import React, { memo } from "react";
import { Text, View } from "react-native";
import { classComponentStyles } from "../../layout/default";
import { IAdvisory } from "../../util/class/advisory";
import { ITimes } from "../../util/class/extentions";

/** A component to display the advisory */
function AdvisoryComponent({teacher, room, end, start}: IAdvisory & ITimes) {
    return (
        <View style={classComponentStyles.container}>
            <View style={classComponentStyles.dualView}>
                <Text style={classComponentStyles.title}>Advisory</Text>
                <Text style={classComponentStyles.dim}>{start.format("h:mm")} - {end.format("h:mm A")}</Text>
            </View>
            <View style={[classComponentStyles.dualView, classComponentStyles.info]}>
                <Text style={[classComponentStyles.dim, classComponentStyles.teacher]} numberOfLines={1}>{teacher}</Text>
                <Text style={[classComponentStyles.dim, classComponentStyles.room]} numberOfLines={1}>Room {room}</Text>
            </View>
        </View>
    );
}

export default memo(AdvisoryComponent);