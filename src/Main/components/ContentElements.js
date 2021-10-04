import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import ExpandingButtons from './ExpandingButtons';

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
    let editable = false;

    const ToggleEditing = () => {
        editable = !editable;
    };

    return (
        <div contentEditable={editable} onDoubleClick={ToggleEditing} onfocusout={ToggleEditing} className="content-text">{content.text}</div>
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
            case '_cText': return (<Text content={props.content} />);
            case '_cMarkdownText': return (<MarkdownText content={props.content} />);
            case '_cImage': return (<Image content={props.content} />);
            default: return undefined;
        }
    };


    return (
        <div>
            <div className="content-options">
                <ExpandingButtons type="CardContent" vertical={false} alwaysOn={true} buttons={['move', 'Edit']} cardId={props.cardId} />
            </div>
            {renderEl()}
        </div>
    );
};

export { ContentElement, TaskList, Task, Text, MarkdownText, Image };