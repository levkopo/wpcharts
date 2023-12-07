import Points from "./Points";

export type ChartType = 'bar'|'bubble'|'doughnut'|'pie'|'line'|'polarArea'|'radar'|'scatter';

export default interface Chart {
    title: string
    type: ChartType
    creationDate: number
    axes?: string[]
    points: Points[]
}