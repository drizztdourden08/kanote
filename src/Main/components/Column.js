import React from 'react';
import { Droppable } from "react-beautiful-dnd";

import Card from './Card';

import './css/Column.css';


import { AiOutlinePlus } from 'react-icons/ai';

const Column = (props) => {
    return (
        <div className="column" key={props.columnId}>
            <div className="column_title">
                <span>{props.column.title}</span>
            </div>
            <a className="add-icon add-icon_card">
                <AiOutlinePlus />
            </a>
            <div className="column_cards">
                <Droppable droppableId={props.columnId}>
                    {(provided, snapshot) => {
                        return (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={snapshot.isDraggingOver ? 'column-visible' : ''}
                            >
                                {props.column.items.map((item, index) => { return (<Card item={item} index={index} key={index} />); })}
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