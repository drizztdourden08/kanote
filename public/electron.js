const { CreateDataDirectory, LoadCurrentUserBoard } = require('./scripts/DataManagement.js');

const electron = require('electron');
const { app, Menu, Tray } = require('electron');

const standardWindow = electron.BrowserWindow;
const { BrowserWindow } = require('electron-acrylic-window');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
let handle;

const ipc = electron.ipcMain;

CreateDataDirectory();
LoadCurrentUserBoard();

function createMain() {
    const vOptions = {
        theme: 'appearance-based',
        effect: 'acrylic',
        useCustomWindowRefreshMethod: true,
        maximumRefreshRate: 60,
        disableOnBlur: false
    };

    let mainWin = new standardWindow({
        y: 36,
        x: 0,
        width: 930,
        height: 600,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false,
        fullscreenable: false,
        skipTaskbar: true,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        },
        show: false
    });

    mainWin.webContents.openDevTools();

    mainWin.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
    mainWin.on('closed', () => (mainWin = null));

    return mainWin;
}

function createHandle() {
    let handleWin = new standardWindow({
        y: -35,
        x: 0,
        width: 100,
        height: 35,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: true,
        fullscreenable: false,
        skipTaskbar: true,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        },
        show: false
    });

    //handleWin.webContents.openDevTools();

    handleWin.loadURL(isDev ? 'http://localhost:3000/handle' : `file://${path.join(__dirname, '../build/index.html/handle')}`);
    handleWin.on('closed', () => (handleWin = null));

    return handleWin;
}

app.on('ready', () => {
    mainWindow = createMain();
    handle = createHandle();

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        handle.show();
    });
});

let tray = null;
app.whenReady().then(() => {
    tray = new Tray('public/logo32@2x.png');
    const contextMenu = Menu.buildFromTemplate([{ label: 'Exit' }]);
    tray.setToolTip('Kanote');
    tray.setContextMenu(contextMenu);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (mainWindow === null) {
        createMain();
    }
});

let lastAppWidth;
let lastAppHeight;

const ResizeCenterMain = (appWidth, appHeight) => {
    let w, h;
    appWidth==='last' ? w = lastAppWidth: w = parseInt(appWidth);
    appHeight==='last' ? h = lastAppHeight: h = parseInt(appHeight);

    lastAppWidth = w;
    lastAppHeight = h;

    const screenWidth = getScreenWidth();
    const appY = mainWindow.getPosition()[1];

    const bottomBuffer = 120;

    const targetHeight = h + bottomBuffer;

    const targetWidth = Math.max(w, 300);
    const centeredX = ((screenWidth / 4) * 3) - (targetWidth / 2);

    mainWindow.resizable = true;
    mainWindow.setSize(targetWidth, targetHeight);
    console.log(centeredX +'-'+appY+'-'+targetWidth+'-'+targetHeight);
    mainWindow.setPosition(Math.round(centeredX), appY);
    mainWindow.resizable = false;

    const handleWidth = Math.max(targetWidth + 10, 300);
    const handleHeight = 45;

    const handleCenteredX = ((screenWidth / 4) * 3) - (handleWidth / 2);

    handle.resizable = true;
    handle.setPosition(Math.round(handleCenteredX), -5);
    handle.setSize(handleWidth, handleHeight);
    handle.resizable = false;
};

ipc.on('ResizeMainWindow', (event, args, [appWidth, appHeight] = args) => {
    console.log(appWidth + 'x' + appHeight);
    ResizeCenterMain(appWidth, appHeight);
});

const ToggleScroll = () => {
    const appHeight = mainWindow.getSize()[1];
    const appX = mainWindow.getPosition()[0];
    let appY = mainWindow.getPosition()[1];

    let appToggled;
    if (appY < 0) {
        appToggled = false;
    } else {
        appToggled = true;
    }

    let intervalCount = 0;
    let modifier = 20;

    if (appToggled) {
        mainWindow.alwaysOnTop = true;
        modifier *= -1;
        appY = 0; //Ensure starting position when moving in case anything happened that moved the normal position.
    } else {
        mainWindow.alwaysOnTop = true;
        appY = -appHeight;
    }

    const intervalMax = Math.round((appHeight + 35) / Math.abs(modifier));
    const animationMsTotal = 200;
    const msInterval = animationMsTotal / intervalMax;
    const intervalId = setInterval(() => {
        if (intervalCount <= intervalMax) {
            const y = appY + (intervalCount * modifier);
            mainWindow.setPosition(appX, y);
        } else {
            const y = appY + (intervalMax * modifier);
            mainWindow.setPosition(appX, y);
            clearInterval(intervalId);
        }
        intervalCount++;
    }, msInterval);
    return appToggled;
};

ipc.handle('ToggleScroll', (event, args) => {
    const toggleState =  ToggleScroll();
    return toggleState;
});

const getScreenWidth = () => {
    var screen = electron.screen;
    var mainScreen = screen.getPrimaryDisplay();
    const dimensions = mainScreen.size;
    return dimensions.width;
};

const getScreenHeight = () => {
    var screen = electron.screen;
    var mainScreen = screen.getPrimaryDisplay();
    const dimensions = mainScreen.size;
    return dimensions.height;
};

ipc.handle('GetInitialData', (event, args) => {
    const itemsFromBackend = [];

    const columnsFromBackend = [];

    return [columnsFromBackend, itemsFromBackend];
});