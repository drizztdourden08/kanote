import React, { useEffect } from 'react'
import './Handle.css';

import {BiDotsHorizontalRounded} from 'react-icons/bi';

const ipc = window.require('electron').ipcRenderer;


const Handle = () => {

    const toggleScroll = () => {
        ipc.send('ToggleScroll');
    };

    return <div className="Handle">
        <a onClick={toggleScroll} className="puller"><BiDotsHorizontalRounded /></a>
    </div>
};


export default Handle;