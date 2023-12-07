import {dialog as edialog, require as remote_require} from "@electron/remote";
import {addToRecentFiles} from "../store";
import {unpack} from "msgpackr";
import ChartsData from "../core/models/ChartsData";
import ChartsWindow from "../windows/ChartsWindow/ChartsWindow";
import {navigate} from "../App";
import {buildGraphObject} from "./buildGraph";

export const printWPCFile = (file: ChartsData) => {
    let windowContent = '<!DOCTYPE html>';
    windowContent += '<html>'
    windowContent += '<head><title>Print canvas</title></head>';
    windowContent += '<body>'

    for (const chart of file.charts) {
        const canvas = document.createElement('canvas');
        canvas.height = 240;
        canvas.width = 340;

        canvas.style.width  = '240px';
        canvas.style.height = '340px';

        document.body.append(canvas)

        const graph = buildGraphObject(canvas, chart);
        graph.draw()

        windowContent += '<img src="' + canvas.toDataURL() + '" alt="">';
        graph.destroy()
    }

    windowContent += '</body>';
    windowContent += '</html>';

    const printWin = window.open('','','width=340,height=240')!!;
    printWin.document.open();
    printWin.document.write(windowContent);
    printWin.document.close();
    setTimeout(() => {
        printWin.focus();
        printWin.print();
        printWin.close();
    }, 1000)
}

// export const readWPCFile = (path: string): ChartsData => {
//     const data = remote_require("fs").readFileSync(path)
//     const chart = unpack(data) as ChartsData
//     chart.saved = true
//     return chart
// }
//
// export const openWPCFileInWindow = (path: string, closeWindow: boolean = true) => {
//     navigate(ChartsWindow.PAGE_NAME, {
//         ...ChartsWindow.WINDOW_SETTINGS,
//         closeWindow
//     }, readWPCFile(path))
// }