import React, {ErrorInfo, useEffect, useMemo, useRef, useState} from 'react'
import Chart from "../../core/models/Chart";
import {
    Dialog,
    Link
} from "@zationdev/ui";
import Placeholder from "../Placeholder/Placeholder";
import {Chart as ChartJS, registerables} from "chart.js";
import EditableHeader from "../EditableHeader/EditableHeader";
import Points from "../../core/models/Points";
import ResizableLayout from "../ResizableLayout/ResizableLayout";
import {PosLayout} from "../Layout/PosLayout";
import {saveAsFile, types} from "../../windows/ChartsWindow/ChartsWindow";
import ChartsData from "../../core/models/ChartsData";
import {getCurrentWindow} from "@electron/remote";
import {
    Button,
    Body,
    ScrollLayout,
    useSnackbar,
    VStack,
    HStack,
    useDialogs,
    ContainedIconButton, IconWrapper
} from "@znui/react";
import Table from "../Table/Table";
import {SelectGroupModal} from "./SelectGroupModal";
import {SwapHorizIcon} from "../../icons/SwapHorizIcon";
import {MopIcon} from "../../icons/MopIcon";
import {buildGraphObject} from "../../file/buildGraph";

ChartJS.register(...registerables);

export interface SlideEditorProps {
    charts: ChartsData,
    chart: Chart,
    needUpdate: () => void
}

const PointsEditor = (data: {
    points: Points,
    chart: Chart,
    needUpdate: () => void
}) => {
    const snackbar = useSnackbar()

    return <ScrollLayout
        flex={1}
    >
        <Table
            w='100%'
            ph={15}
            pt={15}
            table={data.points.points.map(it => [it.x, it.y])}
            xHeaders={data.chart.axes ?? ['X', 'Y']}
            onChangedAxe={(axe, title) => {
                if (!data.chart.axes) {
                    data.chart.axes = ['X', 'Y']
                }

                data.chart.axes[axe] = title
                data.needUpdate()
            }}
            onChanged={(x, y, rawValue) => {
                const value = parseFloat(rawValue)
                if (isNaN(value)) {
                    snackbar({
                        text: 'Не удалось обработать значение. Ожидалось значение типа "число"'
                    })
                    return
                }

                const currentRow = data.points.points[y] ?? {x: 0, y: 0}
                currentRow[x === 0 ? 'x' : 'y'] = value
                data.points.points[y] = currentRow
                data.needUpdate()
            }}
        />
    </ScrollLayout>
}

const ChartPointsGroupEditor = (data: {
    chart: Chart,
    needUpdate: () => void
}) => {
    const dialogs = useDialogs()
    const [points, setPoints] = useState(0)
    const currentPoints = useMemo(() => data.chart.points[points] ?? [], [data.chart.points, points])

    return <>
        <HStack mh={15} mt={10} gap={8}>
            <Button
                h={24}
                mode={'tonal'}
                onClick={(e) => {
                    dialogs.showModal(
                        (props) =>
                            <SelectGroupModal
                                groups={data.chart.points}
                                updateGroups={(groups) => {
                                    data.chart.points = groups
                                    if(points >= data.chart.points.length) {
                                        setPoints(data.chart.points.length - 1)
                                    }

                                    data.needUpdate()
                                }}
                                selectGroup={(group) => {
                                    setPoints(group)
                                }}
                                {...props}
                            />,
                        e,
                        {
                            fullscreen: false,
                            cancelable: false
                        }
                    )
                }}>
                Группа {points + 1}
            </Button>

            <ContainedIconButton
                mode='outline'
                layoutSize={35}
                onClick={() => {
                    currentPoints.points.forEach(point => {
                        const lastX = point.x
                        point.x = point.y
                        point.y = lastX
                    })

                    data.needUpdate()
                }}
            >
                <SwapHorizIcon/>
            </ContainedIconButton>

            <ContainedIconButton
                mode='outline'
                layoutSize={35}
                onClick={() => {
                    dialogs.showAlert({
                        title: 'Вы уверены?',
                        description: 'Это отчистит таблицу полностью',
                        actions: [
                            {
                                title: 'Отмена',
                                cancel: true
                            },
                            {
                                title: 'Отчистить таблицу',
                                cancel: true,
                                onClick: () => {
                                    currentPoints.points = []
                                    data.needUpdate()
                                }
                            }
                        ]
                    })
                }}
            >
                <MopIcon/>
            </ContainedIconButton>
        </HStack>
        {<PointsEditor chart={data.chart}
                          key={points} 
                          points={currentPoints}
                          needUpdate={data.needUpdate}/>}
    </>
}

function SlideEditorInner({chart, needUpdate}: SlideEditorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current!!

        const renderedChart = buildGraphObject(canvas, chart);
        return () => {
            renderedChart.destroy()
        }
    }, [chart])

    return <PosLayout
        le={
            <ResizableLayout width={400} maxWidth="500px" minWidth="300px">
                <VStack height='100%'>
                    <EditableHeader
                        title={chart.title}
                        onChangeText={text => {
                            chart.title = text
                            needUpdate()
                        }}
                    />

                    <VStack mh={15} mt={10}>
                        <Body size='large'>
                            <b>Тип: </b> {types.find(it => it.id === chart.type)?.title ?? 'unknown'}
                        </Body>
                        <Body size='large'>
                            <b>Дата создания: </b> {new Date(chart.creationDate).toLocaleDateString()}
                        </Body>
                    </VStack>

                    <ChartPointsGroupEditor chart={chart} needUpdate={needUpdate}/>
                </VStack>
            </ResizableLayout>
        }

        content={
            <div style={{
                width: '100%',
                height: "100%",
                display: "flex",
                alignItems: "center",
                background: "#FFF"
            }}>
                <div style={{
                    width: "99%",
                }}>
                    <canvas id="chart" ref={canvasRef}/>
                </div>
            </div>
        }
    />;
}

class SlideEditor extends React.Component<SlideEditorProps, {
    error?: undefined | any
}> {
    constructor(props: SlideEditorProps) {
        super(props);
        this.state = {error: undefined};
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        this.setState({...this.state, error: info});
    }

    render() {
        if (this.state.error) {
            return <Dialog dismiss={() => {
            }}>
                <Placeholder
                    emoji="🍙"
                    title={
                        <>
                            <div>Упс... Что-то пошло не так и мы не смогли отобразить данный слайд.</div>
                            <Link onClick={() => window.open("https://yandex.ru/?q=заказать онигири")}>Не желаете
                                онигири?</Link>
                        </>
                    }
                    actions={
                        <Button onClick={() => {
                            saveAsFile(this.props.charts, () => {
                                getCurrentWindow().close()
                            })
                        }}>Сохранить файл и выйти</Button>
                    }
                />
            </Dialog>
        }

        return <SlideEditorInner {...this.props}/>;
    }
}

export default SlideEditor