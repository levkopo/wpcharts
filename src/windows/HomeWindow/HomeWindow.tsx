import React, {useState} from "react";
import {AddIcon, Cell, Header} from "@zationdev/ui";
import {PosLayout} from "../../components/Layout/PosLayout";
import WindowHeader from "../../components/WindowHeader/WindowHeader";
import {List} from "../../components/List/List";
import {navigate, useTitle} from "../../App";
import ChartsWindow from "../ChartsWindow/ChartsWindow";
import {getRecentFiles} from "../../store";
import IconOpenFile from "../../icons/IconOpenFile";
import {FloatingActionButton, NavigationRail} from "@znui/react";
import {openWPCFileInWindow, selectWPCFile} from "../../file/openWPCFile";

export default function HomeWindow() {
    const [title, setTitle] = useTitle()
    if(title!=="Главная") setTitle("Главная")

    return (
        <PosLayout
            te={
                <WindowHeader/>
            }

            le={
                <NavigationRail
                    h='100%'
                    menu={
                        <FloatingActionButton
                            size="default"
                            onClick={() => {
                                navigate(ChartsWindow.PAGE_NAME, ChartsWindow.WINDOW_SETTINGS)
                            }}
                        >
                            <AddIcon/>
                        </FloatingActionButton>
                    }
                >
                    <NavigationRail.Item
                        title="Открыть файл"
                        onClick={() => {
                            selectWPCFile(openWPCFileInWindow)
                        }}
                    >
                        <IconOpenFile/>
                    </NavigationRail.Item>
                </NavigationRail>
            }
            content={
                <>
                    <Header
                        before={<div style={{width: 5}}/>}
                        title="Недавнее"
                        mode="tertiary"
                    />
                    <List>
                        {
                            getRecentFiles().map((it, index) =>
                                <Cell
                                    key={index}
                                    before={<div style={{width: 30}}/>}
                                    description={"Последнее открытие: "+new Date(it.lastEdit).toLocaleDateString()}
                                    onClick={() => openWPCFileInWindow(it.path)}
                                >{it.path}</Cell>
                            )
                        }
                    </List>
                </>
            }
        />
    );
}

HomeWindow.PAGE_NAME = "home"
HomeWindow.WINDOW_SETTINGS = {
    width: 1200,
    height: 800,
    minWidth: 600,
    minHeight: 600,
}