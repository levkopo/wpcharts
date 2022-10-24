import React, {ErrorInfo, useEffect, useRef, useState} from 'react'
import Chart from "../../core/models/Chart";
import {
    AddIcon,
    Button,
    DeleteIcon,
    Dialog,
    Div,
    IconButton,
    Link,
    Tabs,
    TabsItem
} from "@zationdev/ui";
import Placeholder from "../Placeholder/Placeholder";
import {Chart as ChartJS, registerables} from "chart.js";
import EditableHeader from "../EditableHeader/EditableHeader";
import Points from "../../core/models/Points";
import ResizableLayout from "../ResizableLayout/ResizableLayout";
import {Layout} from "../Layout/Layout";
import IconAdd from "../../icons/IconAdd";
import {saveFile} from "../../windows/ChartsWindow/ChartsWindow";
import ChartsData from "../../core/models/ChartsData";
import {getCurrentWindow} from "@electron/remote";

ChartJS.register(...registerables);

export interface SlideEditorProps {
    charts: ChartsData,
    chart: Chart,
    needUpdate: () => void
}

const COLORS = [
    'rgba(255, 99, 132, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 205, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(201, 203, 207, 1)'
]

const PointsEditor = (data: {
    points: Points,
    needUpdate: () => void
}) => {

    return <div>

        <div style={{
            height: '73' +
                'vh',
            overflowY: 'scroll'
        }}>
            <table>
                <tr>
                    <th>X</th>
                    <th>Y</th>
                </tr>
                {
                    data.points.points.map((it, i) => <tr key={it.x+'_'+it.y+'_'+i}>
                        <td>
                            <input style={{width: "100%", height: "100%"}} type="number" defaultValue={it.x} onBlur={e => {
                                it.x = Number(e.currentTarget.value)
                                data.needUpdate()
                            }} onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    e.currentTarget.blur()
                                }
                            }}/>
                        </td>
                        <td>
                            <input style={{width: "100%", height: "100%"}} type="number" defaultValue={it.y} onBlur={e => {
                                it.y = Number(e.currentTarget.value)
                                data.needUpdate()
                            }} onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    e.currentTarget.blur()
                                }
                            }}/>
                        </td>
                        <td>
                            <IconButton onClick={() => {
                                data.points.points.splice(
                                    i, 1
                                )

                                data.needUpdate()
                            }} title="Удалить">
                                <DeleteIcon/>
                            </IconButton>
                        </td>
                    </tr>)
                }
            </table>
        </div>

        <Button mode="tertiary" stretched={true} before={<IconAdd/>} onClick={() => {
            data.points.points.push({ x: 0, y: 0 })
            data.needUpdate()
        }}>
            Добавить
        </Button>
    </div>
}

const ChartPointsGroupEditor = (data: {
    chart: Chart,
    needUpdate: () => void
}) => {
   const [points, setPoints] = useState(0)

   return <>
       <Tabs>
           <IconButton onClick={() => {
               data.chart.points.push({ points: [] })
               data.needUpdate()
           }}><IconAdd/></IconButton>

           <IconButton onClick={() => {
               data.chart.points.splice(points, 1)
               data.needUpdate()
           }}><DeleteIcon/></IconButton>

           {
               data.chart.points.map((it, i) =>
                    <TabsItem
                        key={i}
                        selected={i===points}
                        onClick={() => setPoints(i)}>
                        Группа {i+1}
                    </TabsItem>
               )
           }
       </Tabs>
       {data.chart.points.length!==0&&<PointsEditor key={points} points={data.chart.points[points]} needUpdate={data.needUpdate}/>}
   </>
}

function SlideEditorInner({chart, needUpdate}: SlideEditorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current!!

        const renderedChart = new ChartJS(
            canvas,
            {
                type: chart.type,
                data: {
                    labels: Array<number>().concat(...chart.points.map(it=> it.points.map(it => it.x)))
                        .filter((v, i, a) => a.indexOf(v) === i)
                        .sort((a, b) => a - b).filter((item, pos, a) => {
                            return a.indexOf(item) === pos;
                        }),

                    datasets: chart.points.map((line, i) => ({
                        label: undefined,
                        borderColor: COLORS[i],
                        backgroundColor: COLORS[i],
                        data: line.points.map(it => ({
                            x: it.x,
                            y: it.y
                        })).sort((a, b) => a.x-b.x)
                    }))
                },

                plugins: [
                    {
                        id: 'backgroundColor',
                        beforeDraw: (chart) => {
                            const {ctx} = chart;
                            ctx.save();
                            ctx.globalCompositeOperation = 'destination-over';
                            ctx.fillStyle = '#FFF';
                            ctx.fillRect(0, 0, chart.width, chart.height);
                            ctx.restore();
                        }
                    }
                ],

                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: chart.title
                        },
                        legend: {
                            display: false,
                        }
                    },

                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },

                    animation: false,
                    layout: {
                        padding: 20
                    },

                    parsing: {
                        xAxisKey: 'x',
                        yAxisKey: 'y',
                        key: 'x',
                    }
                }
            }
        );

        return () => {
            renderedChart.destroy()
        }
    }, [chart])

    return <div>
        <Layout
            left={
                <ResizableLayout width={400} maxWidth="500px" minWidth="300px">
                    <EditableHeader
                        title={chart.title}
                        onChangeText={text => {
                            chart.title = text
                            needUpdate()
                        }}
                    />
                    <Div style={{lineHeight: '24px', marginLeft: 15}}>
                        <div><b>Тип: </b> {chart.type}</div>
                        <div><b>Дата создания: </b> {new Date(chart.creationDate).toLocaleDateString()}</div>

                    </Div>

                    <ChartPointsGroupEditor chart={chart} needUpdate={needUpdate}/>
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
        />
    </div>;
}

class SlideEditor extends React.Component<SlideEditorProps, {
    error?: undefined|any
}> {
    constructor(props: SlideEditorProps) {
        super(props);
        this.state = { error: undefined };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        this.setState({ ...this.state, error: info });
    }

    render() {
        if(this.state.error) {
            return <Dialog dismiss={() => {}}>
                <Placeholder
                    emoji="🍙"
                    title={
                        <>
                            <div>Упс... Что-то пошло не так и мы не смогли отобразить данный слайд.</div>
                            <Link onClick={() => window.open("https://yandex.ru/?q=заказать онигири")}>Не желаете онигири?</Link>
                        </>
                    }
                    actions={
                        <Button onClick={() => {
                            saveFile(this.props.charts, () => {
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