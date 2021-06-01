import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import ExpandingButtons from './ExpandingButtons';

import './css/Swimlane.css';

const Swimlane = (props) => {
    return (
        <div>
            <Draggable key={props.swimlane.id} draggableId={props.swimlane.id} index={props.index} >
                {(DragProvided) => (
                    <div className="swimlane"
                        {...DragProvided.draggableProps}
                        ref={DragProvided.innerRef}
                    >
                        <div {...DragProvided.dragHandleProps} className="swimlane-title">
                            <span>{props.swimlane.title}</span>
                        </div>
                        <div className="swimlane-content">
                            <ExpandingButtons vertical={true} alwaysOn={!props.swimlane.childrens.array.length} buttons={['_Column', '_Swimlane']} parentId={props.swimlane.id} addItem={props.functions.addItem} insertAt={props.index + 1} />
                            <Droppable droppableId={props.swimlane.id} direction="horizontal" isDropDisabled={props.isDropDisabled.swimlane}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={snapshot.isDraggingOver ? 'swimlane-childrens column-visible' : 'swimlane-childrens'}
                                    >
                                        {props.swimlane.childrens ?
                                            props.swimlane.childrens.array.map((children, index) => props.functions.renderSwitch(children, index, props.isDropDisabled, props.swimlane.id, props.placeholderprops))
                                            :null}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </div>
                )}
            </Draggable>
            <ExpandingButtons vertical={false} alwaysOn={false} buttons={['_Swimlane']} parentId={props.parentId} addItem={props.functions.addItem} insertAt={props.index + 1} />
        </div>
    );
};

export default Swimlane;