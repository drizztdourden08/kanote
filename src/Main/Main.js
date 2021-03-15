import React, { useEffect, useState, useRef } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

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

        const sIndex = tempBoard.swimlanes.findIndex((s) => s.id === swimlaneId);
        if (sIndex > -1){
            const swimlane = tempBoard.swimlanes.splice(sIndex, 1)[0];

            let cIndex = swimlane.columns.findIndex((c) => c.id === columnId);
            if (cIndex > -1){
                const column = swimlane.columns.splice(cIndex, 1)[0];

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

    const updateCard = (swimlaneId, columnId, newProps) => {

    };

    const moveColumn = (sourceSwimlaneId, targetSwimlaneId, sourceColumnId = null, targetColumnId = null, sourceCardId = null, sourceIndex = null, targetIndex = null) => {

    };

    const moveCard = (sourceSwimlaneId, targetSwimlaneId, sourceColumnId = null, targetColumnId = null, sourceIndex = null, targetIndex = null) => {
        const tempBoard = { ...board };
        console.log('moving card');
        let sourceSwimlane = null;
        let sourceColumn = null;
        let sourceCard = null;
        let targetSwimlane = null;
        let targetColumn = null;

        console.log(tempBoard);

        //GET SOURCES
        const ssIndex = tempBoard.swimlanes.findIndex((s) => s.id === sourceSwimlaneId);
        if (ssIndex > -1){
            sourceSwimlane = tempBoard.swimlanes.splice(ssIndex, 1)[0];
            if (sourceColumnId !== null){
                const csIndex = sourceSwimlane.columns.findIndex((c) => c.id === sourceColumnId);
                if (csIndex > -1){
                    sourceColumn = sourceSwimlane.columns.splice(csIndex, 1)[0];
                    if (sourceIndex > -1){
                        sourceCard = sourceColumn.cards.splice(sourceIndex, 1)[0];

                        //GET TARGETS
                        if (sourceColumnId !== targetColumnId){

                            if (sourceSwimlaneId !== targetSwimlaneId){
                                const stIndex = tempBoard.swimlanes.findIndex((s) => s.id === targetSwimlaneId);
                                if (stIndex > -1){
                                    targetSwimlane = tempBoard.swimlanes.splice(stIndex, 1)[0];

                                    const ctIndex = targetSwimlane.columns.findIndex((c) => c.id === targetColumnId);
                                    if (ctIndex > -1){
                                        //reconstruct source
                                        sourceSwimlane.columns.splice(csIndex, 0, sourceColumn);
                                        tempBoard.swimlanes.splice(ssIndex, 0, sourceSwimlane);

                                        //reconstruct target
                                        targetColumn = targetSwimlane.columns.splice(ctIndex, 1)[0];

                                        targetColumn.cards.splice(targetIndex, 0, sourceCard);
                                        targetSwimlane.columns.splice(ctIndex, 0, targetColumn);
                                        tempBoard.swimlanes.splice(stIndex, 0, targetSwimlane);
                                    }
                                }
                            } else {
                                sourceSwimlane.columns.splice(csIndex, 0, sourceColumn);

                                console.log('10');
                                const ctIndex = sourceSwimlane.columns.findIndex((c) => c.id === targetColumnId);
                                if (ctIndex > -1){

                                    targetColumn = sourceSwimlane.columns.splice(ctIndex, 1)[0];

                                    //reconstruct target
                                    targetColumn.cards.splice(targetIndex, 0, sourceCard);

                                    sourceSwimlane.columns.splice(ctIndex, 0, targetColumn);

                                    tempBoard.swimlanes.splice(ssIndex, 0, sourceSwimlane);

                                }
                            }
                        } else {
                            //reconstruct source
                            console.log('10');
                            sourceColumn.cards.splice(targetIndex, 0, sourceCard);
                            sourceSwimlane.columns.splice(csIndex, 0, sourceColumn);
                            tempBoard.swimlanes.splice(ssIndex, 0, sourceSwimlane);
                        }
                    }
                }
            }
        }

        setBoard(tempBoard);
    };

    const getParentId = (sourceType, id) => {
        const tempboard = { ...board };

        let parentId = null;

        switch (sourceType) {
            case 'CARD':{
                tempboard.swimlanes.forEach((sl) => {
                    sl.columns.forEach((c) => {
                        c.cards.forEach((ca) => {
                            if (ca.id === id) {
                                parentId = c.id;
                            }
                        });
                    });
                });
                break;
            }
            case 'COLUMN':{
                tempboard.swimlanes.forEach((sl) => {
                    sl.columns.forEach((c) => {
                        if (c.id === id) {
                            parentId = sl.id;
                        }
                    });
                });
                break;
            }
            default:
                break;
        }

        return parentId;
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const { source, destination } = result;
        console.log(result);
        switch (result.type) {
            case 'CARD':{
                const sourceSwimlaneId = getParentId('COLUMN', source.droppableId);
                const targetSwimlaneId = getParentId('COLUMN', destination.droppableId);
                moveCard(sourceSwimlaneId, targetSwimlaneId, source.droppableId, destination.droppableId, source.index, destination.index);
                break;
            }

            default:
                break;
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
        console.log('rendered');
    }, [appRef, board]);

    const functions = {
        'addSwimlane': () => addSwimlane(),
        'addColumn': (swimlaneId) => addColumn(swimlaneId),
        'addCard': (swimlaneId, columnId) => addCard(swimlaneId, columnId),
        'updateColumn': (swimlaneId, columnId, newprops) => updateColumn(swimlaneId, columnId, newprops)
    };

    return (
        <div className="App" ref={appRef}>
            <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                {
                    board.swimlanes.map(
                        (sl, index) => (
                            <Swimlane functions={functions} swimlane={sl} key={index}></Swimlane>
                        )
                    )
                }
            </DragDropContext>
        </div>
    );
};

export default Main;