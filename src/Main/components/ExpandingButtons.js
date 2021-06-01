import React from 'react';

import './css/ExpandingButtons.css';

import { BsCardHeading } from 'react-icons/bs';
import { AiOutlineInsertRowAbove, AiOutlineInsertRowRight } from 'react-icons/ai';

const ExpandingButtons = (props) => {
    let containerClasses = 'expanding-button-container';
    let buttonClasses = 'expanding-add-button';
    if (props.vertical) {
        containerClasses += ' expanding-button-container-vertical';
        buttonClasses += props.alwaysOn ? ' expanding-add-button-vertical-alwayson' : '';
        buttonClasses += ' expanding-add-button-vertical';
    } else {
        containerClasses += ' expanding-button-container-horizontal';
        buttonClasses += props.alwaysOn ? ' expanding-add-button-horizontal-alwayson' : '';
        buttonClasses += ' expanding-add-button-horizontal';
    }

    const getButtonIcon = (button) => {
        switch (button) {
            case '_Card': return <BsCardHeading />;
            case '_Column': return <AiOutlineInsertRowRight />;
            case '_Swimlane': return <AiOutlineInsertRowAbove />;
            default: break;
        }
    };

    return (
        <div className={containerClasses} style={props.hidden ? { minHeight: '0px' } : undefined}>
            {props.buttons.map((button, index) => (
                <div key={index} className={buttonClasses}>
                    <button onClick={() => props.addItem(button, props.parentId, props.insertAt)}>
                        {getButtonIcon(button)}
                    </button>
                </div>
            ))
            }
        </div>
    );
};

export default ExpandingButtons;