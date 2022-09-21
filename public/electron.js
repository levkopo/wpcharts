const { app, BrowserWindow} = require('electron')
const path = require('path')

require('@electron/remote/main').initialize()

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 870,
        minHeight: 600,
        frame: false,
        icon: __dirname + '/resources/android-chrome-512x512.png',
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    const startUrl = process.env.ELECTRON_START_URL || "file://"+path.join(__dirname, './index.html');
    console.log(startUrl);
    mainWindow.loadURL(startUrl);
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
