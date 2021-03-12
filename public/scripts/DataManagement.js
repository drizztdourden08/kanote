const { existsSync, mkdir, writeFile } = require('fs');

const { v4: uuidv4 } = require('uuid');

const electron = require('electron');
const app = electron.app;

const documentFolder = app.getPath('documents');
const appName = app.getName();
const mainPath = documentFolder + '\\' + appName;

const CreateDataDirectory = () => {
    if (!existsSync(mainPath)) {
        mkdir(mainPath, { recursive: true }, (err) => {
            if (err) throw err;
        });
    }
};

const LoadCurrentUserBoard = (boardName = '') => {
    if (boardName === '') { }

    const itemsFromBackend = [
        { id: uuidv4(), content: '', priority: 'High', title: 'Correct Err:35', tags: ['Code', 'Table'] },
        { id: uuidv4(), content: '', priority: 'Medium', title: 'Test', tags: ['Plan', 'Testing'] },
        { id: uuidv4(), content: '', priority: 'Low', title: 'Add items', tags: ['Content', 'Team 3'] },
        { id: uuidv4(), content: '', priority: 'High', title: 'fix Drag Bug', tags: ['UI'] },
        { id: uuidv4(), content: '', priority: 'High', title: 'Improve performance', tags: ['Code', 'Performance'] }
    ];

    const columnsFromBackend = {
        [uuidv4()]: {
            title: 'To do',
            items: itemsFromBackend
        },
        [uuidv4()]: {
            title: 'In Progress',
            items: []
        },
        [uuidv4()]: {
            title: 'Done',
            items: []
        }
    };

    CreateDataDirectory();

    jsonData = JSON.stringify(columnsFromBackend);
    writeFile(mainPath + '\\TestFile.ks', jsonData, (err) => {
        if (err) throw err;
    });
};



module.exports = { CreateDataDirectory, LoadCurrentUserBoard };