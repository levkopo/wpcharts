import React from 'react';
import ReactDOM from 'react-dom/client';
import '@zationdev/ui/dist/index.css';
import "@znui/react/dist/index.css";
import './index.css';
import App, {navigate} from './App';
import {ipcRenderer} from "electron";
import HomeWindow from "./windows/HomeWindow/HomeWindow";
import {AdaptiveProvider, ThemeProvider} from "@znui/react";
import {openWPCFileInWindow} from "./file/openWPCFile";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

export let windowData: any = undefined

ipcRenderer.on("data", (_, data) => {
    windowData = data

    if(window.location.hash !== '#startup') {
        root.render(
            <AdaptiveProvider>
                <ThemeProvider scheme='system'>
                    <App/>
                </ThemeProvider>
            </AdaptiveProvider>
        );
    } else {
        setTimeout(() => {
            if(windowData===undefined){
                navigate(HomeWindow.PAGE_NAME, {
                    ...HomeWindow.WINDOW_SETTINGS,
                    closeWindow: true
                })
            }else{
                openWPCFileInWindow(windowData)
            }

        }, 5 * 1000)
    }
})
