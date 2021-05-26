import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import Column from './Column';
import './css/Column.css';

import { AiOutlinePlus, AiOutlineInsertRowRight, AiOutlineInsertRowAbove } from 'react-icons/ai';

const Swimlane = (props) => {
    return (
        <Draggable key={props.swimlane.id} draggableId={props.swimlane.id} index={props.index} >
            {(DragProvided) => (
                <div className="swimlane"
                    {...DragProvided.draggableProps}
                    ref={DragProvided.innerRef}
                >
                    <div {...DragProvided.dragHandleProps} className="swimlane_title">
                        <span>{props.swimlane.title}</span>
                    </div>
                    <div className="swimlane-content">
                        <Droppable droppableId={props.swimlane.id} direction="horizontal" isDropDisabled={!(['_Column'].includes(props.dragType) && props.dragType.parentType === '_Swimlane')}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={snapshot.isDraggingOver ? 'swimlane-childrens column-visible' : 'swimlane-childrens'}
                                >
                                    {props.swimlane.childrens ?
                                        props.swimlane.childrens.array.map((children, index) => props.functions.renderSwitch(children, index, props.dragType))
                                        :null}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <div className="buttons_container buttons_container-right">
                            <button className="add-icon add-icon_column" onClick={() => props.functions.addItem('_Column', props.swimlane.id)} >
                                <AiOutlineInsertRowRight />
                            </button>
                            <button className="add-icon add-icon_column" onClick={() => props.functions.addItem('_Swimlane',props.swimlane.id)} >
                                <AiOutlineInsertRowAbove />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default Swimlane;