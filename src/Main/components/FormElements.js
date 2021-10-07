/* eslint-disable react/jsx-no-undef */
import React from 'react';
import Select from 'react-select';

import '../css/FormElement.css';

import { AiFillTag } from 'react-icons/ai';
import { BiImage } from 'react-icons/bi';
import { MdLowPriority } from 'react-icons/md';
import { TiCancel } from 'react-icons/ti';
import { IoCheckmarkSharp, IoOptions } from 'react-icons/io5';

const Icon = (props) => {
    switch (props.iconName) {
        case 'AiFillTag': return <AiFillTag />;
        case 'BiImage': return <BiImage />;
        case 'MdLowPriority': return <MdLowPriority />;
        case 'TiCancel': return <TiCancel />;
        case 'IoCheckmarkSharp': return <IoCheckmarkSharp />;
        case 'IoOptions': return <IoOptions />;
        default: break;
    }
};

const Input = (props) => {
    return (
        <div className="form-element">
            <div className="form-element-input">
                <input type="text" value={props.content} onChange={(event) => props.updateFunction(props.itemId, [{ property: props.property, newValue: event.target.value }])} />
                <Icon iconName={props.iconName} />
            </div>
        </div>
    );
};

const DropDown = (props) => {
    return (
        <div className="form-element">
            <div className="form-element-select">
                <Select className="dropdown-select-container" classNamePrefix="dropdown-select" onChange={(item) => props.updateFunction(props.itemId, [{ property: props.property, newValue: item.value }])}
                    options={props.items.array.map(
                        (item) => {
                            const newitem = { value: undefined, label: '' };
                            newitem.value = item;
                            newitem.label = item.title;
                            return newitem;
                        })
                    } />
                <Icon iconName={props.iconName} />
            </div>
        </div>
    );
};

const Button = (props) => {
    let iconName, text;
    let classes;
    if (props.noStyle) classes += ' form-element-button-nostyle';
    switch (props.specialStyle) {
        case 'AcceptButton':
            iconName = 'IoCheckmarkSharp';
            classes += ' form-element-acceptbutton';
            if (!props.noStyle) classes += ' form-element-button-nostyle';
            break;
        case 'CancelButton':
            iconName = 'TiCancel';
            classes += ' form-element-cancelbutton';
            if (!props.noStyle) classes += ' form-element-button-nostyle';
            break;
        default:
            iconName = props.iconName;
            text = props.text;
            break;
    }
    classes += ' form-element-button';
    return (
        <div className="form-element">
            <button className={classes} onClick={props.onClick}><Icon iconName={iconName} />{text}</button>
        </div>
    );
};

export { Input, DropDown, Button };