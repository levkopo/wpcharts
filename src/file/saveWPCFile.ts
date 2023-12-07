import ChartsData from "../core/models/ChartsData";
import {dialog, require as remote_require} from "@electron/remote";
import {pack} from "msgpackr";
import {addToRecentFiles} from "../store";
import path from "path";
import {encodeChartFile} from "../core/models/coder";

export const saveWPCFile = (presentationData: ChartsData, onSave: () => void) => {
    if(!presentationData.path) {
        saveWPCFileAs(presentationData, onSave)
        return
    }

    remote_require("fs").writeFile(presentationData.path,
        pack(encodeChartFile(presentationData)),
        function (err: Error) {
            if(err) {
                saveWPCFileAs(presentationData, onSave)
                return
            }

            addToRecentFiles({
                path: presentationData.path!!,
                lastEdit: Date.now()
            })

            presentationData.saved = true
            onSave()
        });
}

export const saveWPCFileAs = (presentationData: ChartsData, onSave: () => void) => {
    dialog.showSaveDialog({
        defaultPath:  presentationData.path || path.join(__dirname, "untitled.wpc"),
        filters: [
            {
                name: 'WPCharts File',
                extensions: ['wpc']
            },
        ],
        properties: []
    }).then(file => {
        if (!file.canceled) {
            const path = file.filePath!!

            presentationData.path = path.toString()
            saveWPCFile(presentationData, onSave)
        }
    }).catch(err => {
        console.log(err)
    });
}