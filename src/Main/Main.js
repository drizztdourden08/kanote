import React, { useEffect, useState, useRef } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import { MouseMoveDetect } from '../scripts/ElectronClickThrough';

import './Main.css';

import Column from './components/Column';

import { AiOutlinePlus } from 'react-icons/ai';

MouseMoveDetect();


const electron = window.require('electron');
const remote = electron.remote;

var screen = remote.screen;
var mainScreen = screen.getPrimaryDisplay()
const dimensions = mainScreen.size;
const screenWidth = dimensions.width;

const { v4: uuidv4 } = require('uuid');

const ipc = window.require('electron').ipcRenderer;

window.onscroll = function () {
    window.scrollTo(0, 0);
};

const itemsFromBackend = [
    { id: uuidv4(), content: "", priority: "High", title: "Correct Err:35", tags: ["Code", "Table"] },
    { id: uuidv4(), content: "", priority: "Medium", title: "Test", tags: ["Plan", "Testing"] },
    { id: uuidv4(), content: "", priority: "Low", title: "Add items", tags: ["Content", "Team 3"] },
    { id: uuidv4(), content: "", priority: "High", title: "fix Drag Bug", tags: ["UI"] },
    { id: uuidv4(), content: "", priority: "High", title: "Improve performance", tags: ["Code", "Performance"] }
];

const columnsFromBackend = {
    [uuidv4()]: {
        title: "To do",
        items: itemsFromBackend
    },
    [uuidv4()]: {
        title: "In Progress",
        items: []
    },
    [uuidv4()]: {
        title: "Done",
        items: []
    }
};

const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) {
        return;
    }
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);
        setColumns({
            ...columns,
            [source.droppableId]: {
                ...sourceColumn,
                items: sourceItems
            },
            [destination.droppableId]: {
                ...destColumn,
                items: destItems
            }
        });
    } else {
        const column = columns[source.droppableId];
        const copiedItems = [...column.items];
        const [removed] = copiedItems.splice(source.index, 1);
        copiedItems.splice(destination.index, 0, removed);
        setColumns({
            ...columns,
            [source.droppableId]: {
                ...column,
                items: copiedItems
            }
        });
    }
};

const Main = (props) => {
    const [columns, setColumns] = useState(columnsFromBackend);
    const columnsRef = useRef(null);
    const columnsAddRef = useRef(null);

    const CallResizeUpdate = (appHeight, appWidth) => {
        const columnCount = Object.keys(columns).length;;
        let maxRow = 0;

        Object.entries(columns).forEach(
            ([key, column]) => maxRow = Math.max(maxRow, column.items.length)
        );

        ipc.send('ResizeMainWindow', [appWidth, appHeight]);
    };

    useEffect(() => {
        const appHeight = columnsRef.current.offsetHeight;
        const appWidth = columnsRef.current.offsetWidth + columnsAddRef.current.offsetWidth;
        CallResizeUpdate(appHeight, appWidth);
    }, [columnsRef, columnsAddRef, columns]);

    return (
        <div className="App" >
            <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
                <div className="columns" ref={columnsRef}>
                    {Object.entries(columns).map(([columnId, column], index) => {
                        return (
                            <Column columnId={columnId} column={column} key={index} />
                        );
                    })}
                </div>
                <div className="columns_add" ref={columnsAddRef}>
                    <a className="add-icon add-icon_column">
                        <AiOutlinePlus />
                    </a>
                </div>
            </DragDropContext>
        </div>
    );
};

export default Main;