import Points from "../models/Points";
import {ChartType} from "../models/Chart";

export default interface ChartFile {
    title: string
    type: ChartType
    creationDate: number
    axes?: string[]
    size?: {
        width: number,
        height: number
    }
    points: Points[]
}