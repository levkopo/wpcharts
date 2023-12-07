import ChartsFileData from "../file_models/ChartsFileData";
import ChartsData from "./ChartsData";
import {DEFAULT_AXES, DEFAULT_SIZE} from "./constants";

export const decodeChartFile = (data: ChartsFileData, path: string): ChartsData => {
    return {
        path: path,
        saved: true,
        charts: data.charts.map(it => ({
            title: it.title,
            type: it.type,
            creationDate: it.creationDate,
            axes: it.axes ?? DEFAULT_AXES,
            size: it.size ?? DEFAULT_SIZE,
            points: it.points.map(it => ({
                points: it.points.map(it => ({
                    x: it.x,
                    y: it.y
                }))
            }))
        }))
    }
}

export const encodeChartFile = (data: ChartsData,): ChartsFileData => {
    return {
        charts: data.charts.map(it => ({
            title: it.title,
            type: it.type,
            creationDate: it.creationDate,
            axes: it.axes,
            size: it.size,
            points: it.points.map(it => ({
                points: it.points.map(it => ({
                    x: it.x,
                    y: it.y
                }))
            }))
        }))
    }
}