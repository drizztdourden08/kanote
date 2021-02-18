import React from 'react';

import Card from './Card';

import './css/Column.css';


import {IoMdAddCircle} from 'react-icons/io';

const Column = (props) => {
    return(
        <div className="column">
            <div className="column_title">
            <span>Requested</span>
            </div>
            <div className="AddIcon">
            <IoMdAddCircle />
            </div>
            <div className="column_cards">
                <Card />
                <Card />
                <Card />
            </div>
        </div>
        )}


export default Column;