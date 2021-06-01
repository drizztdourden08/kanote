import React, { useEffect, useState, useRef } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import CodeBlock from './components/CodeBlock';

import { mouseMoveDetect } from '../scripts/ElectronClickThrough';

import { loremIpsum, name, surname } from 'react-lorem-ipsum';

import './Main.css';

import Verticalgroup from './components/Verticalgroup';
import Swimlane from './components/Swimlane';
import Column from './components/Column';
import ExpandingButtons from './components/ExpandingButtons';

import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

const imageToBase64 = require('image-to-base64');
const ba64 = require('ba64');

const ipc = window.require('electron').ipcRenderer;

class Color {
    constructor(hexColor) {
        this._hex = hexColor;
        console.log(hexColor);
        this.red = hexColor ? parseInt(hexColor[0] + hexColor[1], 16) : null;
        this.green = hexColor ? parseInt(hexColor[2] + hexColor[3], 16) : null;
        this.blue = hexColor ? parseInt(hexColor[4] + hexColor[5], 16) : null;
    }
    static FromRGB(red, green, blue) {
        if ((red >= 0 && red <= 255) === false) return;
        if ((green >= 0 && green <= 255) === false) return;
        if ((blue >= 0 && blue <= 255) === false) return;

        return new Color('#' + red.ToString(16) + green.ToString(16) + blue.ToString(16));
    }

    set hex(value) {
        const rgx = new RegExp('[0-9]{6}');
        if (rgx.test(value) === false) {
            return;
        }
        this._hex = value;
    }

    get hex() {
        return '#' + this._hex;
    }

    get rgb() {
        return { red: this.red, green: this.green, blue: this.blue };
    }
}
class ArrayOf {
    constructor(objTypes) {
        this.value = [];
        this.objTypes = objTypes;
    }

    add(val) {
        if (this.objTypes.indexOf(val.constructor.name) === -1) return;
        this.value.push(val);
    }

    insert(val, index) {
        if (this.objTypes.indexOf(val.constructor.name) === -1) return;
        if (index === -1) return;
        this.value.splice(index, 0, val);
    }

    remove(val) {
        if (this.objTypes.indexOf(val.constructor.name) === -1) return;

        const index = this.value.findIndex((Id) => Id === val.id);
        this.value.splice(index, 1);
    }

    removeAt(index) {
        if (index === -1) return;
        this.value.splice(index, 1);
    }

    extract(id) {
        if (uuidValidate(id) === false) return;

        const index = this.value.findIndex((v) => v.id === id);
        if (index > -1) {
            const o = this.value.splice(index, 1)[0];

            return [o, index, o.constructor.name];
        } else {
            return;
        }
    }

    extractAt(index) {
        if (index > -1) return this.value.splice(index, 1)[0];
    }

    get array() {
        return this.value;
    }
}

class _Board {
    constructor() {
        this.id = uuidv4();
        this._title = 'Board ' + Math.floor(Math.random() * Math.floor(100)) + '';
        this._childrens = new ArrayOf(['_Swimlane', '_Column', '_VerticalGroup']);
        this._priorities = new ArrayOf(['_Priority']);
        this._tags = new ArrayOf(['_Tag']);
    }

    set title(value) {
        const rgx = new RegExp('[A-Za-z0-9]{3,30}');
        if (rgx.test(value) === false) {
            return;
        }

        this._title = value;
    }
    get title() {
        return this._title;
    }

    set childrens(value) {
        if (Array.isArray(value)) {
            value.map((el) => {
                if (['_Column', '_VerticalGroup'].indexOf(el.constructor.name) === -1) return;
            });
            this._childrens = value;
        }
    }
    get childrens() {
        return this._childrens;
    }

    set priorities(value) {
        if (Array.isArray(value)) {
            value.map((el) => {
                if (el.constructor.name !== '_Priority') return;
            });
            this._priorities = value;
        }
    }
    get priorities() {
        return this._priorities;
    }

    set tags(value) {
        if (Array.isArray(value)) {
            value.map((el) => {
                if (el.constructor.name !== '_Tag') return;
            });
            this._tags = value;
        }
    }
    get tags() {
        return this._tags;
    }
}

class _VerticalGroup {
    constructor() {
        this.id = uuidv4();
        this._title = 'VerticalGroup ' + Math.floor(Math.random() * Math.floor(100)) + '';
        this._childrens = new ArrayOf(['_Swimlane']);
        this.lockedSwimlane = false;
    }

    set childrens(value) {
        if (Array.isArray(value)) {
            value.map((el) => {
                if (el.constructor.name !== '_Swimlane') return;
            });
            this._childrens = value;
        }
    }
    get childrens() {
        return this._childrens;
    }
}

class _Swimlane {
    constructor() {
        this.id = uuidv4();
        this._title = 'Swimlane ' + Math.floor(Math.random() * Math.floor(100)) + '';
        this._childrens = new ArrayOf(['_Column', '_VerticalGroup']);
    }

    set title(value) {
        const rgx = new RegExp('[A-Za-z0-9]{3,30}');
        if (rgx.test(value) === false) {
            return;
        }

        this._title = value;
    }
    get title() {
        return this._title;
    }

    set childrens(value) {
        if (Array.isArray(value)) {
            value.map((el) => {
                if (el.constructor.name !== '_Column') return;
            });
            this._childrens = value;
        }
    }
    get childrens() {
        return this._childrens;
    }
}

class _Column {
    constructor() {
        this.id = uuidv4();
        this._icon = 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/WPVG_icon_2016.svg/1024px-WPVG_icon_2016.svg.png';
        this._title = 'Column ' + Math.floor(Math.random() * Math.floor(100)) + '';
        this._childrens = new ArrayOf(['_Card']);
        this.editing = false;
        this.toDelete = false;
        this.cancelChanges = false;
        this.originalColumn = {};
    }

    set title(value) {
        const rgx = new RegExp('[A-Za-z0-9]{3,30}');
        if (rgx.test(value) === false) {
            return;
        }

        this._title = value;
    }
    get title() {
        return this._title;
    }

    set childrens(value) {
        if (Array.isArray(value)) {
            value.map((el) => {
                if (el.constructor.name !== '_Card') return;
            });
            this._childrens = value;
        }
    }
    get childrens() {
        return this._childrens;
    }
}

class _Card {
    constructor() {
        this.id = uuidv4();
        this._title = 'Card ' + Math.floor(Math.random() * Math.floor(100)) + '';
        this._priority = new _Priority();
        this._imageSource = '';
        this.image = {
            fromUrlToBase64(url) {
                imageToBase64(url).then(base64 => {
                    this._imageSource = base64;
                    this.alt = url.split('\\').pop().split('/').pop();
                });
            },
            fromlocalPathToBase64(path) {
                imageToBase64(path).then(base64 => {
                    this._imageSource = base64;
                    this.alt = path.split('\\').pop().split('/').pop();
                });
            },
            fromUrlToLocal(base64) {
                return;
            },
            fromBase64ToLocal(base64, pathToSave) {
                ba64.writeImage(pathToSave, base64, () => {
                    return;
                });

                const ext = ba64.getExt(base64);
                this._imageSource = pathToSave + ext;
            },
            fromUrl(url) {
                //const expressionTest = '^(?<scheme>[A-Za-z][A-Za-z0-9\+\.\-]+?\:)?(?:\/\/)?(?<Authority>(?<userinfo>[A-Za-z0-9\-\.\_\~\%\!\$\&\'\(\)\*\+\,\;\=]+\:?\@)?(?<host>\[?(?:(?:[0-9]{3}\.){3}[0-9]{3}|(?:[A-Fa-f0-9]*\:?){1,8}|[A-Za-z0-9\-\.\_\~\%\!\$\&\'\(\)\*\+\,\;\=]+)\]?)?\:?(?<port>[0-9]+)?)?\/?(?<path>(?<segment>\/?:?[A-Za-z0-9\-\.\_\~\%\!\$\&\'\(\)\*\+\,\;\=]*)+)?(?<query>\?[A-Za-z0-9\-\.\_\~\%\!\$\&\'\(\)\*\+\,\;\=\:\@\/\?]+)?(?<fragment>\#[A-Za-z0-9\-\.\_\~\%\!\$\&\'\(\)\*\+\,\;\=\:\@\/\?]+)?$';
                const expression = '(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})';
                const rgx = new RegExp(expression);
                if (rgx.test(url)) {
                    this._imageSource = url;
                }
            }
        };
        this._tags = new ArrayOf(['_Tags']);
        this._content = new ArrayOf(['_cTaskList', '_cText', '_cMarkdownText', '_cImage']);
        this._created = Date.now();
        this._dueDate =
            this._comments = new ArrayOf(['_Comment']);
        this.datetime = {
            timeLeft() {
                return this.dueDate - this.created;
            },
            breached() {
                return this.timeLeft > 0 ? false : true;
            }
        };
        this._notification = false;
        this._assignees = new ArrayOf(['_Assignee']);
        this._accentColor = new Color();
        this.editing = false;
        this.toDelete = false;
        this.cancelChanges = false;
        this.originalCard = {};
    }

    set title(value) {
        const rgx = new RegExp('[A-Za-z0-9]{3,30}');
        if (rgx.test(value) === false) {
            return;
        }

        this._title = value;
    }
    get title() {
        return this._title;
    }

    set priority(value) {
        if (value.constructor.name !== '_Priority') {
            return;
        }

        this._priority = value;
    }
    get priority() {
        return this._priority;
    }

    set imageSource(value) {
        this._imageSource = value;
    }
    get imageSource() {
        return this._imageSource;
    }

    get tags() {
        return this._tags;
    }

    get content() {
        return this._content;
    }

    get created() {
        return this._created;
    }

    set dueDate(value) {
        const d = new Date(value);
        if (isNaN(d.getTime())) {
            return;
        }

        if (d <= this._created) {
            return;
        }

        this._dueDate = value;
    }
    get dueDate() {
        return this._dueDate;
    }

    set notification(value) {
        if (typeof (value) === 'boolean') {
            return;
        }
        this._notification = value;
    }
    get notification() {
        return this._notification;
    }

    get assignees() {
        return this._assignees;
    }

    get comments() {
        return this._comments;
    }

    set accentColor(value) {
        if (value.constructor.name !== 'Color') {
            return;
        }

        this._accentColor = value;
    }
    get accentColor() {
        return this._accentColor;
    }
}

class _Priority {
    constructor() {
        this.id = uuidv4();
        this._title = ['High', 'Medium', 'Low'][Math.floor(Math.random() * Math.floor(3))];
        this._color = new Color(Math.floor(Math.random() * 16777215).toString(16));
        this._level = Math.floor(Math.random() * Math.floor(10));
    }

    set title(value) {
        const rgx = new RegExp('[A-Za-z0-9]{3,10}');
        if (rgx.test(value) === false) {
            return;
        }

        this._title = value;
    }
    get title() {
        return this._title;
    }

    set color(value) {
        if (value.constructor.name !== 'Color') {
            return;
        }

        this._color = value;
    }
    get color() {
        return this._color;
    }

    set level(value) {
        const rgx = new RegExp('[0-9]+');
        if (rgx.test(value) === false) {
            return;
        }
        this._level = value;
    }
    get level() {
        return '#' + this._level;
    }
}

class _Assignee {
    constructor() {
        this.id = uuidv4();
        this._firstName = name();
        this._lastName = surname();
        this._color = new Color(this.color(Math.floor(Math.random() * 16777215).toString(16)));
    }

    set firstName(value) {
        const rgx = new RegExp('[A-zÀ-ÖØ-öø-įĴ-őŔ-žǍ-ǰǴ-ǵǸ-țȞ-ȟȤ-ȳɃɆ-ɏḀ-ẞƀ-ƓƗ-ƚƝ-ơƤ-ƥƫ-ưƲ-ƶẠ-ỿ \\-\'\\.]{3,10}');
        if (rgx.test(value) === false) {
            return;
        }

        this._firstName = value.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    }
    get firstName() {
        return this._firstName;
    }

    set lastName(value) {
        const rgx = new RegExp('[A-zÀ-ÖØ-öø-įĴ-őŔ-žǍ-ǰǴ-ǵǸ-țȞ-ȟȤ-ȳɃɆ-ɏḀ-ẞƀ-ƓƗ-ƚƝ-ơƤ-ƥƫ-ưƲ-ƶẠ-ỿ \\-\'\\.]{3,10}');
        if (rgx.test(value) === false) {
            return;
        }

        this._lastName = value.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    }
    get lastName() {
        return this._lastName;
    }

    get initial() {
        return this._firstName[0] + this._lastName[0];
    }

    get fullname() {
        return this._firstName + '' + this._lastName;
    }

    set color(value) {
        if (value.constructor.name !== 'Color') {
            return;
        }

        this._color = value;
    }
    get color() {
        return this._color;
    }
}

class _Comment {
    constructor() {
        this.id = uuidv4();
        this._text = '';
        this._timestamp = Date.now();
        this._author = {};
    }

    set text(value) {
        this._text = value;
    }
    get text() {
        return this._text;
    }

    set author(value) {
        if (value.constructor.name !== '_Assignee') {
            return;
        }
        this._author = value;
    }
    get author() {
        return this._author;
    }
}

class _cTaskList {
    constructor() {
        this.id = uuidv4();
        this._title = 'Tasklist ' + Math.floor(Math.random() * Math.floor(10));
        this._tasks = new ArrayOf(['_cTask']);
    }

    set title(value) {
        const rgx = new RegExp('[A-Za-z0-9]{3,10}');
        if (rgx.test(value) === false) {
            return;
        }

        this._title = value;
    }
    get title() {
        return this._title;
    }

    set tasks(value) {
        if (Array.isArray(value)) {
            value.map((el) => {
                if (el.constructor.name !== '_cTask') return;
            });
            this._tasks = value;
        }
    }
    get tasks() {
        return this._tasks;
    }
}

class _cTask {
    constructor(parentTaskId = null) {
        this.id = uuidv4();
        this._parentTaskId = parentTaskId;
        this._title = 'task ' + Math.floor(Math.random() * Math.floor(10));
        this._checked = Math.random() < 0.5;
        this._tasks = new ArrayOf(['_cTask']);
    }

    set parentTaskId(value) {
        if (uuidValidate(value) === false) {
            return;
        }

        this._parentTaskId = value;
    }
    get parentTaskId() {
        return this._parentTaskId;
    }

    set title(value) {
        const rgx = new RegExp('[A-Za-z0-9]{3,10}');
        if (rgx.test(value) === false) {
            return;
        }

        this._title = value;
    }
    get title() {
        return this._title;
    }

    set checked(value) {
        if (typeof (value) !== 'boolean') {
            return;
        }

        this._checked = value;
    }
    get checked() {
        return this._checked;
    }

    set tasks(value) {
        if (Array.isArray(value)) {
            value.map((el) => {
                if (el.constructor.name !== '_cTask') return;
            });
            this._tasks = value;
        }
    }
    get tasks() {
        return this._tasks;
    }
}

class _cText {
    constructor() {
        this.id = uuidv4();
        this._text = loremIpsum({ p: 1, avgWordsPerSentence: 8, avgSentencesPerParagraph: 2 });
    }

    set text(value) {
        this._text = String(value);
    }
    get text() {
        return this._text;
    }
}

class _cMarkdownText {
    constructor() {
        this.id = uuidv4();
        this._text = `
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

    set text(value) {
        this._text = String(value);
    }
    get text() {
        return this._text;
    }
}

class _cImage {
    constructor() {
        this.id = uuidv4();
        this._alt = 'altimage ' + Math.floor(Math.random() * Math.floor(10));
        this._imageSource = this.image.fromUrlToBase64(
            [
                'https://clipartart.com/images/small-flowers-clip-art-23.jpg',
                'data:image/png;base64,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',
                'https://www.pngitem.com/pimgs/m/519-5196083_transparent-8-bit-clipart-small-pixel-art-carrot.png',
                'https://www.kindpng.com/picc/m/187-1874183_dresser-clipart-pixel-art-small-easy-pixel-art.png',
                'https://www.pngfind.com/pngs/m/227-2272433_pichu-small-pixel-art-grid-hd-png-download.png',
                'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/802ef158-f37f-4520-abcd-6abdf048eb45/d5qamec-998cf8e7-8457-4bad-be09-201c655082ab.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvODAyZWYxNTgtZjM3Zi00NTIwLWFiY2QtNmFiZGYwNDhlYjQ1XC9kNXFhbWVjLTk5OGNmOGU3LTg0NTctNGJhZC1iZTA5LTIwMWM2NTUwODJhYi5qcGcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.FpPB2r5Pzg7rqbp_iFEcnbHmBmf2FZY487Yj4JSfJ10',
                'https://media.npr.org/assets/img/2011/01/18/istock_000008186878small-59d7be65b2b8e157cb4f17e95131b9658f738848.jpg',
                'https://www.eggcelerate.com/egg/wp-content/uploads/2016/03/photodune-2196491-big-and-small-goldfish-l-scaled.jpg',
                'https://ksassets.timeincuk.net/wp/uploads/sites/56/2019/01/Small-living-room.jpg',
                'https://post.healthline.com/wp-content/uploads/2019/02/bunch_of_two_large_and_one_small_bananas-1200x628-facebook.jpg',
                'https://www.edgeip.com/images/FCK/Image/202002/00-SFG-SmallScholarshipsBigRewardsSFSCSIC.jpg'
            ][Math.floor(Math.random() * Math.floor(11))]
        );
        this.image = {
            fromUrlToBase64(url) {
                imageToBase64(url).then(base64 => {
                    this._imageSource = base64;
                    this.alt = url.split('\\').pop().split('/').pop();
                });
            },
            fromlocalPathToBase64(path) {
                imageToBase64(path).then(base64 => {
                    this._imageSource = base64;
                    this.alt = path.split('\\').pop().split('/').pop();
                });
            },
            fromUrlToLocal(base64) {
                return;
            },
            fromBase64ToLocal(base64, pathToSave) {
                ba64.writeImage(pathToSave, base64, () => {
                    return;
                });

                const ext = ba64.getExt(base64);
                this._imageSource = pathToSave + ext;
            },
            fromUrl(url) {
                const expression = '(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})';
                const rgx = new RegExp(expression);
                if (rgx.test(url)) {
                    this._imageSource = url;
                }
            }
        };
    }

    set alt(value) {
        const rgx = new RegExp('[A-Za-z0-9]{3,20}');
        if (rgx.test(value)) {
            this._alt = value;
        } else {
            this._alt = value.substring(0, 19);
        }
    }
    get alt() {
        return this._alt;
    }

    set image(value) {
        this._imageSource = value;
    }
    get image() {
        return this._imageSource;
    }

    set imageSource(value) {
        this._imageSource = value;
    }
    get imageSource() {
        return this._imageSource;
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
    const [placeholderProps, setPlaceholderProps] = useState({});
    const [board, setBoard] = useState(new _Board());
    const [isDropDisabled, setIsDropDisabled] = useState({ board: false, verticalgroup: false, swimlane: false });
    const appRef = useRef(null);


    const modifySubItem = (mainObj, targetInfo, functions) => {
        const objects = [];
        const results = [];

        if (targetInfo && targetInfo.object.id !== mainObj.id) {
            for (let i = 0; i < targetInfo.idsHierarchy.length; i++) {
                if (i === 0) { // 0 is always main _Board
                    const obj = mainObj.childrens.extract(targetInfo.idsHierarchy[i + 1]);
                    objects.push(obj);
                } else if (i === targetInfo.idsHierarchy.length - 1) { //Last in hierarchy is always the current parent
                    //Apply all functions with their arguments here.
                    functions.forEach((f) => {
                        results.push(objects[i - 1][0].childrens[f.functionName](...f.arguments));
                    });
                } else {
                    const c = objects[i - 1][0];
                    const obj = c.childrens.extract(targetInfo.idsHierarchy[i + 1]);
                    objects.push(obj);
                }
            }

            for (let i = objects.length - 1; i >= 0; i--) {
                if (i === 0) {
                    mainObj.childrens.insert(objects[0][0], objects[0][1]);
                } else {
                    objects[i - 1][0].childrens.insert(objects[i][0], objects[i][1]);
                }
            }
        } else {
            functions.forEach((f) => {
                results.push(mainObj.childrens[f.functionName](...f.arguments));
            });
        }
        return [mainObj, results];
    };

    const addItem = (itemType, parentId = null, index) => {
        const tempBoard = new _Board();
        Object.assign(tempBoard, board);

        const elInfo = getElementInfo(parentId);

        const newVerticalgroup = new _VerticalGroup();
        newVerticalgroup.childrens.add(new _Swimlane());

        let objectToAdd;
        switch (itemType) {
            case '_Column':
                objectToAdd = new _Column();
                break;
            case '_Swimlane':
                if (elInfo) {
                    switch (elInfo.type) {
                        case '_Board':
                            objectToAdd = newVerticalgroup;
                            break;
                        case '_Swimlane':
                            objectToAdd = newVerticalgroup;
                            break;
                        case '_VerticalGroup':
                            objectToAdd = new _Swimlane();
                            break;
                        default:
                            break;
                    }
                } else {
                    objectToAdd = newVerticalgroup;
                }
                break;
            case '_Card':
                objectToAdd = new _Card();
                break;
            default:
                break;
        }

        const args = [objectToAdd, index];
        const [FinalBoard, results] = modifySubItem(tempBoard, elInfo, [{ functionName: 'insert', arguments: args }]);

        setBoard(FinalBoard);
    };

    const moveItem = (sourceId, itemId, targetId, targetIndex) => {
        const tempBoard = new _Board();
        Object.assign(tempBoard, board);

        const sourceInfo = getElementInfo(sourceId);
        const [ModBoard, results] = modifySubItem(tempBoard, sourceInfo, [{ functionName: 'extract', arguments: [itemId] }]);

        const targetInfo = getElementInfo(targetId);
        const [FinalBoard] = modifySubItem(ModBoard, targetInfo, [{ functionName: 'insert', arguments: [results[0][0], targetIndex] }]);

        setBoard(FinalBoard);
    };

    const updateItem = (itemId, newProps) => {
        const tempBoard = new _Board();
        Object.assign(tempBoard, board);
    };

    const updateColumn = (swimlaneId, columnId, newProps) => {
        const tempBoard = new _Board();
        Object.assign(tempBoard, board);

        const [swimlane, sIndex] = tempBoard.childrens.extract(swimlaneId);
        const [column, cIndex] = swimlane.columns.extract(columnId);

        newProps.map((prop) => {
            column[prop.property] = prop.newValue;
            if (prop.property === 'editing' && prop.newValue === true) column.originalColumn = { ...column };
        });

        if (!column.toDelete) {
            if (column.cancelChanges) {
                column.title = column.originalColumn.title;
                column.originalColumn = {};
                column.cancelChanges = false;
            }

            let moveMod = 0;
            if (column.moveColumnBy !== 0 && (((cIndex + column.moveColumnBy) >= 0) && ((cIndex + column.moveColumnBy) <= swimlane.columns.length))) {
                //If moveColumnBy is required
                moveMod = column.moveColumnBy;
                column.moveColumnBy = 0;
            }

            // eslint-disable-next-line no-constant-condition
            if (true) {
                //If moveSwimlaneBy is required
            }

            swimlane.columns.insert(column, cIndex + moveMod);
        }
        tempBoard.childrens.insert(swimlane, sIndex);

        setBoard(tempBoard);
    };

    const updateCard = (swimlaneId, columnId, cardId, newProps) => {
        const tempBoard = new _Board();
        Object.assign(tempBoard, board);

        console.log('sl: ', swimlaneId, ' c: ', columnId, 'ca: ', cardId, 'np: ', newProps);
        const sIndex = tempBoard.childrens.findIndex((s) => s.id === swimlaneId);
        if (sIndex > -1) {
            const swimlane = tempBoard.childrens.splice(sIndex, 1)[0];

            const cIndex = swimlane.columns.findIndex((c) => c.id === columnId);
            if (cIndex > -1) {
                const column = swimlane.columns.splice(cIndex, 1)[0];

                const caIndex = column.cards.findIndex((ca) => ca.id === cardId);
                if (caIndex > -1) {
                    const card = column.cards.splice(caIndex, 1)[0];

                    newProps.map((prop) => {
                        card[prop.property] = prop.newValue;
                        if (prop.property === 'editing' && prop.newValue === true) column.originalColumn = { ...column };
                    });

                    column.cards.splice(caIndex, 0, card);
                    swimlane.columns.splice(cIndex, 0, column);
                    tempBoard.childrens.splice(sIndex, 0, swimlane);
                    setBoard(tempBoard);
                } else console.log('undefined card: ' + columnId);
            } else console.log('undefined column: ' + columnId);
        } else console.log('undefined Swimlane: ' + swimlaneId);
    };

    const getElementInfo = (id, object = null, parentType = null, parentId = null) => {
        if (object === null) {
            object = new _Board();
            Object.assign(object, board);
        }

        if (object) {
            if (object.id === id) {
                return { object: object, type: object.constructor.name, parentId: parentId, parentType: parentType, idsHierarchy: [id] };
            } else {
                if (object.childrens) {
                    for (let i = 0; i < object.childrens.array.length; i++) {
                        const result = getElementInfo(id, object.childrens.array[i], object.constructor.name, object.id);
                        if (result) {
                            result.idsHierarchy = [object.id, ...result.idsHierarchy];
                            return result;
                        }
                    }
                }
            }
        } else {
            return null;
        }
        return null;
    };

    const getDraggedDom = (draggableId) => {
        const queryAttr = 'data-rbd-draggable-id';
        const domQuery = `[${queryAttr}='${draggableId}']`;
        const draggedDom = document.querySelector(domQuery);
        return draggedDom;
    };

    const setPlaceHolderPosition = (draggableId, sourceIndex, destinationIndex = null) => {
        const draggedDom = getDraggedDom(draggableId);
        if (!draggedDom) {
            return;
        }

        const clientHeight = draggedDom.clientHeight - 10;
        const clientWidth = draggedDom.clientWidth - 10;

        let childrenArray = [...draggedDom.parentNode.children];

        if (destinationIndex !== null) {
            const movedItem = childrenArray[sourceIndex];
            childrenArray.splice(sourceIndex, 1);

            childrenArray = [
                ...childrenArray.slice(0, destinationIndex),
                movedItem,
                ...childrenArray.slice(destinationIndex + 1)
            ];
        }

        const clientX = parseFloat(window.getComputedStyle(draggedDom.parentNode).paddingLeft);
        var clientY =
            parseFloat(window.getComputedStyle(draggedDom.parentNode).paddingTop) +
            childrenArray.slice(0, destinationIndex !== null ? destinationIndex : sourceIndex).reduce((total, curr) => {
                const style = curr.currentStyle || window.getComputedStyle(curr);
                const marginBottom = parseFloat(style.marginBottom);
                return total + curr.clientHeight + marginBottom;
            }, 0);

        setPlaceholderProps({
            clientHeight,
            clientWidth,
            clientY,
            clientX
        });
    };

    const onDragStart = (dragInfo) => {
        if (!dragInfo) {
            return;
        }

        let board = true;
        let verticalgroup = true;
        let swimlane = true;

        const elInfo = getElementInfo(dragInfo.draggableId);

        switch (elInfo.parentType) {
            case '_Board':
                board = false;
                break;
            case '_VerticalGroup':
                verticalgroup = false;
                break;
            case '_Swimlane':
                swimlane = false;
                break;
            default:
                break;
        }

        setIsDropDisabled({ board: board, verticalgroup: verticalgroup, swimlane: swimlane });

        setPlaceHolderPosition(dragInfo.draggableId, dragInfo.source.index);
    };

    const onDragUpdate = (dragInfo) => {
        if (!dragInfo.destination) {
            return;
        }

        setPlaceHolderPosition(dragInfo.draggableId, dragInfo.source.index, dragInfo.destination.index);
    };

    const onDragEnd = (dragInfo) => {
        setPlaceholderProps({});
        // dropped outside the list
        if (!dragInfo.destination) {
            return;
        }

        moveItem(dragInfo.source.droppableId, dragInfo.draggableId, dragInfo.destination.droppableId, dragInfo.destination.index);
        setIsDropDisabled({ board: true, verticalgroup: true, swimlane: true });
    };


    const returnContentElement = (contentElement, cIndex = null, func = undefined) => {
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
                            <input type="checkbox" id={contentElement.title} name={contentElement.title} value={contentElement.title} checked={contentElement.checked} />
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
                            : undefined
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
        if (board.childrens.array.length === 0) {
            console.log('done');
        }
    }, []);

    useEffect(() => {
        const appHeight = appRef.current.offsetHeight;
        const appWidth = appRef.current.offsetWidth;
        callResizeUpdate(appWidth, appHeight);
    }, [appRef, board]);

    const renderSwitch = (children, index, isDropDisabled, parentId, placeholderprops) => {
        switch (children.constructor.name) {
            case '_Swimlane':
                return <Swimlane functions={functions} swimlane={children} key={index} index={index} isDropDisabled={isDropDisabled} parentId={parentId} placeholderprops={placeholderprops}/>;
            case '_VerticalGroup':
                return <Verticalgroup functions={functions} verticalgroup={children} key={index} index={index} isDropDisabled={isDropDisabled} parentId={parentId} placeholderprops={placeholderprops}/>;
            case '_Column':
                return <Column functions={functions} column={children} key={index} index={index} isDropDisabled={isDropDisabled} parentId={parentId} placeholderprops={placeholderprops}/>;
            default:
                return undefined;
        }
    };

    const functions = {
        'addItem': (itemType, parentId, index) => addItem(itemType, parentId, index),
        'updateColumn': (swimlaneId, columnId, newprops) => updateColumn(swimlaneId, columnId, newprops),
        'updateCard': (swimlaneId, columnId, cardId, newprops) => updateCard(swimlaneId, columnId, cardId, newprops),
        'returnContentElement': (contentElement, cIndex, func) => returnContentElement(contentElement, cIndex, func),
        'getElementInfo': (sourceType, id) => getElementInfo(sourceType, id),
        'renderSwitch': (children, index, isDropDisabled, parentId, placeholderprops) => renderSwitch(children, index, isDropDisabled, parentId, placeholderprops)
    };

    return (
        <div className="app" ref={appRef}>
            <DragDropContext onDragEnd={(dragInfo) => onDragEnd(dragInfo)} onDragStart={(dragInfo) => onDragStart(dragInfo)} onDragUpdate={(dragInfo) => onDragUpdate(dragInfo)}>
                <ExpandingButtons vertical={true} alwaysOn={!board.childrens.array.length} buttons={['_Column', '_Swimlane']} parentId={board.id} addItem={functions.addItem} />
                <Droppable droppableId={board.id} direction="horizontal" isDropDisabled={isDropDisabled.board}>
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={snapshot.isDraggingOver ? 'board-childrens column-visible' : 'board-childrens'}
                        >
                            {board.childrens.array.map((children, index) => renderSwitch(children, index, isDropDisabled, board.id, placeholderProps))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default Main;