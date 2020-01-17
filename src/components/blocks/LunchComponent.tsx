/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import React, { memo } from "react";
import { ClassContainerView } from "../../styles/components/class";
import { ITimes } from "../../util/class/extentions";
import TitleTimes from "./parts/TitleTimes";

/** A component to display a lunch block */
function LunchComponent({ start, end }: ITimes) {
    return (
        <ClassContainerView>
            <TitleTimes start={start} end={end} name="Lunch" />
        </ClassContainerView>
    );
}

export default memo(LunchComponent);