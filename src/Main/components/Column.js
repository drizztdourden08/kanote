import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import Card from './Card';

import './css/Column.css';

import { BiDotsVerticalRounded } from 'react-icons/bi';
import { AiOutlinePlus } from 'react-icons/ai';
import { RiCheckboxCircleLine, RiCloseCircleLine, RiArrowLeftCircleLine, RiArrowRightCircleLine } from 'react-icons/ri';
import { MdDeleteForever } from 'react-icons/md';

const Column = (props) => {
    return (
        <div className="column" key={props.column.id}>
            <div className="column_title">
                {
                    props.column.editing===false
                        ?
                        <div>
                            <div>
                                <span>{props.column.title}</span>
                                <div>
                                    <button className="standard-button" onClick={() => props.functions.updateColumn(props.column.swimlaneId, props.column.id, [{ 'property': 'editing', 'newValue': !props.column.editing }])}><BiDotsVerticalRounded /></button>
                                </div>
                            </div>
                        </div>

                        :
                        <div>
                            <div>
                                <span><input type="text" value={props.column.title} onChange={event => props.functions.updateColumn(props.column.swimlaneId, props.column.id, [{ 'property': 'title', 'newValue': event.target.value }])}/></span>
                                <div>
                                    <button className="cancel-button" onClick={() => props.functions.updateColumn(props.column.swimlaneId, props.column.id, [{ 'property': 'cancelChanges', 'newValue': true }, { 'property': 'editing', 'newValue': !props.column.editing }])}><RiCloseCircleLine /></button>
                                    <button className="accept-button" onClick={() => props.functions.updateColumn(props.column.swimlaneId, props.column.id, [{ 'property': 'title', 'newValue': props.column.title }, { 'property': 'editing', 'newValue': !props.column.editing }])}><RiCheckboxCircleLine /></button>
                                </div>
                            </div>
                            <div>
                                <button className="standard-button" onClick={() => props.functions.updateColumn(props.column.swimlaneId, props.column.id, [{ 'property': 'moveColumnBy', 'newValue': -1 }])}><RiArrowLeftCircleLine /></button>
                                <button className="standard-button" onClick={() => props.functions.updateColumn(props.column.swimlaneId, props.column.id, [{ 'property': 'toDelete', 'newValue': true }])}><MdDeleteForever /></button>
                                <button className="standard-button" onClick={() => props.functions.updateColumn(props.column.swimlaneId, props.column.id, [{ 'property': 'moveColumnBy', 'newValue': 1 }])}><RiArrowRightCircleLine /></button>
                            </div>
                        </div>
                }
            </div>
            <button className="add-icon add-icon_card" onClick={() => props.functions.addCard(props.column.swimlaneId, props.column.id)}>
                <AiOutlinePlus />
            </button>
            <div className="column_cards">
                <Droppable droppableId={props.column.id} type="CARD">
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={snapshot.isDraggingOver ? 'column-visible' : ''}
                        >
                            {props.column.cards ? props.column.cards.map((c, index) => (<Card card={c} key={index} index={index} />)) : null}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </div>
    );
};

export default Column;