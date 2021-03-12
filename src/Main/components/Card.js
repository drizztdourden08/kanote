import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import './css/Card.css';

import { BiDotsVerticalRounded } from 'react-icons/bi';

const Card = (props) => {
    return (
        <Draggable key={props.card.id} draggableId={props.card.id} index={props.index} >
            {(provided) => (
                <div
                    className="card"

                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <div className="card_priority">
                        <span>{props.card.priority}</span>
                    </div>
                    <div className="card_title">
                        <span>{props.card.title}</span>
                        <BiDotsVerticalRounded />
                    </div>
                    <div className="card_tags">
                        { props.card.tags !== undefined &&
                                props.card.tags.map((tag, index) => <div key={index} className="tag">{tag}</div>)
                        }
                    </div>
                    <div className="card_content">
                        {props.card.content}
                    </div>
                    <div className="card_footer">
                        <div className="card_footer_assignees">
                            { props.card.assignees !== undefined &&
                                    props.card.assignees.map((assignee, index) => <div key={index} className="assignee"></div>)
                            }
                        </div>
                        <div className="card_footer_notes-counter">{props.card.noteCount}</div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default Card;