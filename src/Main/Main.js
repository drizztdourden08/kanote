import React, { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import './Main.css';

import Column from './components/Column';

const electron = window.require('electron');
const remote = electron.remote;

const mainWin = remote.getCurrentWindow();

var t

window.addEventListener('mousemove', event => {
  if (event.target === document.documentElement) {
    mainWin.setIgnoreMouseEvents(true, {forward: true})
    if (t) clearTimeout(t)
    t = setTimeout(function() {
        mainWin.setIgnoreMouseEvents(false)
    }, 150)
  } else mainWin.setIgnoreMouseEvents(false)
})

var screen = remote.screen;
var mainScreen = screen.getPrimaryDisplay()
const dimensions = mainScreen.size;
const screenWidth = dimensions.width;

const { v4: uuidv4 } = require('uuid');

const ipc = window.require('electron').ipcRenderer;

const itemsFromBackend = [
    { id: uuidv4(), content: "", priority: "High", title: "Correct Err:35", tags: ["Code", "Table"] },
    { id: uuidv4(), content: "", priority: "Medium", title: "Test", tags: ["Plan", "Testing"] },
    { id: uuidv4(), content: "", priority: "Low", title: "Add items", tags: ["Content", "Team 3"] },
    { id: uuidv4(), content: "", priority: "High", title: "fix Drag Bug", tags: ["UI"] },
    { id: uuidv4(), content: "", priority: "High", title: "Improve performance", tags: ["Code", "Performance"] }
];

window.onscroll = function() { 
    window.scrollTo(0, 0); 
}; 

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

const onDragEnd = (result, columns, setColumns, CallResizeUpdate) => {
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

    const CallResizeUpdate = (modifierRow = 1) => {
        const columnCount = Object.keys(columns).length;;
        let maxRow = 0;
        
        Object.entries(columns).forEach(
            ([key, column]) => maxRow = Math.max(maxRow, column.items.length)
        );
    
        ipc.send('ResizeMainWindow', [columnCount, maxRow + modifierRow, true]);
    };

    useEffect(() => {
        console.log("After Render change")
        CallResizeUpdate();
    }, [columns])

    return (
        <div className="App">
            <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns, CallResizeUpdate)}>
                <div className="columns">
                    {Object.entries(columns).map(([columnId, column], index) => { 
                        return(
                            <Column columnId={columnId} column={column} key={index} />
                        );
                    })}
                </div>
            </DragDropContext>
        </div>
    );
};

export default Main;