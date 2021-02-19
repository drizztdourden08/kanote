import React from 'react';
import { Droppable } from "react-beautiful-dnd";

import Card from './Card';

import './css/Column.css';


import {IoMdAddCircle} from 'react-icons/io';

const Column = (props) => {
    return(
        <div className="column" key={props.columnId}>
            <div className="column_title">
            <span>{props.column.title}</span>
            </div>
            <div className="AddIcon">
            <IoMdAddCircle />
            </div>
            <div className="column_cards">                
                <Droppable droppableId={props.columnId}>
                {(provided, snapshot) => {
                    return (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                                background: snapshot.isDraggingOver
                                ? "lightblue"
                                : "lightgrey"
                            }}
                        >
                            {props.column.items.map((item, index) => {return (<Card item={item} index={index} key={index} />);})}
                            {provided.placeholder}
                        </div>
                    );
                  }}
                </Droppable>
            </div>
        </div>
    );
}


export default Column;