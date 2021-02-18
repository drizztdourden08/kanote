import React, { useEffect } from 'react';
import './Main.css';

import Column from './components/Column';

const electron = window.require('electron');
const remote = electron.remote;

var screen = remote.screen;
var mainScreen = screen.getPrimaryDisplay()
const dimensions = mainScreen.size;
const screenWidth = dimensions.width;
console.log(screenWidth);

const Main = () => {
    useEffect(() => {    
      const appWidth = (((300 + 10) * 3));
      console.log(appWidth);
      const centeredX = (screenWidth / 2) - (appWidth / 2);
      console.log(centeredX);
  
      remote.getCurrentWindow().setSize(appWidth, 600);
      remote.getCurrentWindow().setPosition(centeredX, 0);
  
  
    },
    // array of variables that can trigger an update if they change. Pass an
    // an empty array if you just want to run it once after component mounted. 
    [])
    
    return (
      <div className="App">
        <div className="columns">
          <Column />
          <Column />
          <Column />
        </div>
      </div>
    );
  };
  
  export default Main;