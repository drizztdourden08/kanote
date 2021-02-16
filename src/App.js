import React, { useEffect } from 'react'
import Main from './Main/Main'
import Handle from './Handle/Handle'

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



