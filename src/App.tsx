/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import { InitialState, NavigationState } from "@react-navigation/core";
import { DarkTheme, DefaultTheme, NavigationNativeContainer } from "@react-navigation/native";
import Constants from "expo-constants";
import { create } from "mobx-persist";
import { useObserver } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { AsyncStorage, StatusBar } from "react-native";
import { AppearanceProvider } from "react-native-appearance";
import { SafeAreaProvider } from "react-native-safe-area-view";
import { enableScreens } from "react-native-screens";
import * as Sentry from "sentry-expo";
import { ThemeProvider } from "styled-components";
import { CalendarContext, ClassesContext, PreferencesStoreContext, PreparedClassesContext, ReloadFunctionContext, TempClassesContext } from "./contexts";
import MainNavigator from "./navigators/MainNavigator";
import StorageKey from "./storageKey";
import { Theme } from "./stores/preferencesStore";
import { darkTheme, lightTheme } from "./styles/theme";
import fetchCalendar from "./util/calendar/fetch";
import parseCalendar from "./util/calendar/parse";
import useTheme from "./util/hooks/useTheme";
import LoadingView from "./views/LoadingView";

/** The internal state of the application setup */
export enum ApplicationState {
    Setup = "Setting Up",
    PreparingMP = "Preparing mobx-persist",
    LoadingCal = "Loading Calendar",
    DownloadingCal = "Downloading Calendar",
    ParsingCal = "Parsing Calendar",
    SavingCal = "Saving Calendar",
    LoadingPreferences = "Loading Preferences",
    LoadingClasses = "Loading Classes",
    Opening = "Opening App",
    Loaded = "Loaded",
    Errored = "ERRORED",
}

enableScreens(true);

Sentry.init({
    dsn: "https://55a644a01c154f0ca6b19f18849b9b51@sentry.io/1480747",
    environment: Constants.manifest.releaseChannel as string
});
// TODO: Sentry.setUserContext({})

/** The main app component */
export default function App() {
    // The state storing the current task of the app (Only changed by load fn)
    const [currentTask, setCurrentTask] = useState<ApplicationState>(ApplicationState.Setup);
    // The state storing the loaded initial navigation state (Only changed by load fn)
    const [initialNavState, setInitialNavState] = useState<InitialState | undefined>();
    // The hydrated stores
    const calendar = useContext(CalendarContext);
    const classes = useContext(ClassesContext);
    const tempClasses = useContext(TempClassesContext);
    const preparedClasses = useContext(PreparedClassesContext);
    const preferences = useContext(PreferencesStoreContext);

    /** Async function to initialize the app and all needed stores */
    const Load = async (reset = false) => {
        setCurrentTask(ApplicationState.PreparingMP);

        // Setup Mobx-Persist
        const hydrate = create({
            jsonify: true,
            storage: AsyncStorage
        });

        setCurrentTask(ApplicationState.LoadingCal);

        // Load from cache if exists
        await hydrate(StorageKey.Calendar, calendar);

        // If not loaded, download it
        if (calendar.updated.getTime() === 0 || reset) {
            setCurrentTask(ApplicationState.DownloadingCal);

            // Fetch the calendar off of the interweb
            const rawcal = await fetchCalendar();

            if (rawcal.isErr) {
                setCurrentTask(ApplicationState.Errored);
                console.error(rawcal.error);

                return;
            }

            setCurrentTask(ApplicationState.ParsingCal);
            // Parse the calendar
            const parsed = parseCalendar(rawcal.unwrap());

            setCurrentTask(ApplicationState.SavingCal);
            // Update the calendar with the given parsed info
            await calendar.updateCalendar(parsed);
        }

        setCurrentTask(ApplicationState.LoadingPreferences);

        // Hydrate the preferences store
        await hydrate(StorageKey.Preferences, preferences);

        setCurrentTask(ApplicationState.LoadingClasses);
        // Hydrate the classes store
        await hydrate(StorageKey.Classes, classes);
        // Hydrate the temp classes to = the saved classes
        tempClasses.hydrateFrom(classes);

        // Hydrate the prepared classes store
        await hydrate(StorageKey.PreparedClasses, preparedClasses);

        setCurrentTask(ApplicationState.Opening);
        // Restore current navigation state in development only
        if (__DEV__) {
            const navstate = await AsyncStorage.getItem(StorageKey.Navigation);
            if (navstate !== null) {
                setInitialNavState(JSON.parse(navstate) as InitialState);
            }
        }

        setCurrentTask(ApplicationState.Loaded);
    };

    const changeNavState = (state?: Partial<NavigationState>) => {
        if (state !== undefined) {
            AsyncStorage.setItem(StorageKey.Navigation, JSON.stringify(state)).catch((e) => console.warn("Failed to set navigation state", e));
        }
    };

    useEffect(() => {
        Load().catch((reason) => {
            setCurrentTask(ApplicationState.Errored);
            console.error(reason);
        });
    }, []);

    const theme = useTheme();

    const apptheme = useObserver(() => theme.computed === Theme.Light ? lightTheme : darkTheme);
    const navTheme = useObserver(() => theme.computed === Theme.Light ? DefaultTheme : DarkTheme);
    const barStyle = useObserver(() => theme.computed === Theme.Light ? "dark-content" : "light-content");

    const MainViewContents = () => (
        <NavigationNativeContainer initialState={initialNavState} onStateChange={changeNavState} theme={navTheme}>
            <ReloadFunctionContext.Provider value={Load}>
                <MainNavigator />
            </ReloadFunctionContext.Provider>
        </NavigationNativeContainer>
    );

    return (
        <SafeAreaProvider>
            <AppearanceProvider>
                <ThemeProvider theme={apptheme}>
                    <StatusBar barStyle={barStyle} translucent={false} hidden={false} />
                    {currentTask === ApplicationState.Loaded ? <MainViewContents /> : <LoadingView task={currentTask} />}
                </ThemeProvider>
            </AppearanceProvider>
        </SafeAreaProvider>
    );
}