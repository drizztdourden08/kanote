import React, { useEffect, useState, useRef } from 'react';

import { mouseMoveDetect } from '../scripts/ElectronClickThrough';

import './Main.css';

import Swimlane from './components/Swimlane';
import './components/css/Swimlane.css';

const ipc = window.require('electron').ipcRenderer;

const { v4: uuidv4 } = require('uuid');

class _Board {
    constructor(){
        this.swimlanes = [];
    }
}

class _Swimlane {
    constructor(){
        this.id = uuidv4();
        this.columns = [];
    }
}

class _Column {
    constructor(swimlaneId) {
        this.id = uuidv4();
        this.swimlaneId = swimlaneId;
        this.title = '' + Math.random() * 1000  + '';
        this.cards = [];
        this.editing = false;
        this.moveColumnBy = 0;
        this.moveSwimlaneBy = 0;
        this.toDelete = false;
        this.cancelChanges = false;
        this.originalColumn = {};
    }
}

class _Card {
    constructor(columnId) {
        this.id = uuidv4();
        this.columnId = columnId;
        this.title = '' + Math.random() * 1000  + '';
        this.priority = '';
        this.tags = [];
        this.content = [];
        this.timing = { created: null, dueDate: null, timeLeft: null, breached: false };
        this.notification = false;
        this.assignee = null;
        this.accentColor = null;
        this.comments = null;
    }

}

// class cTaskList {
//     constructor() {

//     }
// };

// class cTask {
//     constructor() {

//     }
// };

// class cText {
//     constructor() {

//     }
// };

// class cImage {
//     constructor() {

//     }
// };

// class cRichText {
//     constructor() {

//     }
// };

//General Functions for windows functionalities
mouseMoveDetect();

window.onscroll = function () {
    window.scrollTo(0, 0);
};

//Draging Functions


const Main = (props) => {
    const [board, setBoard] = useState(new _Board());
    const appRef = useRef(null);

    const addSwimlane = () => {
        const newSwimlane = new _Swimlane();

        const tempBoard = { ...board };
        tempBoard.swimlanes = [...tempBoard.swimlanes, newSwimlane];

        setBoard(tempBoard);
    };

    const addColumn = (swimlaneId) => {
        const tempBoard = { ...board };
        console.log(swimlaneId + '==>' + JSON.stringify(tempBoard));

        const sIndex = tempBoard.swimlanes.findIndex((s) => s.id === swimlaneId);
        if (sIndex > -1){
            const swimlane = tempBoard.swimlanes.splice(sIndex, 1)[0];

            const column = new _Column(swimlaneId);

            swimlane.columns = [...swimlane.columns, column];

            tempBoard.swimlanes.splice(sIndex, 0, swimlane);

            setBoard(tempBoard);
        } else console.log('undefined Swimlane: ' + swimlaneId);
    };

    const addCard = (swimlaneId, columnId) => {
        const tempBoard = { ...board };

        const sIndex = tempBoard.swimlanes.findIndex((s) => s.id === swimlaneId);
        if (sIndex > -1){
            const swimlane = tempBoard.swimlanes.splice(sIndex, 1)[0];

            const cIndex = swimlane.columns.findIndex((c) => c.id === columnId);
            if (cIndex > -1){
                const column = swimlane.columns.splice(cIndex, 1)[0];

                column.cards = [...column.cards, new _Card(columnId)];

                swimlane.columns.splice(cIndex, 0, column);
                tempBoard.swimlanes.splice(sIndex, 0, swimlane);

                setBoard(tempBoard);
            } else console.log('undefined column: ' + columnId);
        } else console.log('undefined Swimlane: ' + swimlaneId);
    };

    const updateColumn = (swimlaneId, columnId, newProps) => {
        const tempBoard = { ...board };
        console.log(swimlaneId +'-'+ columnId);
        console.log(newProps);
        const sIndex = tempBoard.swimlanes.findIndex((s) => s.id === swimlaneId);
        if (sIndex > -1){
            const swimlane = tempBoard.swimlanes.splice(sIndex, 1)[0];

            let cIndex = swimlane.columns.findIndex((c) => c.id === columnId);
            if (cIndex > -1){
                const column = swimlane.columns.splice(cIndex, 1)[0];
                console.log(column.toDelete);

                newProps.map((prop) => {
                    column[prop.property] = prop.newValue;
                    if (prop.property === 'editing' && prop.newValue === true) column.originalColumn = { ...column };
                });

                if (!column.toDelete){
                    if (column.cancelChanges){
                        column.title = column.originalColumn.title;
                        column.originalColumn = {};
                        column.cancelChanges = false;
                    }

                    if (column.moveColumnBy !== 0 && (((cIndex + column.moveColumnBy) >= 0) && ((cIndex + column.moveColumnBy) <= swimlane.columns.length))){
                        //If moveColumnBy is required
                        cIndex += column.moveColumnBy;
                        column.moveColumnBy = 0;
                    }

                    // eslint-disable-next-line no-constant-condition
                    if (true){
                        //If moveSwimlaneBy is required
                    }

                    swimlane.columns.splice(cIndex, 0, column);
                }
                tempBoard.swimlanes.splice(sIndex, 0, swimlane);

                setBoard(tempBoard);
            } else console.log('undefined column: ' + columnId);
        } else console.log('undefined Swimlane: ' + swimlaneId);
    };

    const onDragEndCards = (result, columns, setColumns) => {
        if (!result.destination) {
            return;
        }
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            let tempColumns = [...columns];

            const sourceIndex = tempColumns.findIndex((c) => c.id === source.droppableId);
            let sourceColumn = tempColumns.splice(sourceIndex, 1)[0];

            const destIndex = tempColumns.findIndex((c) => c.id === destination.droppableId);
            let destColumn = tempColumns.splice(destIndex, 1)[0];

            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);

            sourceColumn = { ...sourceColumn, items: sourceItems };
            destColumn = { ...destColumn, items: destItems };

            tempColumns = [...tempColumns, sourceColumn, destColumn];
            tempColumns.sort((a, b) => a.position - b.position);

            setColumns(tempColumns);

        } else {
            let tempColumns = [...columns];

            const cIndex = tempColumns.findIndex((c) => c.id === source.droppableId);
            let column = tempColumns.splice(cIndex, 1)[0];

            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);

            column = { ...column, items: copiedItems };

            tempColumns = [...tempColumns, column];
            tempColumns.sort((a, b) => a.position - b.position);

            setColumns(tempColumns);
        }
    };

    const callResizeUpdate = (appWidth, appHeight) => {
        ipc.send('ResizeMainWindow', [appWidth, appHeight]);
    };

    useEffect(() => { //Initial Render load Data
        addSwimlane();
    }, []);

    useEffect(() => {
        const appHeight = appRef.current.offsetHeight;
        const appWidth = appRef.current.offsetWidth;
        callResizeUpdate(appWidth, appHeight);
    }, [appRef, board]);

    const functions = {
        'addSwimlane': () => addSwimlane(),
        'addColumn': (swimlaneId) => addColumn(swimlaneId),
        'addCard': (swimlaneId, columnId) => addCard(swimlaneId, columnId),
        'updateColumn': (swimlaneId, columnId, newprops) => updateColumn(swimlaneId, columnId, newprops)
    };

    return (
        <div className="App" ref={appRef}>
            {
                board.swimlanes.map(
                    (sl, index) => (
                        <Swimlane functions={functions} swimlane={sl} key={index}></Swimlane>
                    )
                )
            }
        </div>
    );
};

export default Main;