import React from 'react';

import Swimlane from './Swimlane';
import './css/Swimlane.css';

import { AiOutlinePlus, AiOutlineInsertRowRight, AiOutlineInsertRowAbove } from 'react-icons/ai';

const VerticalGroup = (props) => {
    return (
        <div className="verticalgroup">
            <div className="swimlanes">
                {props.verticalgroup.childrens ? props.verticalgroup.childrens.array.map((s, index) => (
                    <Swimlane swimlane={s} key={index} functions={props.functions} />
                )):null}
            </div>
            <div className="buttons_container buttons_container-bottom">
                <button className="add-icon add-icon_column" onClick={() => props.functions.addSwimlane(props.verticalgroup.id)} >
                    <AiOutlineInsertRowAbove />
                </button>
            </div>
        </div>
    );
};

export default VerticalGroup;