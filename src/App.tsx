import React from "react";
import {
    createBottomTabNavigator,
    createStackNavigator,
    NavigationParams,
    NavigationScreenConfig,
    NavigationScreenProp,
    NavigationTabScreenOptions
} from "react-navigation";
import TabBarIcon from "./elements/TabBarIcon";
import CalendarView from "./views/CalendarView";
import ClassEditorView from "./views/ClassEditorView";
import ClassSetupView from "./views/ClassSetupView";
import SettingsView from "./views/SetingsView";
import TodayView from "./views/TodayView";

export interface INavigationElementProps<S = {}, P = NavigationParams> {
    navigation: NavigationScreenProp<S, P>;
}

// The stack navigator for the Home page
const HomeStackNavigator = createStackNavigator({
    Today: TodayView
}, {
    cardStyle: {
        backfaceVisibility: "visible",
        backgroundColor: "white"
    },
    initialRouteName: "Today"
});
HomeStackNavigator.navigationOptions = {
    tabBarLabel: "Home",
    tabBarIcon: ({ focused }) => <TabBarIcon name="list" focused={focused} />
} as NavigationScreenConfig<NavigationTabScreenOptions>;

// The stack navigator for the Settings page
const SettingsStackNavigator = createStackNavigator({
    MainSettings: SettingsView,
    ClassSetup: ClassSetupView,
    EditClass: ClassEditorView
}, {
    cardStyle: {
        backfaceVisibility: "visible",
        backgroundColor: "white"
    },
    initialRouteName: "MainSettings"
});
SettingsStackNavigator.navigationOptions = {
    tabBarLabel: "Settings",
    tabBarIcon: ({ focused }) => <TabBarIcon name="cog" focused={focused} />,
    tabBarVisible: true // TODO: REDUX STORE FOR TAB BAR VISIBILITY OR SMTHN
} as NavigationScreenConfig<NavigationTabScreenOptions>;

// The tab navigator
export default createBottomTabNavigator({
    Calendar: CalendarView,
    Home: HomeStackNavigator,
    Settings: SettingsStackNavigator
}, {
    initialRouteName: "Home",
    swipeEnabled: true
});

/**
 * ROUTES
 *
 * BottomTabNavigator
 * | Calendar                           => Calendar View
 * | Home (StackNavigator)
 * | | Today                            => Today View
 * | Settings (StackNavigator)
 * | | MainSettings                     => SettingsView
 * | | ClassSetup                       => ClassSetupView
 * | | EditClass                        => ClassEditorView
 */