/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import { IDR, IMajor, IMinor } from "@whsha/classes/v1/class/classes";
import { IColored } from "@whsha/classes/v1/class/primitives";
import { isMajor, isMinor } from "@whsha/classes/v1/class/type";
import React, { memo } from "react";
import ClassComponent from "./ClassComponent";
import FreeComponent from "./FreeComponent";
import { ICoronaTimes } from "./parts/TitleTimes";

/** The parameters to pass to a BlockComponent */
interface IDisplayBlock extends IColored {
    /** The class to display */
    clazz?: IMajor | IMinor | IDR;
}

/** A component that will display a block of many variety */
function BlockComponent({ morning, afternoon, clazz, block }: ICoronaTimes & IDisplayBlock) {
    if (clazz === undefined) {
        return <FreeComponent morning={morning} afternoon={afternoon} block={block}/>;
    } else {
        if (isMajor(clazz) || isMinor(clazz)) {
            return (
                <ClassComponent
                    name={clazz.name}
                    block={clazz.block}
                    room={clazz.room}
                    teacher={clazz.teacher}
                    morning={morning}
                    afternoon={afternoon}
                />
            );
        } else {
            return (
                <ClassComponent
                    name="Directed research"
                    block={clazz.block}
                    room={clazz.room}
                    teacher={clazz.teacher}
                    morning={morning}
                    afternoon={afternoon}
                />
            );
        }
    }
}

export default memo(BlockComponent);