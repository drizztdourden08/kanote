const electron = require("electron");
const app = electron.app;
const standardWindow = electron.BrowserWindow;
const {BrowserWindow} = require("electron-acrylic-window");
const path = require("path"); 
const isDev = require("electron-is-dev"); 

let mainWindow;
let handle;

function createMain() {
    vOptions = {
        theme: 'appearance-based',
        effect: 'acrylic',
        useCustomWindowRefreshMethod: true,
        maximumRefreshRate: 60,
        disableOnBlur: true
     }

    mainWin = new BrowserWindow({ 
        y:0,
        x:0,
        width: 1200, 
        height: 600,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        vibrancy: vOptions,
        webPreferences: { 
            webSecurity: false, 
            nodeIntegration: true,
            enableRemoteModule: true
        },
        show: false
    }); 

    // mainWin.webContents.openDevTools();

    mainWin.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`); 
    mainWin.on("closed", () => (mainWin = null));

    return mainWin;
};

function createHandle() {
    var screen = electron.screen;
    var mainScreen = screen.getPrimaryDisplay()
    const dimensions = mainScreen.size;
    const screenWidth = dimensions.width;

    const centeredX = (screenWidth / 2) - (100 / 2);

    handleWin = new standardWindow({ 
        y:600,
        x:centeredX,
        width: 100, 
        height: 60,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        webPreferences: { 
            webSecurity: false, 
            nodeIntegration: true,
            enableRemoteModule: true
        },
        show: false
    }); 

    //handleWin.webContents.openDevTools();

    handleWin.loadURL(isDev ? "http://localhost:3000/handle" : `file://${path.join(__dirname, "../build/index.html/handle")}`); 
    handleWin.on("closed", () => (handleWin = null));

    return handleWin;
};

app.on("ready", () => {
    mainWindow = createMain();
    handle = createHandle();

    mainWindow.once('ready-to-show', () => {        
        mainWindow.show();
        handle.show();
    })
});

app.on("window-all-closed", () => { if (process.platform !== "darwin") { app.quit(); } });     
app.on("activate", () => { if (mainWindow === null) { createWindow(); }}); 