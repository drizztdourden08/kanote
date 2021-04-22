import React from 'react';

import Column from './Column';
import './css/Column.css';

import { AiOutlinePlus, AiOutlineInsertRowRight, AiOutlineInsertRowAbove } from 'react-icons/ai';

const Swimlane = (props) => {
    return (
        <div className="swimlane">
            <div className="swimlane_title">
                <span>{props.swimlane.title}</span>
            </div>
            <div className="swimlane-content">
                <div className="columns">
                    {props.swimlane.childrens ? props.swimlane.childrens.array.map((c, index) => (
                        <Column column={c} key={index} functions={props.functions} />
                    )):null}
                </div>
                <div className="buttons_container buttons_container-right">
                    <button className="add-icon add-icon_column" onClick={() => props.functions.addColumn(props.swimlane.id)} >
                        <AiOutlineInsertRowRight />
                    </button>
                    <button className="add-icon add-icon_column" onClick={() => props.functions.addswimlane(props.swimlane.id)} >
                        <AiOutlineInsertRowAbove />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Swimlane;