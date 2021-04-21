import React from 'react';

import Swimlane from './Swimlane';
import './css/Swimlane.css';

import { AiOutlinePlus, AiOutlineInsertRowRight, AiOutlineInsertRowAbove } from 'react-icons/ai';

const VerticalGroup = (props) => {
    return (
        <div className="verticalgroup">
            <div className="swimlanes">
                {props.verticalGroup.swimlanes ? props.verticalGroup.swimlanes.array.map((s, index) => (
                    <Swimlane swimlane={s} key={index} functions={props.functions} />
                )):null}
            </div>
            <div className="swimlane_addbottom">
                <button className="add-icon add-icon_column" onClick={() => props.functions.addSwimlane(props.)} >
                    <AiOutlineInsertRowAbove />
                </button>
            </div>
        </div>
    );
};

export default VerticalGroup;