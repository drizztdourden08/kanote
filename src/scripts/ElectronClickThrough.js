const electron = window.require('electron');
const remote = electron.remote;

const mainWin = remote.getCurrentWindow();

var t;

const mouseMoveDetect = () => {
    window.addEventListener('mousemove', event => {
        if (event.target === document.documentElement) {
            mainWin.setIgnoreMouseEvents(true, { forward: true });
            if (t) clearTimeout(t);
            t = setTimeout(() => {
                mainWin.setIgnoreMouseEvents(false);
            }, 150);
        } else mainWin.setIgnoreMouseEvents(false);
    });
};

export { mouseMoveDetect };