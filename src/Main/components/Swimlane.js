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
            <div className="columns">
                {props.swimlane.columns ? props.swimlane.columns.array.map((c, index) => (
                    <Column column={c} key={index} functions={props.functions} />
                )):null}
                {
                    <div>
                        <button className="add-icon add-icon_column" onClick={() => props.functions.addColumn(props.swimlane.id)} >
                            <AiOutlineInsertRowRight />
                        </button>
                        <button className="add-icon add-icon_column" onClick={() => props.functions.addswimlane(props.swimlane.id)} >
                            <AiOutlineInsertRowAbove />
                        </button>
                    </div>
                }
            </div>
        </div>
    );
};

export default Swimlane;