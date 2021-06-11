import React from 'react';

import '../css/ExpandingButtons.css';

import { BsCardHeading, BsTextareaT } from 'react-icons/bs';
import { AiOutlineInsertRowAbove, AiOutlineInsertRowRight } from 'react-icons/ai';
import { GoTasklist } from  'react-icons/go';
import { VscMarkdown } from  'react-icons/vsc';
import { BiImageAdd } from  'react-icons/bi';

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
            case '_cTaskList': return <GoTasklist />;
            case '_cText': return <BsTextareaT />;
            case '_cMarkdownText': return <VscMarkdown />;
            case '_cImage': return <BiImageAdd />;

            default: break;
        }
    };

    return (
        <div className={containerClasses} style={props.hidden ? { minHeight: '0px' } : undefined}>
            {props.buttons.map((item, index) => {
                switch (props.type) {
                    case 'CardContent':
                        return (
                            <div key={index} className={buttonClasses}>
                                <button onClick={() => props.addContentItem(item, props.cardId)}>
                                    {getButtonIcon(item)}
                                </button>
                            </div>
                        );
                    default:
                        return (
                            <div key={index} className={buttonClasses}>
                                <button onClick={() => props.addItem(item, props.parentId, props.insertAt)}>
                                    {getButtonIcon(item)}
                                </button>
                            </div>
                        );
                }
            }
            )}
        </div>
    );
};

export default ExpandingButtons;