import {Chart as ChartJS} from "chart.js";
import Chart from "../core/models/Chart";

const COLORS = [
    'rgba(255, 99, 132, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 205, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(201, 203, 207, 1)'
]

// const getColorByVar = (name: string) => getComputedStyle(document.body).getPropertyValue('--'+name);

export const buildGraphObject = (canvas: HTMLCanvasElement, chart: Chart) => {
    return new ChartJS(
        canvas,
        {
            type: chart.type,
            data: {
                labels: Array<number>().concat(...chart.points.map(it => it.points.map(it => it.x)))
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
                    })).sort((a, b) => a.x - b.x)
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
                aspectRatio: chart.size.width / chart.size.height,

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
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: chart.axes[1],
                            align: 'end'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: chart.axes[0],
                            align: 'end'
                        }
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
    )
}