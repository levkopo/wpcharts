import {BrowserWindow} from "@electron/remote";
import ChartsData from "../core/models/ChartsData";
import {buildGraphObject} from "./buildGraph";
import {Chart as ChartJS} from "chart.js";
import Chart from "../core/models/Chart";

export const printWPCFile = (file: ChartsData) => {
    let windowContent = '<!DOCTYPE html>';
    windowContent += '<html>'
    windowContent += '<head><title>Print canvas</title></head>';
    windowContent += '<body>'

    let graphs: ChartJS[]  = []
    for (const chart of file.charts) {
        const canvas = document.createElement('canvas');
        document.body.append(canvas)

        const graph = buildGraphObject(canvas, chart);
        const width = chart.size.width
        const height = chart.size.height

        graph.resize(width, height)
        graph.draw()
        graphs.push(graph)

        windowContent += '<img src="' + canvas.toDataURL() + '" width="'+width+'" height="'+height+'" alt="">';
        canvas.remove()
    }

    windowContent += '</body>';
    windowContent += '</html>';

    graphs.forEach(it => it.destroy())

    let win = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.webContents.loadURL('data:text/html;charset=utf-8,'+windowContent);
    win.webContents.on('did-finish-load', () => {
        win.webContents.print({}, (success, failureReason) => {
            if (!success) console.log(failureReason);

            win.destroy()
        });
    });
}

export const exportPNG = (chart: Chart) => {
    const canvas = document.createElement('canvas');
    document.body.append(canvas)

    const graph = buildGraphObject(canvas, chart);
    const width = chart.size.width
    const height = chart.size.height

    graph.resize(width, height)
    graph.draw()

    const data = canvas.toDataURL()

    canvas.remove()
    graph.destroy()

    return data.replace(/^data:image\/png;base64,/, "")
}