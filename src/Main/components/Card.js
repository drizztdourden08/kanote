import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import './css/Card.css';
import './css/Card-content.css';

import { BiDotsVerticalRounded, BiCommentDetail } from 'react-icons/bi';

const Card = (props) => {
    console.log(props.card);

    return (
        <Draggable key={props.card.id} draggableId={props.card.id} index={props.index} >
            {(provided) => (
                <div
                    className="card"

                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    {
                        props.card.editing===false
                            ?
                            <div className="card-wrapper">
                                <div className="card-top">
                                    {
                                        props.card.image !== null ?
                                            <div className="card-image">
                                                <img alt="header-img" src={props.card.image} />
                                            </div>
                                            :undefined
                                    }
                                    <div className="card-main">
                                        <div className="card-main_wrapper" style={props.card.image !== null ? { background: '#00000099' }:undefined }>
                                            {
                                                props.card.priority !== null ?
                                                    <div className="card_priority" style={{ background: props.card.priority.color }}>
                                                        <span>{props.card.priority.title}</span>
                                                    </div>
                                                    :undefined
                                            }
                                            <div className="card_title">
                                                <span>{props.card.title}</span>
                                            </div>
                                            <div className="card-editing">
                                                <BiDotsVerticalRounded />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {props.card.content.length > 0 ?
                                    <div className="card_content">
                                        {props.card.content.map((element, index) => props.functions.returnContentElement(element, index))}
                                    </div>
                                    :undefined
                                }
                                <div className="card_footer">
                                    <div className="card_footer-left">
                                        {props.card.tags.length > 0 ?
                                            <div className="card_tags">
                                                {props.card.tags.map((tag, index) =>
                                                    <div key={index} className="tag">{tag}</div>)}
                                            </div>
                                            :undefined
                                        }
                                        {props.card.assignees.length > 0 ?
                                            <div className="card_footer_assignees">
                                                {props.card.assignees.map((assignee, index) =>
                                                    <div className="assignee-wrapper" key={index}>
                                                        <div className="assignee" style={{ background: assignee.color }}>{assignee.initial}</div>
                                                    </div>)}
                                            </div>
                                            :undefined
                                        }
                                    </div>
                                    <div className="card_footer_notes-counter"><BiCommentDetail /><span>{props.card.comments.length}</span></div>
                                </div>
                            </div>
                            :
                            <div>
                            </div>

                    }
                </div>
            )}
        </Draggable>
    );
};

export default Card;