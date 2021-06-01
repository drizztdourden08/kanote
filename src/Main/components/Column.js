import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import Card from './Card';
import ExpandingButtons from './ExpandingButtons';
import './css/Column.css';

import { BiDotsVerticalRounded } from 'react-icons/bi';
import { RiCheckboxCircleLine, RiCloseCircleLine, RiArrowLeftCircleLine, RiArrowRightCircleLine } from 'react-icons/ri';
import { MdDeleteForever } from 'react-icons/md';

const Column = (props) => {
    return (
        <div className="column-wrapper">
            <Draggable key={props.column.id} draggableId={props.column.id} index={props.index} >
                {(provided) => (
                    <div
                        className="column"
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                    >
                        <div {...provided.dragHandleProps} className="column-title">
                            {
                                props.column.editing === false
                                    ?
                                    <div>
                                        <div>
                                            <img src={props.column._icon} alt="icon" />
                                            <span>{props.column.title}</span>
                                            <div>
                                                <button className="standard-button" onClick={() => props.functions.updateColumn(props.column.swimlaneId, props.column.id, [{ 'property': 'editing', 'newValue': !props.column.editing }])}><BiDotsVerticalRounded /></button>
                                            </div>
                                        </div>
                                    </div>

                                    :
                                    <div>
                                        <div>
                                            <span><input type="text" value={props.column.title} onChange={event => props.functions.updateColumn(props.column.swimlaneId, props.column.id, [{ 'property': 'title', 'newValue': event.target.value }])} /></span>
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
                        <ExpandingButtons vertical={false} alwaysOn={!props.column.childrens.array.length} buttons={['_Card']} parentId={props.column.id} addItem={props.functions.addItem} />
                        <Droppable droppableId={props.column.id} type="CARD">
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={snapshot.isDraggingOver ? 'column-childrens column-visible' : 'column-childrens'}
                                >
                                    {props.column.childrens ? props.column.childrens.array.map((c, index) => (<Card functions={props.functions} card={c} key={index} index={index} parentId={props.column.id} />)) : null}
                                    {provided.placeholder}
                                    {props.placeholderprops && snapshot.isDraggingOver && (
                                        <div
                                            className="card-placeholder"
                                            style={{
                                                top: props.placeholderprops.clientY,
                                                left: props.placeholderprops.clientX,
                                                height: props.placeholderprops.clientHeight,
                                                width: props.placeholderprops.clientWidth
                                            }}
                                        >
                                        </div>
                                    )}
                                </div>
                            )}
                        </Droppable>
                    </div>
                )}
            </Draggable>
            <ExpandingButtons vertical={true} alwaysOn={false} buttons={['_Column', '_Swimlane']} parentId={props.parentId} addItem={props.functions.addItem} insertAt={props.index + 1} />
        </div>
    );
};

export default Column;