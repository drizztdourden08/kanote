import React from 'react';
import { Draggable } from "react-beautiful-dnd";

import './css/Card.css';

import {BiDotsVerticalRounded} from 'react-icons/bi';



const Card = (props) => {
    return(
        <Draggable key={props.item.id} draggableId={props.item.id} index={props.index} >
            {(provided) => {
                return (
                    <div 
                        className="card"
                        
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >
                        <div className="card_priority">
                            <span>{props.item.priority}</span>
                        </div>
                        <div className="card_title">
                            <span>{props.item.title}</span>
                            <BiDotsVerticalRounded />
                        </div>
                        <div className="card_tags">
                            { props.item.tags !== undefined &&
                                props.item.tags.map((tag, index) => <div key={index} className="tag">{tag}</div>)
                            }
                        </div>
                        <div className="card_content">
                            {props.item.content}
                        </div>
                        <div className="card_footer">
                            <div className="card_footer_assignees">
                                { props.item.assignees !== undefined &&
                                    props.item.assignees.map((assignee, index) => <div key={index} className="assignee"></div>)
                                }
                            </div>
                            <div className="card_footer_notes-counter">{props.item.noteCount}</div>
                        </div>
                    </div>
                );
            }}
        </Draggable>
)};

export default Card;