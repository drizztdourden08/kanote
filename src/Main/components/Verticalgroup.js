import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import { AiOutlineInsertRowAbove } from 'react-icons/ai';

const VerticalGroup = (props) => {
    return (
        <Draggable key={props.verticalgroup.id} draggableId={props.verticalgroup.id} index={props.index} >
            {(DragProvided) => (
                <div className="verticalgroup"
                    {...DragProvided.draggableProps}
                    ref={DragProvided.innerRef}
                    {...DragProvided.dragHandleProps}
                >
                    <div className="verticalgroup-childrens">
                        <Droppable droppableId={props.verticalgroup.id} isDropDisabled={!(['_Swimlane'].includes(props.dragType) && props.dragType.parentType === '_Verticalgroup')}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={snapshot.isDraggingOver ? '' : ''}
                                >
                                    {props.verticalgroup.childrens ?
                                        props.verticalgroup.childrens.array.map((children, index) => props.functions.renderSwitch(children, index, props.dragType))
                                        : null}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                    <div className="buttons_container buttons_container-bottom">
                        <button className="add-icon add-icon_column" onClick={() => props.functions.addItem('_Swimlane', props.verticalgroup.id)} >
                            <AiOutlineInsertRowAbove />
                        </button>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default VerticalGroup;