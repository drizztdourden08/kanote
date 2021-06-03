/* eslint-disable react/jsx-no-undef */
import React from 'react';
import Select from 'react-select';

import '../css/FormElement.css';

import { AiFillTag } from 'react-icons/ai';
import { BiImage } from 'react-icons/bi';
import { MdLowPriority } from 'react-icons/md';
import { TiCancel } from 'react-icons/ti';
import { IoCheckmarkSharp } from 'react-icons/io5';

const Icon = (props) => {
    switch (props.iconName) {
        case 'AiFillTag': return <AiFillTag />;
        case 'BiImage': return <BiImage />;
        case 'MdLowPriority': return <MdLowPriority />;
        case 'TiCancel': return <TiCancel />;
        case 'IoCheckmarkSharp': return <IoCheckmarkSharp />;
        default: break;
    }
};

const Input = (props) => {
    return (
        <div className="form-element-input">
            <Icon iconName={props.iconName} />
            <input type="text" />
        </div>
    );
};

const DropDown = (props) => {
    return (
        <div className="form-element-select">
            <Icon iconName={props.iconName} />
            <Select options={[
                { value: 'High', label: 'High' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Low', label: 'Low' }
            ]} />

        </div>
    );
};

const Button = (props) => {
    let iconName, text;
    let classes = 'form-element-button';
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
    return (
        <button className={classes}><Icon iconName={iconName} />{text}</button>
    );
};

export { Input, DropDown, Button };