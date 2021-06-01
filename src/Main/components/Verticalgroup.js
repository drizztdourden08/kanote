import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import ExpandingButtons from './ExpandingButtons';

import { RiLayoutRowLine } from 'react-icons/ri';

import './css/Verticalgroup.css';

const VerticalGroup = (props) => {
    return (
        <div className="verticalgroup-wrapper">
            <Draggable key={props.verticalgroup.id} draggableId={props.verticalgroup.id} index={props.index} >
                {(DragProvided) => (
                    <div className="verticalgroup"
                        {...DragProvided.draggableProps}
                        ref={DragProvided.innerRef}
                    >
                        <div {...DragProvided.dragHandleProps} className="verticalgroup-icon"><RiLayoutRowLine /></div>
                        <ExpandingButtons vertical={false} alwaysOn={!props.verticalgroup.childrens.array.length} buttons={['_Swimlane']} parentId={props.verticalgroup.id} addItem={props.functions.addItem} hidden={true} />
                        <Droppable droppableId={props.verticalgroup.id} isDropDisabled={props.isDropDisabled.verticalgroup}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={snapshot.isDraggingOver ? 'verticalgroup-childrens column-visible' : 'verticalgroup-childrens'}
                                >
                                    {props.verticalgroup.childrens ?
                                        props.verticalgroup.childrens.array.map((children, index) => props.functions.renderSwitch(children, index, props.isDropDisabled, props.verticalgroup.id, props.placeholderprops))
                                        : null}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                )}
            </Draggable>
            <ExpandingButtons vertical={true} alwaysOn={false} buttons={['_Column','_Swimlane']} parentId={props.parentId} addItem={props.functions.addItem} insertAt={props.index + 1} />
        </div>
    );
};

export default VerticalGroup;