/*!
 * Copyright (C) 2018-2019  Zachary Kohnen (DusterTheFirst)
 */

import React, { memo } from "react";
import { Image, Text, View } from "react-native";
import Splash from "../../assets/splash.png";
import { ApplicationState } from "../App";
import { loadingViewStyle } from "../layout/default";

function LoadingView({ task }: { task: ApplicationState }) {
    return (
        <View>
            <Image source={Splash} style={loadingViewStyle.image} resizeMode={"contain"} />
            <View style={loadingViewStyle.overlay}>
                <Text style={loadingViewStyle.taskText}>{task}...</Text>
            </View>
        </View>
    );
}

export default memo(LoadingView);