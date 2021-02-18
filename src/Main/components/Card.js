import React from 'react';

import './css/Card.css';

import {BiDotsVerticalRounded} from 'react-icons/bi';



const Card = (props) => {
    return(        
        <div className="card" id={Math.random() * 500000}>
            <div className="card_priority">
                <span>{props.priority}</span>
            </div>
            <div className="card_title">
                <span>{props.title}</span>
                <BiDotsVerticalRounded />
            </div>
            <div className="card_tags">
                { props.tags !== undefined &&
                    props.tags.map((tag) => <div className="tag">UX</div>)
                }
            </div>
            <div className="card_content">

            </div>
            <div className="card_footer">
                <div className="card_footer_assignees">
                    { props.assignees !== undefined &&
                        props.assignees.map((tag) => <div className="assignee"></div>)
                    }
                </div>
                <div className="card_footer_notes-counter">{props.noteCount}</div>
            </div>
        </div>
)};

export default Card;