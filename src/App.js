import React from 'react';

import Main from './main/Main';
import Handle from './handle/Handle';

import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/handle">
                    <Handle />
                </Route>
                <Route path="/">
                    <Main />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;



