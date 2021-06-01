import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import './css/Card.css';
import './css/Card-content.css';

import ExpandingButtons from './ExpandingButtons';

import { BiDotsVerticalRounded, BiCommentDetail, BiImageAlt } from 'react-icons/bi';
import { MdTitle } from 'react-icons/md';

const Card = (props) => {
    return (
        <Draggable key={props.card.id} draggableId={props.card.id} index={props.index} >
            {(provided, snapshot) => (
                <div className="card-wrapper"
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    <div className="card">
                        <div className="card-header">
                            <div className="card-main">
                                <div className="card-main-wrapper">
                                    {
                                        props.card.priority !== null ?
                                            <div className="card-priority" style={{ background: props.card.priority.color }}>
                                                <span>{props.card.priority.title}</span>
                                            </div>
                                            : undefined
                                    }
                                    <div {...provided.dragHandleProps} className="card-title">
                                        <span>{props.card.title}</span>
                                    </div>
                                    <div className="card-editing" >
                                        <button className="standard-button" onClick={() => props.functions.updateCard(props.functions.getParentId('COLUMN', props.card.columnId), props.card.columnId, props.card.id, [{ 'property': 'editing', 'newValue': !props.card.editing }])} ><BiDotsVerticalRounded /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-wrapper2">
                            <div className="card-field">
                                <MdTitle />
                                <input type="text" value={props.card.title} onChange={event => props.functions.updateCard(props.functions.getParentId('COLUMN', props.card.columnId), props.card.columnId, props.card.id, [{ 'property': 'title', 'newValue': event.target.value }])} />
                            </div>
                            <div className="card-field">
                                <BiImageAlt />
                                <input type="text" value={props.card.image} onChange={event => props.functions.updateCard(props.functions.getParentId('COLUMN', props.card.columnId), props.card.columnId, props.card.id, [{ 'property': 'image', 'newValue': event.target.value }])} />
                            </div>
                            <div className="card-field">
                                <BiImageAlt />
                                <input type="text" name="priority" value={props.card.priority} onChange={event => props.functions.updateCard(props.functions.getParentId('COLUMN', props.card.columnId), props.card.columnId, props.card.id, [{ 'property': 'priority', 'newValue': event.target.value }])} />
                                <datalist id="priority">
                                    <option value="Boston" />
                                    <option value="Cambridge" />
                                </datalist>
                            </div>
                        </div>
                        {props.card.content.length > 0 ?
                            <div className="card-content">
                                {props.card.content.array.map((element, index) => {
                                    return (
                                        <div className="content-element" key={index}>
                                            {props.functions.returnContentElement(element, index)}
                                            <hr />
                                        </div>
                                    );
                                })
                                }
                            </div>
                            : undefined
                        }

                        <div className="card-footer">
                            <div className="card-footer-left">
                                {props.card.tags.length > 0 ?
                                    <div className="card-tags">
                                        {props.card.tags.array.map((tag, index) =>
                                            <div key={index} className="tag">{tag}</div>)}
                                    </div>
                                    : undefined
                                }
                                {props.card.assignees.length > 0 ?
                                    <div className="card-footer-assignees">
                                        {props.card.assignees.array.map((assignee, index) =>
                                            <div className="assignee-wrapper" key={index}>
                                                <div className="assignee" style={{ background: assignee.color }}>{assignee.initial}</div>
                                            </div>)}
                                    </div>
                                    : undefined
                                }
                            </div>
                            <div className="card-footer-notes-counter"><BiCommentDetail /><span>{props.card.comments.array.length}</span></div>
                        </div>
                    </div>
                    <ExpandingButtons vertical={false} alwaysOn={false} buttons={['_Card']} parentId={props.parentId} addItem={props.functions.addItem} insertAt={props.index + 1} />
                </div>
            )}
        </Draggable>


    );
};

export default Card;