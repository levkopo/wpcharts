import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import './App.css';
import {Route, Router} from "wouter";
import {Path} from "wouter/types/use-location";
import HomeWindow from "./windows/HomeWindow/HomeWindow";
import ChartsWindow from "./windows/ChartsWindow/ChartsWindow";
import {BrowserWindow, getCurrentWindow, require as remote_require, screen} from "@electron/remote";
import {BrowserWindowConstructorOptions} from "electron";
import {unpack} from "msgpackr";
import ChartsData from "./core/models/ChartsData";
import {Layout, ThemeTokens} from "@znui/react";

const titleContext = createContext<[string, (title: string) => void]>(['', () => undefined]);
export function useTitle() {
    return useContext(titleContext);
}

const currentLocation = () => {
    return window.location.hash.replace(/^#/, "") || "/";
};
export const navigate = (to: string, settings: BrowserWindowConstructorOptions & {
    closeWindow?: boolean
} = {}, data: any = undefined) => {
    const primaryDisplay = screen.getPrimaryDisplay()
    const factor = primaryDisplay.scaleFactor

    const newWindow = new BrowserWindow({
        width: factor * (settings.width||1200),
        height: factor * (settings.height||1200),
        minWidth: factor * (settings.minWidth||1200),
        minHeight: factor * (settings.minHeight||1200),

        ...settings,
        frame: false,
        icon: __dirname + '/resources/android-chrome-512x512.png',
        // parent: getCurrentWindow(),
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInSubFrames: true,
            contextIsolation: false
        },
    });

    newWindow.setBackgroundColor("#f6f2ff")
    remote_require("@electron/remote/main").enable(newWindow.webContents)
    newWindow.loadURL(window.location.href
        .substring(0, window.location.href.indexOf('#')) + "#" + to).then(it => {
        newWindow.webContents.send("data", data)

        if(settings.hasOwnProperty('closeWindow') && settings.closeWindow){
            getCurrentWindow().close()
        }
    });
};

const useHashLocation: (
    ...args: any[]
) => [Path, (path: Path, ...args: any[]) => any] = () => {
    const [loc, setLoc] = useState(currentLocation());

    useEffect(() => {
        // this function is called whenever the hash changes
        const handler = () => setLoc(currentLocation());

        // subscribe to hash changes
        window.addEventListener("hashchange", handler);
        return () => window.removeEventListener("hashchange", handler);
    }, []);

    return [loc, navigate];
}

function App() {
    const [title, setTitle] = useState("Главная")
    useMemo(() => window.document.title = "WPCharts - " + title, [title])

    return (
        <titleContext.Provider value={[title, setTitle]}>
            <Layout
                pos='fixed'
                posV={0}
                posH={0}
                bg={ThemeTokens.surface}
                c={ThemeTokens.onSurface}
            >
                <Router hook={useHashLocation}>
                    <Route path={HomeWindow.PAGE_NAME} component={HomeWindow}/>
                    <Route path={ChartsWindow.PAGE_NAME} component={ChartsWindow}/>
                </Router>
            </Layout>
        </titleContext.Provider>
    );
}

export default App;
