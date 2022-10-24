import React, {useState} from "react";
import {AddIcon, Button, Cell, Dialog, Div, FloatingActionButton, Header, IconButton} from "@zationdev/ui";
import {Layout} from "../../components/Layout/Layout";
import WindowHeader from "../../components/WindowHeader/WindowHeader";
import NavigationLayout from "../../components/NavigationLayout/NavigationLayout";
import {List} from "../../components/List/List";
import {navigate, openChartFromFile, useTitle} from "../../App";
import ChartsWindow from "../ChartsWindow/ChartsWindow";
import {addToRecentFiles, getRecentFiles} from "../../store";
import {dialog as edialog, require as remote_require} from "@electron/remote";
import {unpack} from "msgpackr";
import ChartsData from "../../core/models/ChartsData";
import IconOpenFile from "../../icons/IconOpenFile";

export default function HomeWindow() {
    const [title, setTitle] = useTitle()
    const [dialog, setDialog] = useState<any>()
    if(title!=="Главная") setTitle("Главная")

    const openFromFile = (path: string) => {
        setDialog(<Dialog dismiss={() => undefined}>
            <Div style={{textAlign: "center", marginTop: 50, marginBottom: 50}}>
                Подождите, загружается....
            </Div>
        </Dialog>)

        openChartFromFile(path)
    }

    return (
        <Layout
            top={
                <WindowHeader/>
            }

            left={
                <NavigationLayout>
                    <div style={{
                        padding: 10,
                        display: "flex",
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 15
                    }}>
                        <FloatingActionButton icon={
                            <AddIcon/>
                        } size={"56px"} onClick={() => {
                            navigate(ChartsWindow.PAGE_NAME, ChartsWindow.WINDOW_SETTINGS)
                        }}/>

                        <IconButton onClick={() => {
                            edialog.showOpenDialog({
                                properties: ['openFile'],
                                filters: [
                                    {
                                        name: 'WPCharts File',
                                        extensions: ['wpc']
                                    },
                                ],
                            }).then(file => {
                                if (!file.canceled) {
                                    addToRecentFiles({
                                        path: file.filePaths[0],
                                        lastEdit: Date.now()
                                    })
                                    openFromFile(file.filePaths[0])
                                }
                            })
                        }}>
                            <IconOpenFile/>
                        </IconButton>
                    </div>
                </NavigationLayout>
            }
            content={
                <>
                    {dialog}

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
                                    onClick={() => openFromFile(it.path)}
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