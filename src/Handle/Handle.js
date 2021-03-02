import React, { useEffect, useState } from 'react';
import './Handle.css';

import {BiHide, BiShow} from 'react-icons/bi';
import {IoIosArrowUp} from 'react-icons/io';

const ipc = window.require('electron').ipcRenderer;

const electron = window.require('electron');
const remote = electron.remote;
const handleWin = remote.getCurrentWindow();

var t

window.addEventListener('mousemove', event => {
  if (event.target === document.documentElement) {
    handleWin.setIgnoreMouseEvents(true, {forward: true})
    if (t) clearTimeout(t)
    t = setTimeout(function() {
        handleWin.setIgnoreMouseEvents(false)
    }, 150)
  } else handleWin.setIgnoreMouseEvents(false)
})

const Handle = () => {
    const [toggle, setToggle] = useState(true);
    const [pullerClasses, setPullerClasses] = useState('puller hide-bar');
    const [handleClasses, setHandleClasses] = useState('handle');

    const ClickToggleScroll = () => {
        ipc.invoke('ToggleScroll').then((result) => {
            console.log("Supposed State: " + !result);
            ToggleScroll(!result);
        });
    };

    const ToggleScroll = (toggleNewState) => {
        setToggle(toggleNewState);            
        ipc.send('ResizeMainWindow', ['last', 'last', toggleNewState]);
        if (toggleNewState){
            setPullerClasses('puller hide-bar');
            setHandleClasses('handle');
        }
        else{
            setPullerClasses('puller show-small-bar');
            setTimeout(() => {
                setHandleClasses('handle handle-small');
            }, 300)
        }
    };

    ipc.on('Unfocused', (toggleState) => {
        ToggleScroll(toggleState);
    });

    return (
        <div  className={handleClasses}>
            <a onClick={ClickToggleScroll} className={pullerClasses}>
                <IoIosArrowUp className="animate-up" />
                <IoIosArrowUp className="animate-up" />
                {toggle ? <BiHide />: <BiShow />}
                <IoIosArrowUp className="animate-up" />
                <IoIosArrowUp className="animate-up" />
            </a>
        </div>
    )
};


export default Handle;