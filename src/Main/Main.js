import React, { useEffect, useState, useRef } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { MouseMoveDetect } from '../scripts/ElectronClickThrough';

import './Main.css';

import Column from './components/Column';

import { AiOutlinePlus } from 'react-icons/ai';

const electron = window.require('electron');
const remote = electron.remote;
const ipc = window.require('electron').ipcRenderer;

const { v4: uuidv4 } = require('uuid');

//General Functions for windows functionalities
MouseMoveDetect();

window.onscroll = function () {
    window.scrollTo(0, 0);
};

//Draging Functions
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

//Kaban Board Functions
const AddColumn = (columns, setColumns) => {
    const newColumnTemplate = {
        title: "Test Column",
        items: [],
        editing: true
    };
    let tempColumns = {...columns};
    tempColumns[uuidv4()] = newColumnTemplate;
    setColumns(tempColumns);
};

const UpdateColumn = (key, updatedColumn, columns, setColumns) => {
    let tempColumns = {...columns};
    const items = tempColumns[key].items;
    tempColumns[key] = updatedColumn;
    console.log(tempColumns);
    console.log(items);
    tempColumns[key].items = items;
    tempColumns[key].editing = false;

    setColumns(tempColumns);
};

const AddItem = (columnKey, columns, setColumns) => {
    console.log("Adding to..." + columnKey)
    const newItemTemplate = { 
        id: uuidv4(),
        category: '1',
        content: "", 
        priority: "High", 
        title: "xcvbdf", 
        tags: ["Test", "New"] };
    let tempColumns = {...columns};
    tempColumns[columnKey].items.push(newItemTemplate);
    setColumns(tempColumns);
};



const Main = (props) => {
    const GetInitialData = () => {       
        ipc.invoke('GetInitialData', null).then((result) => {
            let columns = {...result[0]};
            const items = [...result[1]];

            columns = calculateColumns(columns, items);
            setColumns(columns);
        });
    }
    
    const calculateColumns = (columns = [], _items = []) => {
        if (columns.length === 0) return;

        if (_items.length > 0) {
            Object.entries(columns).forEach(([key]) => {
                    columns[key].items = Array.from(_items.filter(item => item.category === key))
                });
        }

        return columns;
    };

    const [columns, setColumns] = useState([]);

    const columnsRef = useRef(null);
    const columnsAddRef = useRef(null);

    const CallResizeUpdate = (appHeight, appWidth) => {
        ipc.send('ResizeMainWindow', [appWidth, appHeight]);
    };

    useEffect(() => { //Initial Render load Data
        GetInitialData();
      }, []);

    useEffect(() => {
        const appHeight = columnsRef.current.offsetHeight;
        const appWidth = columnsRef.current.offsetWidth + columnsAddRef.current.offsetWidth;
        CallResizeUpdate(appHeight, appWidth);
    }, [columnsRef, columnsAddRef, columns]);

    return (
        <div className="App" >
            <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
                <div className="columns" ref={columnsRef}>
                    {columns ? Object.entries(columns).map(([columnId, column], index) => {
                        return (
                            <Column columnId={columnId} column={column} key={index} addItem={() => AddItem(columnId, columns, setColumns)} updateColumn={(updatedColumn) => UpdateColumn(columnId, updatedColumn, columns, setColumns)} />
                        );
                    }):null}
                </div>
                <div className="columns_add" ref={columnsAddRef}>
                    <a className="add-icon add-icon_column" onClick={() => AddColumn(columns, setColumns)} >
                        <AiOutlinePlus />
                    </a>
                </div>
            </DragDropContext>
        </div>
    );
};

export default Main;