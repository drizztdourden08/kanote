import React, { useState } from 'react';
import { Droppable } from "react-beautiful-dnd";

import Card from './Card';

import './css/Column.css';

import { BiDotsVerticalRounded, BiCheck } from 'react-icons/bi';
import { AiOutlinePlus } from 'react-icons/ai';
import { RiCheckboxCircleLine, RiCloseCircleLine } from 'react-icons/ri';

const Column = (props) => {
    const [column, setColumn] = useState(props.column);

    const updateColumn = (newProps = []) => {
        let tempColumn = {...column};
        newProps.map((prop) => {
            console.log(prop);
            tempColumn[prop.property] = prop.newValue;
        })
        setColumn(tempColumn);
    };

    console.log(column);

    return (
        <div className="column" key={props.columnId}>
                {
                    column.editing===false
                    ?
                        <div className="column_title">
                            <span>{column.title}</span>
                            <div className="icons">
                                <a className="modify-button" onClick={() => updateColumn([{"property": "editing", "newValue": !column.editing}])}><BiDotsVerticalRounded /></a>
                            </div>
                        </div>
                    :
                        <div className="column_title">
                            <span><input type="text" value={column.title} onChange={event => updateColumn([{"property": "title", "newValue": event.target.value}])}/></span>
                            <div className="icons">
                                <a className="cancel-button" onClick={() => updateColumn([{"property": "title", "newValue": props.column.title}, {"property": "editing", "newValue": !column.editing}])}><RiCloseCircleLine /></a>
                                <a className="accept-button" onClick={() => props.updateColumn(column)}><RiCheckboxCircleLine /></a>
                            </div>
                        </div>
                }
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