const { app, BrowserWindow} = require('electron')
const path = require('path')
const fs = require('fs')
const {...remote} = require("@electron/remote/main");

remote.initialize()

const createWindow = () => {
    const filePath = process.argv.at(-1);

    const mainWindow = new BrowserWindow({
        width: 630,
        height: 200,
        minWidth: 630,
        minHeight: 200,
        frame: false,
        icon: __dirname + '/icon.png',
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInSubFrames: true,
            contextIsolation: false,
            v8CacheOptions: "code"
        },
    });

    mainWindow.setBackgroundColor("#7d2aa6")
    remote.enable(mainWindow.webContents)

    const startUrl = process.env.ELECTRON_START_URL || "file://"+path.join(__dirname, './index.html');
    console.log(startUrl);
    mainWindow.loadURL(startUrl+"#startup").then(() => {
        mainWindow.webContents.send("data",
            fs.lstatSync(filePath).isFile() && filePath.endsWith('.wpc') ? filePath:
                undefined
        )
    });
}

app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
