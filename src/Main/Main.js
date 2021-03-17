import React, { useEffect, useState, useRef } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import { mouseMoveDetect } from '../scripts/ElectronClickThrough';
import { dateAdd } from '../scripts/DateTime';

import './Main.css';

import Swimlane from './components/Swimlane';
import './components/css/Swimlane.css';
import { MdNetworkWifi } from 'react-icons/md';
import { Switch } from 'react-router';

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
        this.title = 'Swinlane ' + Math.floor(Math.random() * Math.floor(100))  + '';
        this.columns = [];
    }
}

class _Column {
    constructor(swimlaneId) {
        this.id = uuidv4();
        this.swimlaneId = swimlaneId;
        this.title = 'Column ' + Math.floor(Math.random() * Math.floor(100))  + '';
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
        this.title = 'Card ' + Math.floor(Math.random() * Math.floor(100))  + '';
        this.priority = new _Priority();
        this.image = [
            'https://www.talkwalker.com/images/2020/blog-headers/image-analysis.png',
            'https://seeklogo.com/images/P/pepsi-vertical-logo-72846897FF-seeklogo.com.png',
            'https://www.projecttopics.org/wp-content/uploads/2017/09/abstract-140898_1280.jpg',
            'http://artist.com/art-recognition-and-education/wp-content/themes/artist-blog/media-files/2016/05/abstract-6.jpg',
            'https://i.icanvas.com/list-hero/abstract-landscapes-1.jpg',
            'https://www.fyimusicnews.ca/sites/default/files/media-beat-large.jpg',
            'http://2015.holocaustremembrance.com/sites/default/files/field/image/social_media_strategy111.jpg',
            'https://cdn.arstechnica.net/wp-content/uploads/2016/02/5718897981_10faa45ac3_b-640x624.jpg',
            'https://teeltechcanada.com/2015/wp-content/uploads/2017/08/cyber-security-banner-red.jpg',
            'https://thumbs.dreamstime.com/b/abstract-red-grey-tech-geometric-banner-design-vector-web-header-corporate-background-101610481.jpg',
            null, null, null, null
        ][Math.floor(Math.random() * Math.floor(14))];
        this.tags = ['task', 'beamed'];
        this.content = [new cTaskList()].splice(Math.floor(Math.random() * Math.floor(1)), Math.round(Math.random()));
        this.timing = {
            created: Date.now(),
            dueDate: dateAdd(this.created, 'minute', 5),
            timeLeft: this.dueDate - this.created,
            breached: this.timeLeft > 0 ? false:true
        };
        this.notification = false;
        this.assignees = [new _Assignee(), new _Assignee(), new _Assignee(), new _Assignee(), new _Assignee(), new _Assignee(), new _Assignee(), new _Assignee()];
        this.accentColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        this.comments = [];
        this.editing = false;
        this.moveColumnBy = 0;
        this.moveSwimlaneBy = 0;
        this.toDelete = false;
        this.cancelChanges = false;
        this.originalCard = {};
    }
}

class _Priority {
    constructor() {
        this.id = uuidv4();
        this.title = ['High', 'Medium', 'Low'][Math.floor(Math.random() * Math.floor(3))];
        this.color = '#' + Math.floor(Math.random()*16777215).toString(16);
        this.level = Math.floor(Math.random() * Math.floor(10));
    }
}

class _Assignee {
    constructor() {
        this.id = uuidv4();
        this.firstName = ['Johnny', 'Chris', 'Alain', 'Sam', 'Kim'][Math.floor(Math.random() * Math.floor(5))];
        this.lastName = ['Prescott', 'Paris', 'Janeway', 'Tremblay', 'Turilli'][Math.floor(Math.random() * Math.floor(5))];
        this.initial = this.firstName[0] + this.lastName[0];
        this.color = '#' + Math.floor(Math.random()*16777215).toString(16);
    }
}

class cTaskList {
    constructor() {
        this.id = uuidv4();
        this.title = 'Tasklist ' + Math.floor(Math.random() * Math.floor(10));
        this.tasks = [new cTask(), new cTask(), new cTask(), new cTask(), new cTask()].slice(0, Math.floor(Math.random() * Math.floor(4)));
    }
}

class cTask {
    constructor(parentTaskId) {
        this.id = uuidv4();
        this.parentTaskId = parentTaskId;
        this.title = 'task ' + Math.floor(Math.random() * Math.floor(10));
        this.checked = Math.random() < 0.5;
        this.tasks = [];
    }
}

// class cImage {
//     constructor() {

//     }
// };

// class cText {
//     constructor() {

//     }
// };

// class cMarkdownText {
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

const Main = (props) => {
    const [board, setBoard] = useState(new _Board());
    const appRef = useRef(null);

    const addSwimlane = (sIndex) => {
        const newSwimlane = new _Swimlane();
        const tempBoard = { ...board };
        tempBoard.swimlanes.splice(sIndex + 1, 0, newSwimlane);

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

        let sourceSwimlane = null;
        let sourceColumn = null;
        let sourceCard = null;
        let targetSwimlane = null;
        let targetColumn = null;

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
                                //reconstruct source
                                sourceSwimlane.columns.splice(csIndex, 0, sourceColumn);
                                tempBoard.swimlanes.splice(ssIndex, 0, sourceSwimlane);

                                const stIndex = tempBoard.swimlanes.findIndex((s) => s.id === targetSwimlaneId);
                                if (stIndex > -1){
                                    targetSwimlane = tempBoard.swimlanes.splice(stIndex, 1)[0];

                                    const ctIndex = targetSwimlane.columns.findIndex((c) => c.id === targetColumnId);
                                    if (ctIndex > -1){
                                        //reconstruct target
                                        targetColumn = targetSwimlane.columns.splice(ctIndex, 1)[0];

                                        targetColumn.cards.splice(targetIndex, 0, sourceCard);
                                        targetSwimlane.columns.splice(ctIndex, 0, targetColumn);
                                        tempBoard.swimlanes.splice(stIndex, 0, targetSwimlane);
                                    }
                                }
                            } else {
                                sourceSwimlane.columns.splice(csIndex, 0, sourceColumn);

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

    const returnContentElement = (contentElement, cIndex) => {
        let element;
        switch (contentElement.constructor.name) {
            case 'cTaskList':{
                const list = [];
                contentElement.tasks.map((task, index) => {
                    list.push(
                        <div className="task" key={index}>
                            <input type="checkbox" id={task.title} name={task.title} value={task.title} checked={task.checked}/>
                            <label htmlFor={task.title}>{task.title}</label>
                        </div>
                    );
                });

                element = (
                    <div className="tasklist" key={cIndex}>
                        <h2 className="title">{contentElement.title}</h2>
                        <div className="tasks-container">{list}</div>
                    </div>
                );
            }
                break;
            default:
                break;
        }
        return element;
    };

    const callResizeUpdate = (appWidth, appHeight) => {
        ipc.send('ResizeMainWindow', [appWidth, appHeight]);
    };

    useEffect(() => { //Initial Render load Data
        if (board.swimlanes.length === 0) addSwimlane();
    }, []);

    useEffect(() => {
        const appHeight = appRef.current.offsetHeight;
        const appWidth = appRef.current.offsetWidth;
        callResizeUpdate(appWidth, appHeight);
    }, [appRef, board]);

    const functions = {
        'addSwimlane': (sindex) => addSwimlane(sindex),
        'addColumn': (swimlaneId) => addColumn(swimlaneId),
        'addCard': (swimlaneId, columnId) => addCard(swimlaneId, columnId),
        'updateColumn': (swimlaneId, columnId, newprops) => updateColumn(swimlaneId, columnId, newprops),
        'returnContentElement': (contentElement, cIndex) => returnContentElement(contentElement, cIndex)
    };

    return (
        <div className="App" ref={appRef}>
            <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                {
                    board.swimlanes.map(
                        (sl, index) => (
                            <Swimlane functions={functions} swimlane={sl} key={index} index={index}></Swimlane>
                        )
                    )
                }
            </DragDropContext>
        </div>
    );
};

export default Main;