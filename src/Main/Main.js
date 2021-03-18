import React, { useEffect, useState, useRef } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import CodeBlock from './components/CodeBlock';

import { mouseMoveDetect } from '../scripts/ElectronClickThrough';
import { dateAdd } from '../scripts/DateTime';

import { loremIpsum, name, surname, fullname, username } from 'react-lorem-ipsum';

import './Main.css';

import Swimlane from './components/Swimlane';
import './components/css/Swimlane.css';

const ipc = window.require('electron').ipcRenderer;

const { v4: uuidv4 } = require('uuid');

class _Board {
    constructor(){
        this.swimlanes = [];
    }
}

class _Swimlane {
    constructor(){
        this.id = uuidv4();
        this.title = 'Swimlane ' + Math.floor(Math.random() * Math.floor(100))  + '';
        this.columns = [];
    }
}

class _Column {
    constructor(swimlaneId) {
        this.id = uuidv4();
        this.swimlaneId = swimlaneId;
        this.title = 'Column ' + Math.floor(Math.random() * Math.floor(100))  + '';
        this.cards = [];
        this.editing = false;
        this.moveColumnBy = 0;
        this.moveSwimlaneBy = 0;
        this.toDelete = false;
        this.cancelChanges = false;
        this.originalColumn = {};
    }
}

class _Card {
    constructor(columnId) {
        this.id = uuidv4();
        this.columnId = columnId;
        this.title = 'Card ' + Math.floor(Math.random() * Math.floor(100))  + '';
        this.priority = new _Priority();
        this.image = [
            'https://www.talkwalker.com/images/2020/blog-headers/image-analysis.png',
            'https://seeklogo.com/images/P/pepsi-vertical-logo-72846897FF-seeklogo.com.png',
            'https://www.projecttopics.org/wp-content/uploads/2017/09/abstract-140898_1280.jpg',
            'http://artist.com/art-recognition-and-education/wp-content/themes/artist-blog/media-files/2016/05/abstract-6.jpg',
            'https://i.icanvas.com/list-hero/abstract-landscapes-1.jpg',
            'https://www.fyimusicnews.ca/sites/default/files/media-beat-large.jpg',
            'http://2015.holocaustremembrance.com/sites/default/files/field/image/social_media_strategy111.jpg',
            'https://cdn.arstechnica.net/wp-content/uploads/2016/02/5718897981_10faa45ac3_b-640x624.jpg',
            'https://teeltechcanada.com/2015/wp-content/uploads/2017/08/cyber-security-banner-red.jpg',
            'https://thumbs.dreamstime.com/b/abstract-red-grey-tech-geometric-banner-design-vector-web-header-corporate-background-101610481.jpg',
            null, null, null, null, null, null, null, null
        ][Math.floor(Math.random() * Math.floor(18))];
        this.tags = ['task', 'beamed'];
        this.content = [new _cTaskList(), new _cText(), new _cMarkdownText(), new _cImage()].splice(Math.floor(Math.random() * Math.floor(3)), Math.round(Math.random()));
        this.timing = {
            created: Date.now(),
            dueDate: dateAdd(this.created, 'minute', 5),
            timeLeft: this.dueDate - this.created,
            breached: this.timeLeft > 0 ? false:true
        };
        this.notification = false;
        this.assignees = [new _Assignee(), new _Assignee()];
        this.accentColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        this.comments = [];
        this.editing = false;
        this.moveColumnBy = 0;
        this.moveSwimlaneBy = 0;
        this.toDelete = false;
        this.cancelChanges = false;
        this.originalCard = {};
    }
}

class _Priority {
    constructor() {
        this.id = uuidv4();
        this.title = ['High', 'Medium', 'Low'][Math.floor(Math.random() * Math.floor(3))];
        this.color = '#' + Math.floor(Math.random()*16777215).toString(16);
        this.level = Math.floor(Math.random() * Math.floor(10));
    }
}

class _Assignee {
    constructor() {
        this.id = uuidv4();
        this.firstName = name();
        this.lastName = surname();
        this.initial = this.firstName[0] + this.lastName[0];
        this.color = '#' + Math.floor(Math.random()*16777215).toString(16);
    }
}

class _cTaskList {
    constructor() {
        this.id = uuidv4();
        this.title = 'Tasklist ' + Math.floor(Math.random() * Math.floor(10));
        this.tasks = [new _cTask(), new _cTask(), new _cTask(), new _cTask(), new _cTask()].slice(0, Math.floor(Math.random() * Math.floor(4)));
    }
}

class _cTask {
    constructor(parentTaskId = null) {
        this.id = uuidv4();
        this.parentTaskId = parentTaskId;
        this.title = 'task ' + Math.floor(Math.random() * Math.floor(10));
        this.checked = Math.random() < 0.5;
        this.tasks = this.parentTaskId === null ? [new _cTask(this.id), new _cTask(this.id)]: [];
    }
}

class _cText {
    constructor() {
        this.id = uuidv4();
        this.text = loremIpsum({ p: 1, avgWordsPerSentence: 8, avgSentencesPerParagraph: 2 });
    }
}

class _cMarkdownText {
    constructor() {
        this.id = uuidv4();
        this.text = `
A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

## Bullet list
* Lists
    * List 2
* [x] todo
* [ ] todo
* [x] done
    * Something
    * Something else

[google][www.google.com]

# A table:

| a | b |
| - | - |
| Something | Else |
| Again | Nothing |
| To | Be |

    class _cText {
        constructor() {
            this.id = uuidv4();
            this.text = loremIpsum({ p: 1, avgWordsPerSentence: 8, avgSentencesPerParagraph: 2 });
        }
    }
        `;
    }
}

class _cImage {
    constructor() {
        this.id = uuidv4();
        this.alt = 'altimage ' + Math.floor(Math.random() * Math.floor(10));
        this.url = [
            'https://clipartart.com/images/small-flowers-clip-art-23.jpg',
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAolBMVEX33x4AAABiWAv/5x/64h7Ltxj95B9PRwlVTAlgVgv/6B9YTwpUSwldUwpaUQpdVArv2B2RgxLs1R3ItRihkRPCrxfjzRuwnxW2pBZ8bw6GeRDVwBqYiRLgyhuolxS7qRZuYwx9cQ80LwbZxBoqJgV0aA2bjBKEdw9HQAgbGANvZA1oXQwVEwNFPgg7NQesmxUgHQQmIgQKCQE1MAYWFAMuKQUrvzLYAAANZUlEQVR4nO1daYOiuBaNJMSwhUXFBRVtR60uu9tZ3vz/v/YScEMCBMUy9HA+dbVbjne/uYkAdOjQoUOHDh06dOjQ4fcAwu9ewWuBUTxPKCKMgReGAfsHQu9eVWNA2DtqHwsEEPRGu6lmE2JbKz8OIf4tSCIczgl1fAxwOCOWY2gJDJeS1TFsP0cEFzPiaFo/QHBMXC0Dg5L1ALabIw79PqdFhxD7RMvDICsdvnuVjwPhs9hoAOeWgCDnaM9bK0UcbE+s6NJciiR4enT77pU+CDigxpkDGtiFBDXNWbdSinh4IUXHYYGKnmAdW5gPIP+GVKAZxfQSit6711sbt47FGe/dEnaJlCdtEyKe3DqWmVNBUDP2LWOIsnYnVlGXUosw0CRgtszXwG2F3bFsRtsfR5vQ88LRcKVpdvDuNdcCHhUHPy48i0zHGwChCaLhp5XIkGzaJcRS6VmzkQcxhmF8k4hbbWGY1Ll4Qov4OWQbe5ghGG9T4WmtYoiQvo3ZSgsIGpTuFqwmhF48tWnWUsmiBQwRGq0I8xh4LGRoWIcJq/UxinyL5hyR3YKQD/UVMYw1FluhQT4HjB32Jqv7KjF5+KC8CLE3I0wwNEYiKzTIVseIVftDkhcfh+urHvHhwEnyFuIBdMit3zoMGD+48ElRcmON1JYhQvO0jnD3EI3uywhqxAm/mV2cnVK1zRB525NiciW9S2dcMvR4E8oXmd8ZjtpKihfuefFWgKJsOkPWIWRGuiuRH4OtdKzAunWWmjHFMFMoOXTEFBRNnMIUIBX9UGUR4tG1P0GPcHErQttnCgqjVXmBr7lbpSV4Q1CzInN+9ZauO+AK6pOqOkPzFGaYIajZwLv+SfZcgAOjsvpV2gixfkvQ2JrLs8EZZAKZkxV2gbMgusJGiBYZC3N26KyQjrbgFqhVClDrjxQmyDLQjInRUXxibO1ZFoCG/Up+mh2r3NPHdx0ma3FK2Gzm/XGwLQ8RLZAgju+MzE1zboPqkGkoreog8oJKZRsEKMh5kVXCUwuZBMdlXfwT6CpUmSDAa6GQ6NZjJijhQw17qPY+d05HU1gzxs+rNkGDTBdKCxAAT0iCcB8TalUmaBBeMb6bQjnwTsSQjFmeFonL+CscslWeH0ChSEf7LLhhvbwbTIkz3CjPDwA4EygiYZk2jAvCvGG41CLafrzBLeDH0jWBoGwW3OBlz8lwrAsopcZh6h8HIUhHaJDyJLFAhDyDhpcw6A6DKwsMOTAvhhHiDe9oqXTnyQtRmI/niQTHV9E6dHqMPATxFSyMLKJ4ODtYH0uVCYJVAIe5msHOSDDVU2rZh/18mWDnz6YrxyYWdVzXUnqEBk1XGOR09F6CV5qOw6yQOoyXcQoi9FPpZA369s7MtUTtUU6ChbDnSidreEzoyLwfPOD1PI6lCLp0oLKGArSxNTv07riQJSNYOhJ0feo6UFlDGQ6G5pijbMJG5+Zdw6YIhqV0Rc+Al1RzZ6afUVJnj5hsK1qi6VehtosBp2SUjlEmsTZWvBiuSrY57J3SLoYD+g7v+m5ug4JhBCyQH6oJGpbaLoYjTUYtL7OJzfff0ba6JaN6xyIB5iLUDuZtTkpYIMR+dVON+MprKEPA3aWxN2+cCp2zeqlkNvasoXYrBvPSEQtnGFzjgjtFdzsXQjgH1VsyKfAndyc01q8ydD1019gXwfZBCzT00rewoqujIRECXtVsrGOMlPehKVCcMCPhJd5bS+Zl1uV7L64991qhoYCPbafjJMHnSWjulHuZUh117dmiJQIEl8YFCc4idANU2ldjBbC/UL4fcwO4MlKGJ1Ks5kXirnDKnxzGXrsO/MCUjRWleun4kJX7RbkMpX6E22J/Z+C0D0pTh2NojPOxyAhXMTBbJb4UaWB3UodjR4hXw0Xwx3oAcCtavzdI+RizJO6zbA2UFBRJe3vqD+N3L1oeCMCTxJJdUK6j86p827U/VZ4jyQKNAnN1FRkZIBRVpaOWNmqRlqJJfzi9MHRm5TrKldnS4jbUSxew4te5MrICAIdlOmqQQwxaFizwrfpNsHDv6SJie6+3LhgCfJ3IM1asKJwW6ahrGbvWHdD2AITwWhWyUFh06se17NkAtI0fY2g4093xLEOXuxkRO0o0v430AHcztuFclNQKUfbIiGE41LLpbLxpJz2O29EZOoTA4386xGagzmG7nk/0ELYtRcsCXkf0LGaVO/aXswy8BAC3nFwK78yQHvHpfKgzalf1V4Gr8zz19jXe5G1bUC8FTAMgD/bheWDGYYnZ78PxnMTw3v61sLcOE+83sMEUmLsXesnXjBQusfyXjnDx8ZvTMM6r7yTCvHvhso8c25ajGdP19ITt50yv/GiE86j8SIQh2MTD2fbzc7vd++NBAF55KRFi5SEdY37QcDB37S0w4RnVn4oWM/8eFQeBGD193u9l8YMON+aLSKIBSUR4+vDN8FCnfEeDXg4fZa1iZG5m+ZekLOfhS5rM/AoBurx87fw0b41XIz2/0n7JOs2NVsAvwdprniPiO9skc+1BHV2pxxB76zJ+HM0PHfEQ4foPf3O1GMJRFT+Gf5reMw9YomY/fidAHYbQlyDI0OyeHT5Sfnry4dfXYIgPcgR7vXGTFJH23GlreYbQkCXY6x3NhxeUXyBTUusJ25ZmaG7lCfZ6k8akyLcOnd0Tpi3LEA7rEOz1oqY8Kp++eOpmDkmGaFOPYK/X0Cn+xM9sn/HOkgzNX3UZas2YIr8G4rm7uOQY4kldgswUmwiLyR0Cz12uIscQ/VmfYSN6yvOZJy8bk2L4iAh7vUbuKiBPXz0ixdD8KKTx/XvBAz+aOGSb3FXy5KV/MgxRICZxGLHCFwab8X2xyLBupBfGL7qw4+feSYYhPor49cPTyAPC5uZOyP9GzXhSjybHJp+CDEO4EhA0bnuyKJuUN1VBoREhT+e4UjL8N/+cX3ffrHnNeT4aGyfDvrZ5WtmlPI1AhLkWl7k+PbJsruGORg0ogwRDUcb2V97OYGKLbqPHUpr4rmQYCppVU0HqGrL/j9XbMZFhKOhdiBwc9A8qbpc8KENhwabmVokMQ8FT9u2ZvpVhGOWfYv9eDMP8U5oqcL8Aj8ZDv7le04shlXmLqsPnk40vglReagkY9tpx2EYyLxX3uuN2jFNLaWnBdsUqaINHlevTiBkyf9OCUw1SDGHxnuE6VF1XpRiK8rYLDhuotM+R7Jf+VUKx9xGrzLGhjvBOXYOU7eqXCpFjHSrKUXZnRpB93+MQKel0pHfXZHa4PyIF5Si9QwoFbd88jIVycqyxj/+HDMXeVrUbUuQZouBvKYq9pVpirCFDFAg6wyL8VOoWijrzNAjYchR7Y4Xq43pTX6bkzFDviQmfplFzcg/qksZoKXM8ru5sIgZ7OYo/VbmPoi5DJsaFnDV+KKKo9RkCZOo/ZSiu1HA3DzDkG6IDGY5DJZocDzHkHCPRxvAdlDhN/SBDztHzq/zqTxX09GGGgPvVcUWuqsJVqM8wZBzNgbBbfMYvBSzxOYZcWRfrEoqNDWE+jmcZco5BcRKwfb8Qn2eYcCyU4+/BkMFcFLQA3q+mDTFkic5cyPD9P6bUFEMmRmFP9fB2NW2Oobh4vJ8O+3o0yBBgUfxvdrkPoFGGYwHDt480iLaVCvs0MCz1jMJJ2/KXNApxW0G0v2uJGUIWEcolAgUMv+6HaGEknCYWaZYmYog9nrmUn6KA/+TfrPokcjPAYCo2erzLL0o0eIiX6WOlI7tQ4Gq+JuQjmEhKdA4TfuYXlfvVSgT1SzO4rKpF79LSy6C5YHWiCef7PASGN/v434t/L1C4Gf4FvvSm/5cPv2ghWFS2bsUgG8n/KqRoimrFl3DKUDDjm17D7N5RmKLC51axkDm571X8UbC7BGPBe708p4F3Of8yS1Eowt7NomAkcI+9kcijQuE28edr81KMcqliZusLAdFu0k3AF560YNjmBhOQOPHuHV8qQ3P0I/+RhwBejrpEwu2yG1eKxSURw2xxc0cEfysift5LUxqvoEk01ZOfPFrEBUeXMxHsf0UUe/2d7iGc3L2h+98KnvTtpf1EXPSxvd6PfwXSPeH7rV7hijsGvn30S0+XvrYALhoprEA23pvSh/CFeHE0hPSRRd1bTrG0q/HqkX7hCHoV7tsOMrNChXh5QlP3ED1HLrODDx2RTfDaUJGurraezgQzbYLyQwoFdWbDqLmo76L3kJ5PuMOXNDDqmqK4mivohVbgi6p7XOu6h6ILO4RJdQW+7PeE61As3pbGi6JT6UWIvq5RimWHte4LjwwQqHV7y68vnd9DaC21qopfPjR12W+K50VfvCFj6tWTk27lD5YgeJTLb/qvubatfHFoWb6oP6UO8GI0Kc7mz/jQ3zMojMGyeHH92JQ0G2xu1mWC/Hu9ed90KcbRTOQQ+8OwznEJBFE0F899ffN18N5Bb1aKB/H88HHi+fev/nYZgfr3ObL3wZuJr/UvWvFHf7rUvVfdDFlvcbwqRyC5Rxlgmcsxi94IY8hVO72SGZmvvNyzQ4cOHTp06NChQ4cOHTp06NChQ4cOHTp06NChQ4cO/xX8H0i5zGwh2fjWAAAAAElFTkSuQmCC',
            'https://www.pngitem.com/pimgs/m/519-5196083_transparent-8-bit-clipart-small-pixel-art-carrot.png',
            'https://www.kindpng.com/picc/m/187-1874183_dresser-clipart-pixel-art-small-easy-pixel-art.png',
            'https://www.pngfind.com/pngs/m/227-2272433_pichu-small-pixel-art-grid-hd-png-download.png',
            'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/802ef158-f37f-4520-abcd-6abdf048eb45/d5qamec-998cf8e7-8457-4bad-be09-201c655082ab.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvODAyZWYxNTgtZjM3Zi00NTIwLWFiY2QtNmFiZGYwNDhlYjQ1XC9kNXFhbWVjLTk5OGNmOGU3LTg0NTctNGJhZC1iZTA5LTIwMWM2NTUwODJhYi5qcGcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.FpPB2r5Pzg7rqbp_iFEcnbHmBmf2FZY487Yj4JSfJ10',
            'https://media.npr.org/assets/img/2011/01/18/istock_000008186878small-59d7be65b2b8e157cb4f17e95131b9658f738848.jpg',
            'https://www.eggcelerate.com/egg/wp-content/uploads/2016/03/photodune-2196491-big-and-small-goldfish-l-scaled.jpg',
            'https://ksassets.timeincuk.net/wp/uploads/sites/56/2019/01/Small-living-room.jpg',
            'https://post.healthline.com/wp-content/uploads/2019/02/bunch_of_two_large_and_one_small_bananas-1200x628-facebook.jpg',
            'https://www.edgeip.com/images/FCK/Image/202002/00-SFG-SmallScholarshipsBigRewardsSFSCSIC.jpg'
        ][Math.floor(Math.random() * Math.floor(11))];
    }
}


// class cRichText {
//     constructor() {

//     }
// };

//General Functions for windows functionalities
mouseMoveDetect();

window.onscroll = function () {
    window.scrollTo(0, 0);
};

const Main = (props) => {
    const [board, setBoard] = useState(new _Board());
    const appRef = useRef(null);

    const addSwimlane = (sIndex) => {
        const newSwimlane = new _Swimlane();
        const tempBoard = { ...board };
        tempBoard.swimlanes.splice(sIndex + 1, 0, newSwimlane);

        setBoard(tempBoard);
    };

    const addColumn = (swimlaneId) => {
        const tempBoard = { ...board };

        const sIndex = tempBoard.swimlanes.findIndex((s) => s.id === swimlaneId);
        if (sIndex > -1){
            const swimlane = tempBoard.swimlanes.splice(sIndex, 1)[0];

            const column = new _Column(swimlaneId);

            swimlane.columns = [...swimlane.columns, column];

            tempBoard.swimlanes.splice(sIndex, 0, swimlane);

            setBoard(tempBoard);
        } else console.log('undefined Swimlane: ' + swimlaneId);
    };

    const addCard = (swimlaneId, columnId) => {
        const tempBoard = { ...board };

        const sIndex = tempBoard.swimlanes.findIndex((s) => s.id === swimlaneId);
        if (sIndex > -1){
            const swimlane = tempBoard.swimlanes.splice(sIndex, 1)[0];

            const cIndex = swimlane.columns.findIndex((c) => c.id === columnId);
            if (cIndex > -1){
                const column = swimlane.columns.splice(cIndex, 1)[0];

                column.cards = [...column.cards, new _Card(columnId)];

                swimlane.columns.splice(cIndex, 0, column);
                tempBoard.swimlanes.splice(sIndex, 0, swimlane);

                setBoard(tempBoard);
            } else console.log('undefined column: ' + columnId);
        } else console.log('undefined Swimlane: ' + swimlaneId);
    };

    const updateColumn = (swimlaneId, columnId, newProps) => {
        const tempBoard = { ...board };

        const sIndex = tempBoard.swimlanes.findIndex((s) => s.id === swimlaneId);
        if (sIndex > -1){
            const swimlane = tempBoard.swimlanes.splice(sIndex, 1)[0];

            let cIndex = swimlane.columns.findIndex((c) => c.id === columnId);
            if (cIndex > -1){
                const column = swimlane.columns.splice(cIndex, 1)[0];

                newProps.map((prop) => {
                    column[prop.property] = prop.newValue;
                    if (prop.property === 'editing' && prop.newValue === true) column.originalColumn = { ...column };
                });

                if (!column.toDelete){
                    if (column.cancelChanges){
                        column.title = column.originalColumn.title;
                        column.originalColumn = {};
                        column.cancelChanges = false;
                    }

                    if (column.moveColumnBy !== 0 && (((cIndex + column.moveColumnBy) >= 0) && ((cIndex + column.moveColumnBy) <= swimlane.columns.length))){
                        //If moveColumnBy is required
                        cIndex += column.moveColumnBy;
                        column.moveColumnBy = 0;
                    }

                    // eslint-disable-next-line no-constant-condition
                    if (true){
                        //If moveSwimlaneBy is required
                    }

                    swimlane.columns.splice(cIndex, 0, column);
                }
                tempBoard.swimlanes.splice(sIndex, 0, swimlane);

                setBoard(tempBoard);
            } else console.log('undefined column: ' + columnId);
        } else console.log('undefined Swimlane: ' + swimlaneId);
    };

    const updateCard = (swimlaneId, columnId, newProps) => {

    };

    const moveColumn = (sourceSwimlaneId, targetSwimlaneId, sourceColumnId = null, targetColumnId = null, sourceCardId = null, sourceIndex = null, targetIndex = null) => {

    };

    const moveCard = (sourceSwimlaneId, targetSwimlaneId, sourceColumnId = null, targetColumnId = null, sourceIndex = null, targetIndex = null) => {
        const tempBoard = { ...board };

        let sourceSwimlane = null;
        let sourceColumn = null;
        let sourceCard = null;
        let targetSwimlane = null;
        let targetColumn = null;

        //GET SOURCES
        const ssIndex = tempBoard.swimlanes.findIndex((s) => s.id === sourceSwimlaneId);
        if (ssIndex > -1){
            sourceSwimlane = tempBoard.swimlanes.splice(ssIndex, 1)[0];
            if (sourceColumnId !== null){
                const csIndex = sourceSwimlane.columns.findIndex((c) => c.id === sourceColumnId);
                if (csIndex > -1){
                    sourceColumn = sourceSwimlane.columns.splice(csIndex, 1)[0];
                    if (sourceIndex > -1){
                        sourceCard = sourceColumn.cards.splice(sourceIndex, 1)[0];

                        //GET TARGETS
                        if (sourceColumnId !== targetColumnId){

                            if (sourceSwimlaneId !== targetSwimlaneId){
                                //reconstruct source
                                sourceSwimlane.columns.splice(csIndex, 0, sourceColumn);
                                tempBoard.swimlanes.splice(ssIndex, 0, sourceSwimlane);

                                const stIndex = tempBoard.swimlanes.findIndex((s) => s.id === targetSwimlaneId);
                                if (stIndex > -1){
                                    targetSwimlane = tempBoard.swimlanes.splice(stIndex, 1)[0];

                                    const ctIndex = targetSwimlane.columns.findIndex((c) => c.id === targetColumnId);
                                    if (ctIndex > -1){
                                        //reconstruct target
                                        targetColumn = targetSwimlane.columns.splice(ctIndex, 1)[0];

                                        targetColumn.cards.splice(targetIndex, 0, sourceCard);
                                        targetSwimlane.columns.splice(ctIndex, 0, targetColumn);
                                        tempBoard.swimlanes.splice(stIndex, 0, targetSwimlane);
                                    }
                                }
                            } else {
                                sourceSwimlane.columns.splice(csIndex, 0, sourceColumn);

                                const ctIndex = sourceSwimlane.columns.findIndex((c) => c.id === targetColumnId);
                                if (ctIndex > -1){

                                    targetColumn = sourceSwimlane.columns.splice(ctIndex, 1)[0];

                                    //reconstruct target
                                    targetColumn.cards.splice(targetIndex, 0, sourceCard);
                                    sourceSwimlane.columns.splice(ctIndex, 0, targetColumn);
                                    tempBoard.swimlanes.splice(ssIndex, 0, sourceSwimlane);

                                }
                            }
                        } else {
                            //reconstruct source
                            sourceColumn.cards.splice(targetIndex, 0, sourceCard);
                            sourceSwimlane.columns.splice(csIndex, 0, sourceColumn);
                            tempBoard.swimlanes.splice(ssIndex, 0, sourceSwimlane);
                        }
                    }
                }
            }
        }

        setBoard(tempBoard);
    };

    const getParentId = (sourceType, id) => {
        const tempboard = { ...board };

        let parentId = null;

        switch (sourceType) {
            case 'CARD':{
                tempboard.swimlanes.forEach((sl) => {
                    sl.columns.forEach((c) => {
                        c.cards.forEach((ca) => {
                            if (ca.id === id) {
                                parentId = c.id;
                            }
                        });
                    });
                });
                break;
            }
            case 'COLUMN':{
                tempboard.swimlanes.forEach((sl) => {
                    sl.columns.forEach((c) => {
                        if (c.id === id) {
                            parentId = sl.id;
                        }
                    });
                });
                break;
            }
            default:
                break;
        }

        return parentId;
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const { source, destination } = result;
        switch (result.type) {
            case 'CARD':{
                const sourceSwimlaneId = getParentId('COLUMN', source.droppableId);
                const targetSwimlaneId = getParentId('COLUMN', destination.droppableId);
                moveCard(sourceSwimlaneId, targetSwimlaneId, source.droppableId, destination.droppableId, source.index, destination.index);
                break;
            }

            default:
                break;
        }
    };

    const returnContentElement = (contentElement, cIndex = null) => {
        let element;
        switch (contentElement.constructor.name) {
            case '_cTaskList':
                element = (
                    <div className="cTasklist">
                        <h2 className="cTasklist-title">{contentElement.title}</h2>
                        <div className="tasks-container">{
                            contentElement.tasks.map((cTask, tIndex) => (
                                returnContentElement(cTask, tIndex)
                            ))
                        }
                        </div>
                    </div>
                );
                break;
            case '_cTask':
                element = (
                    <div className="cTask" key={cIndex}>
                        <div className="form-checkbox">
                            <input type="checkbox" id={contentElement.title} name={contentElement.title} value={contentElement.title} checked={contentElement.checked}/>
                            <label htmlFor={contentElement.title}>{contentElement.title}</label>
                        </div>
                        {contentElement.tasks.length > 0 ?
                            <div className="task-subtasks">
                                {
                                    contentElement.tasks.map((cTask, tIndex) => (
                                        returnContentElement(cTask, tIndex)
                                    ))
                                }
                            </div>
                            :undefined
                        }
                    </div>
                );
                break;
            case '_cText':
                element = (<p className="cText">{contentElement.text}</p>);
                break;
            case '_cMarkdownText':
                element = (<div className="cMarkdownText"><ReactMarkdown plugins={[gfm]} renderers={{ code: CodeBlock }}>{contentElement.text}</ReactMarkdown></div>);
                break;
            case '_cImage':
                element = (<img className="cImage" alt={contentElement.alt} src={contentElement.url} />);
                break;
            default:
                break;
        }
        return element;
    };

    const callResizeUpdate = (appWidth, appHeight) => {
        ipc.send('ResizeMainWindow', [appWidth, appHeight]);
    };

    useEffect(() => { //Initial Render load Data
        if (board.swimlanes.length === 0) addSwimlane();
    }, []);

    useEffect(() => {
        const appHeight = appRef.current.offsetHeight;
        const appWidth = appRef.current.offsetWidth;
        callResizeUpdate(appWidth, appHeight);
    }, [appRef, board]);

    const functions = {
        'addSwimlane': (sindex) => addSwimlane(sindex),
        'addColumn': (swimlaneId) => addColumn(swimlaneId),
        'addCard': (swimlaneId, columnId) => addCard(swimlaneId, columnId),
        'updateColumn': (swimlaneId, columnId, newprops) => updateColumn(swimlaneId, columnId, newprops),
        'returnContentElement': (contentElement, cIndex) => returnContentElement(contentElement, cIndex)
    };

    return (
        <div className="App" ref={appRef}>
            <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                {
                    board.swimlanes.map(
                        (sl, index) => (
                            <Swimlane functions={functions} swimlane={sl} key={index} index={index}></Swimlane>
                        )
                    )
                }
            </DragDropContext>
        </div>
    );
};

export default Main;