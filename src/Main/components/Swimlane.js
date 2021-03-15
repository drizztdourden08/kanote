import React from 'react';

import Column from './Column';
import './css/Column.css';

import { AiOutlinePlus } from 'react-icons/ai';

const Swimlane = (props) => {
    return (
        <div className="swimlane">
            <div className="columns">
                {props.swimlane.columns ? props.swimlane.columns.map((c, index) => (
                    <Column column={c} key={index} functions={props.functions} />
                )):null}
            </div>
            <div className="columns_add">
                <button className="add-icon add-icon_column" onClick={() => props.functions.addColumn(props.swimlane.id)} >
                    <AiOutlinePlus />
                </button>
            </div>
        </div>
    );
};

export default Swimlane;