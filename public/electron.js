const electron = require("electron");
const { app, Menu, Tray } = require("electron");

const standardWindow = electron.BrowserWindow;
const {BrowserWindow} = require("electron-acrylic-window");
const path = require("path"); 
const isDev = require("electron-is-dev"); 

let mainWindow;
let handle;

ipc = electron.ipcMain;

function createMain() {
    vOptions = {
        theme: 'appearance-based',
        effect: 'acrylic',
        useCustomWindowRefreshMethod: true,
        maximumRefreshRate: 60,
        disableOnBlur: false
     }

    mainWin = new BrowserWindow({ 
        y:0,
        x:0,
        width: 930, 
        height: 600,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false,
        skipTaskbar: true,
        vibrancy: vOptions,
        webPreferences: { 
            webSecurity: false, 
            nodeIntegration: true,
            enableRemoteModule: true
        },
        show: false
    }); 

    mainWin.webContents.openDevTools();

    mainWin.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`); 
    mainWin.on("closed", () => (mainWin = null));

    return mainWin;
};

function createHandle() {
    screenWidth = getScreenWidth();
    const centeredX = (screenWidth / 2) - (100 / 2);

    handleWin = new standardWindow({ 
        y:600,
        x:centeredX,
        width: 100, 
        height: 60,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false,
        skipTaskbar: true,
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

let tray = null
app.whenReady().then(() => {
    tray = new Tray('public/logo32@2x.png');
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Exit', type: 'radio' }
      ]);
    tray.setToolTip('Kanote')
    tray.setContextMenu(contextMenu)
});

app.on("window-all-closed", () => { if (process.platform !== "darwin") { app.quit(); } });     
app.on("activate", () => { if (mainWindow === null) { createWindow(); }}); 

ResizeCenterMain = (columnCount, rowMax) => {
    console.log("Resizing");

    screenWidth = getScreenWidth();
    const [appWidth, appHeight] = mainWindow.getSize();
    let [appX, appY] = mainWindow.getPosition()

    const TargetWidth = (((300 + 10) * columnCount));
    const centeredX = (screenWidth / 2) - (TargetWidth / 2);
    mainWindow.setSize(TargetWidth, appHeight);
    mainWindow.setPosition(centeredX, appY);

    

};


ipc.on('ResizeMainWindow', (event, args) => {
    console.log("Received: ResizeMainWindow");
    console.log(args[0]);
    console.log(args[1]);
    //ResizeCenterMain(args[0], args[1]);
});

// --------------- POST READY STUFF --------------- //
ipc.on('ToggleScroll', (event, args) => {
    
    screenWidth = getScreenWidth();
    const [appWidth, appHeight] = mainWindow.getSize();
    let [appX, appY] = mainWindow.getPosition()
    let [handleX, handleY] = handle.getPosition()

    let appToggled;
    (appY < 0) ? appToggled = false : appToggled = true;
    console.log(appY);
    console.log(appHeight);
    console.log("Received");

    let intervalCount = 0;
    let intervalMax;
    let modifier = 20;

    if (appToggled) {
        modifier *= -1;
        appY = 0; //Ensure starting position when moving in case anything happened that moved the normal position.
    }
    else appY = -appHeight;
    
    intervalMax = Math.round(appHeight / Math.abs(modifier));
    console.log(intervalMax);
    const iID = setInterval(() => {
        if (intervalCount <= intervalMax) {
            let y = appY + (intervalCount * modifier);            
            mainWindow.setPosition(appX, y);
            handle.setPosition(handleX, y + appHeight);
        }
        else{
            let y = appY + (intervalMax * modifier);
            mainWindow.setPosition(appX, y);
            handle.setPosition(handleX, y + appHeight);            
            clearInterval(iID);
            console.log("Moved at " + y);
        };
        intervalCount++;
    }, 5);
});

getScreenWidth = () => {
    var screen = electron.screen;
    var mainScreen = screen.getPrimaryDisplay()
    const dimensions = mainScreen.size;
    return dimensions.width;
}

getScreenHeight = () => {
    var screen = electron.screen;
    var mainScreen = screen.getPrimaryDisplay()
    const dimensions = mainScreen.size;
    return dimensions.height;
}