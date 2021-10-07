import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import CodeBlock from './CodeBlock';

const Task = (props) => {
    const content = props.content;
    return (
        <div className="content-task">
            <div className="form-checkbox">
                <input type="checkbox" id={content.title} name={content.title} value={content.title} checked={content.checked} />
                <label htmlFor={content.title}>{content.title}</label>
            </div>
            {content.childrens.length > 0 ?
                <div className="task-childrens">
                    {
                        content.childrens.array.map((task, index) => (
                            <Task content={task} key={index} />
                        ))
                    }
                </div>
                : undefined
            }
        </div>
    );
};

const TaskList = (props) => {
    const content = props.content;
    return (
        <div className="content-tasklist">
            <h2 className="content-tasklist-title">{content.title}</h2>
            {content.childrens.length > 0 ?
                <div className="task-childrens">
                    {
                        content.childrens.array.map((task, index) => (
                            <Task content={task} key={index} />
                        ))
                    }
                </div>
                : undefined
            }
        </div>
    );
};

const Text = (props) => {
    const content = props.content;
    const [editable, setEditable] = useState(false);
    const textRef = useRef(null);

    useEffect(() => {
        if (editable) {
            textRef.current.focus();
            document.execCommand('selectAll', false, null);
            document.getSelection().collapseToEnd();
        }
    });

    const ToggleEditing = (value) => {
        let newValue;
        if (value) newValue = value;
        else newValue = !editable;

        setEditable(newValue);

        if (!newValue) {
            props.updateItem(content.id, [{ property: 'text', newValue: textRef.current.innerText }]);
        }


    };

    return (
        <div ref={textRef} contentEditable={editable} onDoubleClick={() => ToggleEditing(true)} onBlur={() => ToggleEditing(false)} className="content-text">{content.text}</div>
    );
};

const MarkdownText = (props) => {
    const content = props.content;
    return (
        <div className="content-markdown-text"><ReactMarkdown plugins={[gfm]} renderers={{ code: CodeBlock }}>{content.text}</ReactMarkdown></div>
    );
};

const Image = (props) => {
    const content = props.content;
    return (
        <img className="content-image" alt={content.alt} src={content.image} />
    );
};


const ContentElement = (props) => {
    const renderEl = () => {
        switch (props.content.constructor.name) {
            case '_cTaskList': return (<TaskList content={props.content} />);
            case '_cTask': return (<Task content={props.content} />);
            case '_cText': return (<Text content={props.content} updateItem={props.updateItem} />);
            case '_cMarkdownText': return (<MarkdownText content={props.content} />);
            case '_cImage': return (<Image content={props.content} />);
            default: return undefined;
        }
    };


    return (
        <div>
            {renderEl()}
        </div>
    );
};

export { ContentElement, TaskList, Task, Text, MarkdownText, Image };