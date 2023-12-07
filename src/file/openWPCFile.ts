import {dialog as edialog, require as remote_require} from "@electron/remote";
import {addToRecentFiles} from "../store";
import {unpack} from "msgpackr";
import ChartsData from "../core/models/ChartsData";
import ChartsWindow from "../windows/ChartsWindow/ChartsWindow";
import {navigate} from "../App";
import ChartsFileData from "../core/file_models/ChartsFileData";
import {decodeChartFile} from "../core/models/coder";

export const selectWPCFile = (onSelect: (path: string) => void) => {
    edialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            {
                name: 'WPCharts File',
                extensions: ['wpc']
            },
        ],
    }).then(file => {
        if (!file.canceled) {
            addToRecentFiles({
                path: file.filePaths[0],
                lastEdit: Date.now()
            })

            onSelect(file.filePaths[0])
        }
    })
}

export const readWPCFile = (path: string): ChartsData => {
    const data = remote_require("fs").readFileSync(path)
    const chart = unpack(data) as ChartsFileData
    return decodeChartFile(chart, path)
}

export const openWPCFileInWindow = (path: string, closeWindow: boolean = true) => {
    navigate(ChartsWindow.PAGE_NAME, {
        ...ChartsWindow.WINDOW_SETTINGS,
        closeWindow
    }, readWPCFile(path))
}