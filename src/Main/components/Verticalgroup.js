import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import { AiOutlineInsertRowAbove } from 'react-icons/ai';
import { RiLayoutRowLine } from 'react-icons/ri';

const VerticalGroup = (props) => {
    return (
        <Draggable key={props.verticalgroup.id} draggableId={props.verticalgroup.id} index={props.index} >
            {(DragProvided) => (
                <div className="verticalgroup"
                    {...DragProvided.draggableProps}
                    ref={DragProvided.innerRef}
                >
                    <div {...DragProvided.dragHandleProps} className="verticalgroup-icon"><RiLayoutRowLine /></div>
                    <Droppable droppableId={props.verticalgroup.id} isDropDisabled={props.isDropDisabled.verticalgroup}>
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={snapshot.isDraggingOver ? 'verticalgroup-childrens column-visible' : 'verticalgroup-childrens'}
                            >
                                {props.verticalgroup.childrens ?
                                    props.verticalgroup.childrens.array.map((children, index) => props.functions.renderSwitch(children, index, props.isDropDisabled, props.verticalgroup.id))
                                    : null}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
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