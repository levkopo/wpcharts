import {Layout} from "../../components/Layout/Layout";
import {navigate, useTitle} from "../../App";
import WindowHeader from "../../components/WindowHeader/WindowHeader";
import {
    AddIcon, Button,
    Card,
    Cell, ContextMenu, DeleteIcon, Dialog, Div,
    Header, IconButton, NavigationListItem, Toolbar
} from "@zationdev/ui";
import NavigationLayout from "../../components/NavigationLayout/NavigationLayout";
import ResizableLayout from "../../components/ResizableLayout/ResizableLayout";
import MenuBar from "../../components/MenuBar/MenuBar";
import MenuItem from "../../components/MenuItem/MenuItem";
import {List} from "../../components/List/List";
import {dialog, getCurrentWindow, require as remote_require} from "@electron/remote";

import {ipcRenderer} from "electron";
import Chart, {ChartType} from "../../core/models/Chart";
import React, {useEffect, useState} from "react";
import ChartsData from "../../core/models/ChartsData";
import ContextRightMenu from "../../components/ContextRightMenu/ContextRightMenu";
import SlideEditor from "../../components/SlideEditor/SlideEditor";
import { unpack, pack } from 'msgpackr';
import path from "path";
import {addToRecentFiles} from "../../store";
import {windowData} from "../../index";
import HomeWindow from "../HomeWindow/HomeWindow";


const types: Array<{
    id: ChartType,
    title: string
}> = [
    {
        id: 'bar',
        title: "Столбцовая диаграмма"
    },
    {
        id: 'bubble',
        title: 'Пузырьковая диаграмма'
    },
    {
        id: 'doughnut',
        title: 'Круговая пончикавая диаграмма'
    },
    {
        id: 'pie',
        title: 'Круговая диаграмма'
    },
    {
        id: 'line',
        title: 'Линейная диаграмма'
    },
    {
        id: 'polarArea',
        title: 'Карта полярных областей'
    },
    {
        id: 'radar',
        title: 'Лепестковая диаграмма'
    },
    {
        id: 'scatter',
        title: 'Диаграмма рассеяния'
    },
]

export const saveFile = (presentationData: ChartsData, onSave: () => void) => {
    dialog.showSaveDialog({
        defaultPath:  presentationData.path || path.join(__dirname, "untitled.wpc"),
        filters: [
            {
                name: 'WPCharts File',
                extensions: ['wpc']
            },
        ],
        properties: []
    }).then(file => {
        if (!file.canceled) {
            const path = file.filePath!!

            presentationData.path = path.toString()
            remote_require("fs").writeFile(path.toString(),
                pack(presentationData),
                function (err: Error) {
                    if(err) {
                        presentationData.path = undefined
                        throw err;
                    }

                    addToRecentFiles({
                        path: presentationData.path!!,
                        lastEdit: Date.now()
                    })

                    onSave()
                });
        }
    }).catch(err => {
        console.log(err)
    });
}

export default function ChartsWindow() {
    const [title, setTitle] = useTitle()

    const [presentationData, setPresentationData] = useState(windowData as ChartsData || new ChartsData())
    const [showSlidesList, setShowSlidesList] = useState(true)
    const [selectedChart, selectSlide] = useState<number>(0)
    const [windowDialog, setDialog] = useState<any>()

    const newTitle = presentationData.path || "Новый файл"
    if(newTitle!==title) {
        setTitle(newTitle)
    }

    const needUpdate = () => {
        setPresentationData(structuredClone(presentationData))
    }

    const createChart = (type: ChartType, title: string) => {
        presentationData.charts.push(
            {
                title: title,
                type: type,
                creationDate: Date.now(),
                points: [
                    {
                        points: [
                            { x: 0.000888, y: 0 },
                            { x: 0.9921, y: 1 },
                            { x: 556.8, y: 2 },
                            { x: 578.5, y: 4 },
                            { x: 602.6, y: 8 },
                            { x: 618.1, y: 12 },
                            { x: 629.6, y: 16 },
                            { x: 638.9, y: 20 },
                        ]
                    },
                    {
                        points: [
                            { x: 0, y: 0 },
                            { x: 538.1, y: 1 },
                            { x: 558.3, y: 2 },
                            { x: 580.1, y: 4 },
                            { x: 604.4, y: 8 },
                            { x: 620.0, y: 12 },
                            { x: 631.6, y: 16 },
                            { x: 640.9, y: 20 },
                        ]
                    }
                ]
            }
        )

        needUpdate()
    }

    return <Layout
        top={<>
            <WindowHeader onClose={() => {
                setDialog(<Dialog dismiss={() => setDialog(undefined)}>
                    <Toolbar title="Вы несохранили документ"/>
                    <div>
                        Не хотите сохранить его?
                    </div>

                    <div style={{
                        width: "100%",
                        marginLeft: "auto",
                        display: "flex",
                        gap: 15
                    }}>
                        <Button onClick={() => {
                            navigate(HomeWindow.PAGE_NAME, {
                                ...HomeWindow.WINDOW_SETTINGS,
                                closeWindow: true
                            })
                        }}>Выйти</Button>
                        <Button onClick={() => saveFile(presentationData, () => {
                            navigate(HomeWindow.PAGE_NAME, {
                                ...HomeWindow.WINDOW_SETTINGS,
                                closeWindow: true
                            })
                        })}>Сохранить</Button>
                        <Button onClick={() => setDialog(undefined)}>Отмена</Button>
                    </div>
                </Dialog>)
            }}/>
            {windowDialog}

            <MenuBar>
                {
                    [
                        MenuItem({
                            title: "Файл",
                            onClick: () => {
                                saveFile(presentationData, () => {
                                    needUpdate()
                                })
                            }
                        }),
                        MenuItem({
                            title: "Новый график",
                            onClick: () => {
                                createChart('line', 'Новый линейный график ('+(presentationData.charts.length+1)+')')
                            }
                        }),
                        MenuItem({
                            title: "Экпорт в PNG",
                            onClick: () => {
                                dialog.showSaveDialog({
                                    defaultPath: path.join(__dirname, '../'+presentationData.charts[selectedChart].title+'.png'),
                                    filters: [
                                        {
                                            name: 'PNG',
                                            extensions: ['png']
                                        },
                                    ],
                                    properties: []
                                }).then((file) => {
                                    if (!file.canceled) {
                                        const base64Data = (document.getElementById("chart") as HTMLCanvasElement)
                                            .toDataURL("image/png")
                                            .replace(/^data:image\/png;base64,/, "");

                                        remote_require('fs').writeFile(
                                            file.filePath!!.toString(),
                                            base64Data,
                                            'base64',
                                            () => {}
                                        );
                                    }
                                })
                            }
                        })
                    ]
                }
            </MenuBar>
        </>}

        left={
            showSlidesList ? <>
                <ResizableLayout width={200} maxWidth="40vw" minWidth="200px">
                    <NavigationLayout>
                        <Header
                            title="Графики"
                            mode="tertiary"
                        />

                        <List>
                            {
                                presentationData.charts.map((it, index) => {
                                    return <ContextRightMenu
                                        key={index}
                                        menu={(i) => {
                                            return [
                                                {
                                                    icon: <DeleteIcon/>,
                                                    title: "Удалить",
                                                    onClick: () => {
                                                        presentationData.charts.splice(index, 1)
                                                        needUpdate()
                                                        i.dismiss()
                                                    }
                                                }
                                            ]
                                        }}
                                    >
                                        <Cell onClick={() => selectSlide(index)} style={{
                                            borderRight: selectedChart===index?"var(--colorPrimaryContainer) solid 5px":undefined,
                                            opacity: selectedChart!==index?"0.5":undefined,
                                            borderRadius: "var(--zui-containers-round)"
                                        }}>
                                            {index+1}. {it.title}
                                        </Cell>
                                    </ContextRightMenu>
                                })
                            }

                            <div style={{height: 60}}/>
                        </List>
                    </NavigationLayout>
                </ResizableLayout>
            </> : <></>
        }

        content={
            presentationData.charts[selectedChart] === undefined ?
                <div style={{
                    overflow: "auto"
                }}>
                    <h2 style={{
                        textAlign: "center",
                        marginTop: "10vh",
                        marginBottom: 15
                    }}>Создайте свой первый график</h2>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "25% 25% 25%",
                        gap: 15,
                        width: '100%'
                    }}>
                        {
                            types.map(it =>
                                <Card style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    padding: 15,
                                    gap: 15,
                                    width: "100%"
                                }} key={it.id} onClick={() => createChart(it.id,
                                    'Новый '+it.title+' ('+(presentationData.charts.length+1)+')')
                                }>
                                    <div style={{
                                        width: "100%",
                                        paddingBottom: "100%",
                                    }}/>
                                    <h3>{it.title}</h3>
                                </Card>
                            )
                        }
                    </div>
                </div>:
                <SlideEditor charts={presentationData} chart={presentationData.charts[selectedChart]} needUpdate={needUpdate}/>
        }

        bottom={
            <MenuBar mode="secondary">
                {
                    [
                        MenuItem({
                            title: "Кол-во графиков: " + presentationData.charts.length,
                            onClick: () => setShowSlidesList(!showSlidesList)
                        })
                    ]
                }
            </MenuBar>
        }
    />
}

ChartsWindow.PAGE_NAME = "create-project";
ChartsWindow.WINDOW_SETTINGS = {
    minWidth: 600,
    minHeight: 600,
    closeWindow: true,
}