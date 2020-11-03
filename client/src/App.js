import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import KGe from './pages/KGe';
import Volume from './pages/Volume';
import PlayerRecorder from './pages/PlayerRecorder';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Volume />
        </Route>
        <Route path="/kge">
          <KGe />
        </Route>
        <Route path="/volume">
          <Volume />
        </Route>
        <Route path="/player">
          <PlayerRecorder />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
