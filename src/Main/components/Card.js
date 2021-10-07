import React, { useRef, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Transition } from 'react-transition-group';

import { ContentElement } from './ContentElements';
import ExpandingButtons from './ExpandingButtons';
import { Input, DropDown, Button } from './FormElements';


import '../css/Card.css';
import '../css/Card-content.css';

import { BiCommentDetail } from 'react-icons/bi';

const Card = (props) => {
    const optionBlockRef = useRef(null);
    const [isEditing, setisEditing] = useState(false);
    const [cardEditingProps, setcardEditingProps] = useState(props.card);

    const getTotalHeightOfChilds = (domRef) => {
        let totalHeight = 0;

        if (!domRef.current) return;

        const childrenArray = [...domRef.current.children];
        childrenArray.forEach(element => {
            totalHeight += element.offsetHeight;
            var style = window.getComputedStyle ? getComputedStyle(element, null) : element.currentStyle;
            totalHeight += (parseFloat(style.marginTop) || 0) + (parseFloat(style.marginBottom) || 0);
        });

        return totalHeight;
    };

    const OptionsTransitionStyles = (state) => {
        switch (state) {
            case 'entering': return { transition: 'height 0.25s, padding 0.25s', height: getTotalHeightOfChilds(optionBlockRef), overflow: 'hidden', paddingTop: 5, paddingBottom: 5 };
            case 'entered': return { height: getTotalHeightOfChilds(optionBlockRef), overflow: 'visible', paddingTop: 5, paddingBottom: 5 };
            case 'exiting': return { transition: 'height 0.25s 0.3s, padding 0.25s 0.3s', height: 0, overflow: 'hidden', paddingTop: 0, paddingBottom: 0 };
            case 'exited': return { height: 0, overflow: 'hidden', paddingTop: 0, paddingBottom: 0 };
            default: break;
        }
    };

    const ToggleEditing = () => {
        if (!isEditing) {
            setisEditing(!isEditing);
        } else {
            CancelEditing();
        }
    };

    const CancelEditing = () => {
        setisEditing(!isEditing);
        setcardEditingProps(props.card);
    };

    const updateCardEditingProps = (id, newProps) => {
        const tempCardEditingProps = { ...cardEditingProps };

        newProps.forEach((prop) => {
            tempCardEditingProps[prop.property] = prop.newValue;
        });

        setcardEditingProps(tempCardEditingProps);
    };

    const SaveCardProperties = () => {
        const newProps = [];
        for (const key in cardEditingProps){
            if (props.card[key] !== cardEditingProps[key]) {
                newProps.push({ property: key, newValue: cardEditingProps[key] });
            }
        }
        props.functions.updateItem(props.card.id, newProps);
        CancelEditing();
    };

    return (
        <Draggable key={props.card.id} draggableId={props.card.id} index={props.index} >
            {(provided, snapshot) => (
                <div className="card-wrapper"
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    <div className="card">
                        <div className="card-header">
                            {
                                props.card.image.source ?
                                    <div className="card-header-image">
                                        <img src={props.card.image.source} alt={props.card.image.alt} />
                                        <div></div>
                                    </div>: undefined
                            }
                            <div className="card-header-main">
                                <div {...provided.dragHandleProps} className="card-title">
                                    <span>{props.card.title}</span>
                                </div>
                                {
                                    props.card.priority.title ?
                                        <div className="card-priority" style={{ background: props.card.priority.color }}>
                                            <span>{props.card.priority.title}</span>
                                        </div>
                                        : undefined
                                }
                                <Button iconName="IoOptions" noStyle={true} onClick={() => ToggleEditing()} />
                            </div>
                        </div>

                        {!snapshot.isDragging ? //Fixing lag problem by disabling this while dragging
                            <Transition in={isEditing} timeout={500}>
                                {stateParent => (
                                    <div
                                        className="card-options"
                                        style={{ ...OptionsTransitionStyles(stateParent) }} >
                                        <Transition in={isEditing} timeout={1500}>
                                            {stateChildren => (
                                                <div
                                                    ref={optionBlockRef}
                                                    className="card-options-childrens"
                                                    style={
                                                        { ...{
                                                            entering: { transition: 'opacity 0.25s 0.3s', opacity: 1 }
                                                            ,entered: { opacity: 1 }
                                                            ,exiting: { transition: 'opacity 0.25s', opacity: 0 }
                                                            ,exited: { opacity: 0 }
                                                        }[stateChildren] }
                                                    }>
                                                    <h3>Edit Card</h3>
                                                    <Input iconName="AiFillTag" content={cardEditingProps.title} property="title" updateFunction={updateCardEditingProps} />
                                                    <Input iconName="BiImage"  />
                                                    <DropDown iconName="MdLowPriority" items={props.priorities} content={cardEditingProps.priority} itemId={props.card.id} property="priority" updateFunction={updateCardEditingProps} />
                                                    <div className="acceptance-buttons">
                                                        <Button specialStyle="CancelButton" onClick={CancelEditing} />
                                                        <Button specialStyle="AcceptButton" onClick={SaveCardProperties} />
                                                    </div>
                                                </div>
                                            )}
                                        </Transition>
                                    </div>
                                )}
                            </Transition>
                            : undefined}
                        <div className="card-content">
                            <div className="card-content-add">
                                <ExpandingButtons type="CardContent" vertical={false} alwaysOn={true} buttons={['_cTaskList', '_cText', '_cMarkdownText', '_cImage']} addContentItem={props.functions.addContentItem} cardId={props.card.id} />
                            </div>
                            <div className="card-content-elements">
                                {props.card.childrens ?
                                    <div className="card-content-childrens">
                                        {props.card.childrens.array.length > 0 ? props.card.childrens.array.map((element, index) => {
                                            return (
                                                <div className="content-element" key={index}>
                                                    <ContentElement content={element} updateItem={props.functions.updateItem} />
                                                </div>
                                            );
                                        })
                                            : undefined}
                                    </div>
                                    : undefined
                                }
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="card-footer-left">
                                {props.card.tags.length > 0 ?
                                    <div className="card-footer-tags">
                                        {props.card.tags.array.map((tag, index) =>
                                            <div key={index} className="tag">{tag}</div>)}
                                    </div>
                                    : undefined
                                }
                                {props.card.assignees.length > 0 ?
                                    <div className="card-footer-assignees">
                                        {props.card.assignees.array.map((assignee, index) =>
                                            <div className="assignee-wrapper" key={index}>
                                                <div className="assignee" style={{ background: assignee.color }}>{assignee.initial}</div>
                                            </div>)}
                                    </div>
                                    : undefined
                                }
                            </div>
                            <div className="card-footer-notes-counter"><BiCommentDetail /><span>{props.card.comments.array.length}</span></div>
                        </div>
                    </div>
                    <ExpandingButtons vertical={false} alwaysOn={false} buttons={['_Card']} parentId={props.parentId} addItem={props.functions.addItem} insertAt={props.index + 1} />
                </div>
            )}
        </Draggable>


    );
};

export default Card;