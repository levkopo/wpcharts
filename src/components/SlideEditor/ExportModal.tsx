import React from "react";
import {ListItem, Modal, ModalDialogInterface} from "@znui/react";
import {ZnUIIconCloseFilled} from "@znui/icons";
import Chart from "../../core/models/Chart";
import {dialog, require as remote_require} from "@electron/remote";
import path from "path";
import {exportPNG} from "../../file/exportWPCFile";

export interface ExportModalProps {
    charts: Chart[]
    currentChart: number
    dialogInterface: ModalDialogInterface
}

export const ExportModal = (props: ExportModalProps) => {
    const {
        dialogInterface,
        charts,
        currentChart
    } = props

    const exit = () => {
        dialogInterface.close()
    }

    return <Modal
        navigationIcon={<ZnUIIconCloseFilled/>}
        onClickNavigationIcon={exit}
        title='Экспорт в PNG'
    >
        <ListItem
            heading='Экспортировать всё'
            onClick={() => {
                dialog.showOpenDialog({
                    defaultPath: __dirname,
                    properties: ['openDirectory']
                }).then((file) => {
                    if (!file.canceled) {
                        setTimeout(() => {
                            charts.forEach((chart, index) => {
                                remote_require('fs').writeFileSync(
                                    path.join(file.filePaths[0]!!.toString(), './'+index+'. '+chart.title+'.png'),
                                    exportPNG(chart),
                                    'base64'
                                );
                            })
                        })
                    }
                })
            }}
        />

        {charts.length>currentChart&&<ListItem
            heading={'Экспортировать ' + charts[currentChart].title}
            onClick={() => {
                dialog.showSaveDialog({
                    defaultPath: path.join(__dirname, '../'+charts[currentChart].title+'.png'),
                    filters: [
                        {
                            name: 'PNG',
                            extensions: ['png']
                        },
                    ],
                    properties: []
                }).then((file) => {
                    if (!file.canceled) {
                        remote_require('fs').writeFile(
                            file.filePath!!.toString(),
                            exportPNG(charts[currentChart]),
                            'base64',
                            () => {
                                exit()
                            }
                        );
                    }
                })
            }}
        />}
    </Modal>
}