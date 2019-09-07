/*!
 * Copyright (C) 2018-2019  Zachary Kohnen (DusterTheFirst)
 */

import React, { useState } from "react";
import { FlatList, ListRenderItem, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { Cell, Section, Separator, TableView } from "react-native-tableview-simple";
import useRouter from "use-react-router";
import { SinglelineHeader } from "../../../components/header/Header";
import { HeaderCancelButton, HeaderSaveButton } from "../../../components/header/HeaderButtons";
import IconComponent from "../../../components/IconComponent";
import { BlockColor, getDisplayColorForBlock } from "../../../util/blocks/blockColor";
import { IMajor } from "../../../util/class/storage";
import { ClassType } from "../../../util/class/type";
import { styles } from "./ClassesConfigureView";

export default function ClassesListView() {
    const { history } = useRouter();

    const goBack = () => history.goBack();
    const done = () => {
        // TODO: Save
        history.push("/settings");
    };

    const goTo = (path: string) => () => history.push(path);

    const classRenderItem: ListRenderItem<IMajor> = ({ item }) => {
        return (
            <TouchableOpacity onPress={goTo(`/settings/classes/${item.uuid}`)}>
                <Cell title={item.name} detail={`Room: ${item.room} Teacher: ${item.teacher}`} cellStyle="Subtitle" accessory="DisclosureIndicator" titleTextColor={getDisplayColorForBlock(item.block)} />
            </TouchableOpacity>
        );
    };

    const keyExtractor = (_: unknown, i: number) => i.toString();

    const [tempClasses, setTempClasses] = useState<IMajor[]>([
        {
            block: BlockColor.Green,
            lab: true,
            name: "gween",
            room: 1,
            teacher: "string",
            type: ClassType.Major,
            uuid: "uuid1"
        },
        {
            block: BlockColor.Yellow,
            lab: false,
            name: "|Yelo",
            room: 32,
            teacher: "ee",
            type: ClassType.Major,
            uuid: "uuid2"
        }
    ]);

    const addClass = () => {
        console.log("e");
        setTempClasses((p) => [...p, {
            block: BlockColor.None,
            lab: false,
            name: "New Class",
            room: 0,
            teacher: "",
            type: ClassType.Major,
            uuid: "uuidnew" // FIXME: TODO:
        }]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <SinglelineHeader title="Class Settings" leftButton={<HeaderCancelButton onPress={goBack} />} rightButton={<HeaderSaveButton onPress={done} disabled={true/* TODO: */} />} />
            <ScrollView>
                <TableView>
                    <Section header="Majors" footer="Majors are classes that meet the full 5 days of the cycle">
                        <FlatList keyExtractor={keyExtractor} data={tempClasses} renderItem={classRenderItem} ItemSeparatorComponent={Separator} />
                        <TouchableOpacity onPress={addClass}>
                            <Cell title="Add a class" cellAccessoryView={<IconComponent name="add-circle-outline" />} titleTextColor={"#1f85cc"} />
                        </TouchableOpacity>
                    </Section>
                    <Section header="Electives" footer="Electives are any class that meets less than 5 times a cycle">
                        <Cell title="TODO" />
                    </Section>
                    <Section header="DRs" footer="A DR or Directed Research is what lowerclassmen have in place of a free block. They are simply advised free blocks.">
                        <Cell title="TODO" />
                    </Section>
                </TableView>
            </ScrollView>
        </SafeAreaView>
    );
}