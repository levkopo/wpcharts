import {PosLayout} from "../../components/Layout/PosLayout";
import {navigate, useTitle} from "../../App";
import WindowHeader from "../../components/WindowHeader/WindowHeader";
import {
    Button,
    DeleteIcon, Dialog, Header, Toolbar
} from "@zationdev/ui";
import ResizableLayout from "../../components/ResizableLayout/ResizableLayout";
import MenuBar from "../../components/MenuBar/MenuBar";
import MenuItem from "../../components/MenuItem/MenuItem";
import {List} from "../../components/List/List";
import {dialog, require as remote_require} from "@electron/remote";

import {ChartType} from "../../core/models/Chart";
import React, {useState} from "react";
import ChartsData from "../../core/models/ChartsData";
import ContextRightMenu from "../../components/ContextRightMenu/ContextRightMenu";
import SlideEditor from "../../components/SlideEditor/SlideEditor";
import { pack } from 'msgpackr';
import path from "path";
import {addToRecentFiles} from "../../store";
import {windowData} from "../../index";
import HomeWindow from "../HomeWindow/HomeWindow";
import {
    Body,
    Headline,
    Card,
    Layout,
    ScrollLayout,
    ThemeTokens,
    VStack,
    GridLayout,
    Tappable,
    Title
} from "@znui/react";


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

    return <PosLayout
        te={<>
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
                            children: types.map(it => ({
                                title: it.title,
                                onClick: () => {
                                    createChart(it.id, 'Новый график ('+(presentationData.charts.length+1)+')')
                                },
                            }))
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

        le={
            <ResizableLayout
                hide={!showSlidesList}
                width={200}
                maxWidth="40vw"
                minWidth="200px"
            >
                <VStack
                    flex={1}
                    h='100%'
                    bg={ThemeTokens.surfaceContainer}
                >
                    <Header
                        title="Графики"
                        mode="tertiary"
                    />

                    <ScrollLayout flex={1}>
                        <VStack>
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
                                        <Layout
                                            as={Tappable}
                                            h='100%'
                                            onClick={() => selectSlide(index)}
                                            borderRight={
                                                selectedChart===index? "solid 5px" : undefined
                                            }
                                            borderRightColor={ThemeTokens.primaryContainer}
                                            ph={15}
                                            pv={10}
                                        >
                                            <Body size='medium'>
                                                {index+1}. {it.title}
                                            </Body>
                                        </Layout>
                                    </ContextRightMenu>
                                })
                            }
                        </VStack>
                    </ScrollLayout>
                </VStack>
            </ResizableLayout>
        }

        content={
            presentationData.charts[selectedChart] === undefined ?
                <ScrollLayout>
                    <VStack gap={15} mh={15}>
                        <Headline style={{
                            textAlign: "center",
                            marginTop: "10vh",
                            marginBottom: 15
                        }}>Создайте свой первый график</Headline>

                        <GridLayout columns={[1, 2, 3]} gap={15}>
                            {
                                types.map(it =>
                                    <Card
                                        mode="filled"
                                        as={Tappable}
                                        key={it.id}
                                        onClick={() => createChart(it.id,
                                            'Новый '+it.title+' ('+(presentationData.charts.length+1)+')')
                                        }
                                    >
                                        <VStack pv={10} ph={15}>
                                            <Title>{it.title}</Title>
                                        </VStack>
                                    </Card>
                                )
                            }
                        </GridLayout>
                    </VStack>
                </ScrollLayout>:
                <SlideEditor charts={presentationData} chart={presentationData.charts[selectedChart]} needUpdate={needUpdate}/>
        }

        be={
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