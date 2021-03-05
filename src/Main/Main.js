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
        let tempColumns = [...columns];

        const sourceIndex = tempColumns.findIndex((c) => c.id === source.droppableId);
        let sourceColumn = tempColumns.splice(sourceIndex, 1)[0];

        const destIndex = tempColumns.findIndex((c) => c.id === destination.droppableId);
        let destColumn = tempColumns.splice(destIndex, 1)[0];
        
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);

        sourceColumn = {...sourceColumn, items: sourceItems};
        destColumn = {...destColumn, items: destItems};
        
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
        
        column = {...column, items: copiedItems};

        tempColumns = [...tempColumns, column];
        tempColumns.sort((a, b) => a.position - b.position); 

        setColumns(tempColumns);
    }
};

//Kaban Board Functions
const AddColumn = (columns, setColumns) => {
    let tempColumns = [...columns];
    const columnsCount = tempColumns.length;

    const newColumnTemplate = {
        id: uuidv4(),
        title: "",
        position: columnsCount, //zero-based
        items: [],
        editing: true,
        moveColumnBy: 0,
        toDelete: false,
        cancelChanges: false,
        originalColumn: {}
    };
    tempColumns.push(newColumnTemplate);
    tempColumns.sort((a, b) => a.position - b.position); 
    setColumns(tempColumns);
};

const UpdateColumn = (newProps, key, columns, setColumns) => {
    let tempColumns = [...columns];

    const cIndex = tempColumns.findIndex((c) => c.id === key);
    let column = tempColumns.splice(cIndex, 1)[0];
    
    const items = [...column.items];

    newProps.map((prop) => {
        column[prop.property] = prop.newValue;
        if (prop.property === "editing" && prop.newValue === true) column.originalColumn = {...column};
    });

    if (column.cancelChanges){
        column.title = column.originalColumn.title;
        column.originalColumn = {};
        column.cancelChanges = false;
    }
    

    if (!column.toDelete){
        if  (
                column.moveColumnBy != 0 
                && 
                (((column.position + column.moveColumnBy) >= 0) && ((column.position + column.moveColumnBy) <= tempColumns.length))  
            ){
            
            let columnToMoveIndex = tempColumns.findIndex((c) => c.position === (column.position + column.moveColumnBy))
            let columnToMove = tempColumns.splice(columnToMoveIndex, 1)[0];
            columnToMove.position -= column.moveColumnBy;

            column.position += column.moveColumnBy;
            column.moveColumnBy = 0;

            tempColumns = [...tempColumns, columnToMove]
        }

        tempColumns = [...tempColumns, column]
    }

    tempColumns.sort((a, b) => a.position - b.position); 
    setColumns(tempColumns);
};

const AddItem = (key, columns, setColumns) => {
    const newItemTemplate = { 
        id: uuidv4(),
        category: '1',
        content: "", 
        priority: "High", 
        title: "" + Math.random() *1000 + "", 
        tags: ["Test", "New"] };
    let tempColumns = [...columns];

    const cIndex = tempColumns.findIndex((c) => c.id === key);
    let column = tempColumns.splice(cIndex, 1)[0];

    column.items.push(newItemTemplate);
    tempColumns = [...tempColumns, column]

    tempColumns.sort((a, b) => a.position - b.position); 
    setColumns(tempColumns);
};

const Main = (props) => {
    const [columns, setColumns] = useState([]);

    const columnsRef = useRef(null);
    const columnsAddRef = useRef(null);

    const GetInitialData = () => {       
        ipc.invoke('GetInitialData', null).then((result) => {
            let tempColumns = result[0];
            const tempItems = result[1];

            tempColumns = calculateColumns(tempColumns, tempItems);

            setColumns(tempColumns);
        });
    }
    
    const calculateColumns = (_columns = [], _items = []) => {
        if (_columns.length === 0) return _columns;

        if (_items.length > 0) {
            Object.entries(_columns).forEach(([key]) => {
                _columns[key].items = Array.from(_items.filter(item => item.category === key))
                });
        }

        return _columns;
    };

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
                    {columns ? columns.map((column, index) => {
                        return (
                            <Column columnId={column.id} column={column} key={index} addItem={() => AddItem(column.id, columns, setColumns)} updateColumn={(newProps = []) => UpdateColumn(newProps, column.id, columns, setColumns)} />
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