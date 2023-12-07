import {PosLayout} from "../../components/Layout/PosLayout";
import {navigate, useTitle} from "../../App";
import WindowHeader from "../../components/WindowHeader/WindowHeader";
import {
    Header
} from "@zationdev/ui";
import ResizableLayout from "../../components/ResizableLayout/ResizableLayout";
import MenuBar from "../../components/MenuBar/MenuBar";
import MenuItem from "../../components/MenuItem/MenuItem";
import {ChartType} from "../../core/models/Chart";
import React, {useCallback, useEffect, useState} from "react";
import ChartsData from "../../core/models/ChartsData";
import ContextRightMenu from "../../components/ContextRightMenu/ContextRightMenu";
import SlideEditor from "../../components/SlideEditor/SlideEditor";
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
    Title, useDialogs, HStack, Center
} from "@znui/react";
import {openWPCFileInWindow, readWPCFile, selectWPCFile} from "../../file/openWPCFile";
import {printWPCFile} from "../../file/exportWPCFile";
import {buildChartObject} from "../../core/models/builder";
import {saveWPCFile, saveWPCFileAs} from "../../file/saveWPCFile";
import {DEFAULT_SIZE} from "../../core/models/constants";
import {ExportModal} from "../../components/SlideEditor/ExportModal";
import {ZnUIIconDeleteFilled} from "@znui/icons";


export const types: Array<{
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

export default function ChartsWindow() {
    const [title, setTitle] = useTitle()

    const [chartsData, setChartsData] = useState(windowData as ChartsData || new ChartsData())
    const [showSlidesList, setShowSlidesList] = useState(true)
    const [selectedChart, selectSlide] = useState<number>(0)
    const dialogs = useDialogs()

    const newTitle = chartsData.path || "Новый файл"
    if(newTitle!==title) {
        setTitle(newTitle)
    }

    const needUpdate = useCallback((action: boolean = true) => {
        const clone = structuredClone(chartsData)
        clone.saved = !action
        setChartsData(clone)
    }, [chartsData])

    const createChart = useCallback((type: ChartType, title: string) => {
        chartsData.charts.push(
            buildChartObject(type, title)
        )

        needUpdate()
    }, [needUpdate, chartsData])
    
    const exportChart = useCallback(() => {
        dialogs.showModal((rest) =>
            <ExportModal {...rest}
                         charts={chartsData.charts}
                         currentChart={selectedChart}
            />
        )
    }, [dialogs, chartsData, selectedChart])
    
    const openFile = useCallback(() => {
        selectWPCFile((path) => {
            dialogs.showAlert({
                title: 'Открытие проекта',
                description: 'Где вы желаете открыть проект?',
                actions: [
                    {
                        title: 'В текущем окне',
                        cancel: true,
                        onClick: () => {
                            setChartsData(readWPCFile(path))
                        }
                    },
                    {
                        title: 'В новом окне',
                        cancel: true,
                        onClick: () => {
                            openWPCFileInWindow(path, false)
                        }
                    },
                    {
                        title: 'Отмена',
                        cancel: true
                    }
                ]
            })
        })
    }, [dialogs])

    useEffect(() => {
        const shortcutsHandler = (e: KeyboardEvent) => {
            if(e.ctrlKey) {
                switch (e.key) {
                    case 's':
                        if(e.shiftKey) {
                            saveWPCFileAs(chartsData, () => {
                                needUpdate(false)
                            })
                        }else saveWPCFile(chartsData, () => {
                            needUpdate(false)
                        })
                        return;
                    
                    case 'o':
                        openFile()
                        return;

                    case 'p':
                        printWPCFile(chartsData)
                        return;

                    case 'e':
                        exportChart()
                        return;
                }
            }
        }
        
        window.addEventListener('keyup', shortcutsHandler)
        return () => window.removeEventListener('keyup', shortcutsHandler)
    }, [chartsData, exportChart, needUpdate, openFile])

    return <PosLayout
        te={<>
            <WindowHeader onClose={() => {
                if(chartsData.saved) {
                    navigate(HomeWindow.PAGE_NAME, {
                        ...HomeWindow.WINDOW_SETTINGS,
                        closeWindow: true
                    })

                    return
                }

                dialogs.showAlert({
                    title: "Вы не сохранили документ",
                    description: "Не хотите сохранить его?",
                    actions: [
                        {
                            title: "Выйти",
                            onClick: () => {
                                navigate(HomeWindow.PAGE_NAME, {
                                    ...HomeWindow.WINDOW_SETTINGS,
                                    closeWindow: true
                                })
                            }
                        },
                        {
                            title: "Сохранить",
                            onClick: () => {
                                saveWPCFileAs(chartsData, () => {
                                    navigate(HomeWindow.PAGE_NAME, {
                                        ...HomeWindow.WINDOW_SETTINGS,
                                        closeWindow: true
                                    })
                                })
                            }
                        },
                        {
                            title: "Отмена",
                            cancel: true
                        }
                    ]
                })
            }}/>

            <MenuBar>
                {
                    [
                        MenuItem({
                            title: "Файл",
                            children: [
                                {
                                    title: 'Открыть',
                                    onClick: openFile
                                },
                                {
                                    title: 'Сохранить',
                                    onClick: () => {
                                        saveWPCFile(chartsData, () => {
                                            needUpdate(false)
                                        })
                                    }
                                },
                                {
                                    title: 'Сохранить как...',
                                    onClick: () => {
                                        saveWPCFileAs(chartsData, () => {
                                            needUpdate(false)
                                        })
                                    }
                                },
                                {
                                    title: 'Печать',
                                    onClick: () => {
                                        printWPCFile(chartsData)
                                    }
                                },
                                {
                                    title: "Экспорт в PNG",
                                    onClick: exportChart
                                }
                            ]
                        }),
                        MenuItem({
                            title: "Новый график",
                            children: types.map(it => ({
                                title: it.title,
                                onClick: () => {
                                    createChart(it.id, 'Новый график ('+(chartsData.charts.length+1)+')')
                                },
                            }))
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
                                chartsData.charts.map((it, index) => {
                                    return <ContextRightMenu
                                        key={index}
                                        menu={(i) => {
                                            return [
                                                {
                                                    icon: <ZnUIIconDeleteFilled/>,
                                                    title: "Удалить",
                                                    onClick: () => {
                                                        chartsData.charts.splice(index, 1)
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
            chartsData.charts[selectedChart] === undefined ?
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
                                            'Новый '+it.title+' ('+(chartsData.charts.length+1)+')')
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
                <SlideEditor charts={chartsData} chart={chartsData.charts[selectedChart]} needUpdate={needUpdate}/>
        }

        be={
            <HStack bg={ThemeTokens.surfaceContainer} justifyContent='space-between'>
                <MenuBar mode="secondary">
                    {
                        [
                            MenuItem({
                                title: "Кол-во графиков: " + chartsData.charts.length,
                                onClick: () => setShowSlidesList(!showSlidesList)
                            }),
                        ]
                    }
                </MenuBar>

                <HStack
                    bg={ThemeTokens.surfaceContainer}
                    h={30}
                    ph={15}
                >
                    {
                        chartsData.charts[selectedChart] && <>
                            <Center
                                ph={10}
                                gap={3}
                            >
                                <Body>Ширина: </Body>
                                <Body
                                    contentEditable={true}
                                    suppressContentEditableWarning={true}
                                    role="textbox"
                                    cursor='text'
                                    onWheel={(e) => {
                                        const change = e.deltaY > 0 ? 1: -1
                                        chartsData.charts[selectedChart].size.width += change
                                    }}
                                    onBlur={e => {
                                        let width = parseFloat(e.currentTarget.innerText)
                                        if(isNaN(width)) {
                                            width = DEFAULT_SIZE.width
                                        }

                                        e.currentTarget.innerText = width.toString()
                                        chartsData.charts[selectedChart].size.width = width
                                        needUpdate()
                                    }} onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            e.currentTarget.blur()
                                        }
                                    }}
                                >{chartsData.charts[selectedChart].size.width}</Body>
                                <Body> px</Body>
                            </Center>

                            <Center
                                ph={10}
                                gap={3}
                            >
                                <Body>Высота: </Body>
                                <Body
                                    contentEditable={true}
                                    suppressContentEditableWarning={true}
                                    role="textbox"
                                    cursor='text'
                                    onWheel={(e) => {
                                        const change = e.deltaY > 0 ? 1: -1
                                        chartsData.charts[selectedChart].size.width += change
                                    }}
                                    onBlur={e => {
                                        let height = parseFloat(e.currentTarget.innerText)
                                        if(isNaN(height)) {
                                            height = DEFAULT_SIZE.height
                                        }

                                        e.currentTarget.innerText = height.toString()
                                        chartsData.charts[selectedChart].size.height = height
                                        needUpdate()
                                    }} onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            e.currentTarget.blur()
                                        }
                                    }}
                                >{chartsData.charts[selectedChart].size.height}</Body>
                                <Body> px</Body>
                            </Center>
                        </>
                    }
                </HStack>
            </HStack>
        }
    />
}

ChartsWindow.PAGE_NAME = "create-project";
ChartsWindow.WINDOW_SETTINGS = {
    minWidth: 600,
    minHeight: 600,
}