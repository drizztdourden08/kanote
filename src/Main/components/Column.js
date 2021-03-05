import React, { useState, useEffect } from 'react';
import { Droppable } from "react-beautiful-dnd";

import Card from './Card';

import './css/Column.css';

import { BiDotsVerticalRounded, BiCheck } from 'react-icons/bi';
import { AiOutlinePlus } from 'react-icons/ai';
import { RiCheckboxCircleLine, RiCloseCircleLine, RiArrowLeftCircleLine, RiArrowRightCircleLine } from 'react-icons/ri';
import { MdDeleteForever } from 'react-icons/md';

const Column = (props) => {
    return (
        <div className="column" key={props.columnId}>
            <div className="column_title">
                {
                    props.column.editing===false
                    ?
                        <div>
                            <div>
                                <span>{props.column.title}</span>
                                <div>
                                    <a className="standard-button" onClick={() => props.updateColumn([{"property": "editing", "newValue": !props.column.editing}])}><BiDotsVerticalRounded /></a>
                                </div>
                            </div>
                        </div>
                        
                    :
                        <div>
                            <div>
                                <span><input type="text" value={props.column.title} onChange={event => props.updateColumn([{"property": "title", "newValue": event.target.value}])}/></span>
                                <div>
                                    <a className="cancel-button" onClick={() => props.updateColumn([{"property": "cancelChanges", "newValue": true}, {"property": "editing", "newValue": !props.column.editing}])}><RiCloseCircleLine /></a>
                                    <a className="accept-button" onClick={() => props.updateColumn([{"property": "title", "newValue": props.column.title}, {"property": "editing", "newValue": !props.column.editing}])}><RiCheckboxCircleLine /></a>
                                </div>
                            </div>
                            <div>
                                <a className="standard-button" onClick={() => props.updateColumn([{"property": "moveColumnBy", "newValue": -1}])}><RiArrowLeftCircleLine /></a>
                                <a className="standard-button" onClick={() => props.updateColumn([{"property": "toDelete", "newValue": true}])}><MdDeleteForever /></a>
                                <a className="standard-button" onClick={() => props.updateColumn([{"property": "moveColumnBy", "newValue": 1}])}><RiArrowRightCircleLine /></a>
                            </div>
                        </div>                        
                }
            </div>
            <a className="add-icon add-icon_card" onClick={props.addItem}>
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
                                {props.column.items ? props.column.items.map((item, index) => { return (<Card item={item} index={index} key={index} />); }) : null}
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