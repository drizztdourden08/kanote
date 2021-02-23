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

    mainWin = new standardWindow({ 
        y:36,
        x:0,
        width: 930, 
        height: 600,
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

    //mainWin.webContents.openDevTools();

    mainWin.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`); 
    mainWin.on("closed", () => (mainWin = null));

    return mainWin;
};

function createHandle() {
    handleWin = new standardWindow({ 
        y:-35,
        x:0,
        width: 100, 
        height: 35,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: true,
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
        { label: 'Exit'}
      ]);
    tray.setToolTip('Kanote')
    tray.setContextMenu(contextMenu)
});

app.on("window-all-closed", () => { if (process.platform !== "darwin") { app.quit(); } });     
app.on("activate", () => { if (mainWindow === null) { createWindow(); }}); 

let lastColumnCount;
let lastrowMax;

ResizeCenterMain = (columnCount, rowMax, toggled) => {
    let c, r;    
    columnCount==='last' ? c = lastColumnCount: c = parseInt(columnCount);
    rowMax==='last' ? r = lastrowMax: r = parseInt(rowMax);
    
    //Size is minimum for 3 columns and 3 rows.
    c = Math.max(3, c);
    r = Math.max(3, r);

    lastColumnCount = c;
    lastrowMax = r;

    screenWidth = getScreenWidth();
    const [appWidth, appHeight] = mainWindow.getSize();
    let [appX, appY] = mainWindow.getPosition()

    const colTitleH = 50;
    const colAddH = 40;
    const cardH = 120;
    const cardMarginH = 10;
    const appMarginTopH = 20;
    const bottomBuffer = 120;
    
   // const TargetHeight = colTitleH + colAddH + (cardH * r) + (cardMarginH * (r + 1)) + (appMarginH * 2) + bottomBuffer;
    const TargetHeight = colTitleH + colAddH + (cardH * r) + (cardMarginH * (r + 1)) + appMarginTopH + bottomBuffer;
    console.log(TargetHeight);

    const TargetWidth = ((300 + 20) * c);
    const centeredX = (screenWidth / 2) - (TargetWidth / 2);

    mainWindow.resizable = true;
    mainWindow.setSize(TargetWidth, TargetHeight);
    mainWindow.setPosition(centeredX, appY);
    mainWindow.resizable = false;

    let handleWidth = TargetWidth + 10;
    let handleHeight = 45; 

    const handleCenteredX = (screenWidth / 2) - (handleWidth / 2);

    handle.resizable = true;
    handle.setPosition(handleCenteredX, -5);
    handle.setSize(handleWidth, handleHeight);
    handle.resizable = false;
};

ipc.on('ResizeMainWindow', (event, args) => {
    ResizeCenterMain(args[0], args[1], args[2]);
});


const ToggleScroll = () => {
    screenWidth = getScreenWidth();
    const [appWidth, appHeight] = mainWindow.getSize();
    let [appX, appY] = mainWindow.getPosition()
    let [handleX, handleY] = handle.getPosition()

    let appToggled;
    if(appY < 0) {
        appToggled = false;
    }
    else{
        appToggled = true;
    }

    let intervalCount = 0;
    let intervalMax;
    let modifier = 20;

    if (appToggled) {
        mainWindow.alwaysOnTop = true;
        modifier *= -1;
        appY = 0; //Ensure starting position when moving in case anything happened that moved the normal position.
    }
    else {
        mainWindow.alwaysOnTop = true;
        appY = -appHeight;
    }

    intervalMax = Math.round((appHeight + 35) / Math.abs(modifier));
    const animationMsTotal = 200;
    const msInterval = animationMsTotal / intervalMax
    const iID = setInterval(() => {
        if (intervalCount <= intervalMax) {
            let y = appY + (intervalCount * modifier);            
            mainWindow.setPosition(appX, y);
        }
        else{
            let y = appY + (intervalMax * modifier);
            mainWindow.setPosition(appX, y);          
            clearInterval(iID);
        };
        intervalCount++;
    }, msInterval);
    return appToggled;
}

ipc.handle('ToggleScroll', (event, args) => {
    const toggleState =  ToggleScroll();
    return toggleState;
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