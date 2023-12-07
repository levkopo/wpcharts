import Chart from "./Chart";
import {DEFAULT_AXES, DEFAULT_SIZE} from "./constants";

export const buildChartObject = (type: Chart['type'], title: string): Chart => {
    return {
        title: title,
        type: type,
        axes: DEFAULT_AXES,
        size: DEFAULT_SIZE,
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
}