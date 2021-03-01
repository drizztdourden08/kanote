const electron = window.require('electron');
const remote = electron.remote;

const mainWin = remote.getCurrentWindow();

var t

const MouseMoveDetect = () => {
    window.addEventListener('mousemove', event => {
        if (event.target === document.documentElement) {
            mainWin.setIgnoreMouseEvents(true, { forward: true })
            if (t) clearTimeout(t)
            t = setTimeout(function () {
                mainWin.setIgnoreMouseEvents(false)
            }, 150)
        } else mainWin.setIgnoreMouseEvents(false)
    })
};

export { MouseMoveDetect }