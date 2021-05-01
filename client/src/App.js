import React, { useRef, useEffect, useState, useMemo, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect,
} from "react-router-dom";
import WelcomePage from "./component/WelcomePage";
import Game from "./component/Game";
import TableScore from "./component/TableScore";
import WelcomeWithAuth from "./component/WelcomeWithAuth";
import Login from "./component/Login"
import SingUp from "./component/SingUp"
function App() {
  const [playerName, setPlayerName] = useState();
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route
            exact
            path="/Game"
            render={(props) => <Game {...props} playerName={playerName} />}
          />
          <Route
            path="/WelcomePage"
            exact
            render={(props) => (
              <WelcomePage {...props} setPlayerName={setPlayerName} />
            )}
          />
          <Route
            path="/"
            exact
            render={(props) => (
              <WelcomeWithAuth {...props} setPlayerName={setPlayerName} />
            )}
          />
          <Route
            path="/login"
            exact
            render={(props) => (
              <Login {...props} setPlayerName={setPlayerName} />
            )}
          />
          <Route
            path="/singup"
            exact
            render={(props) => (
              <SingUp {...props} setPlayerName={setPlayerName} />
            )}
          />
          <Route
            path="/TableScore"
            exact
            render={(props) => (
              <TableScore {...props} playerName={playerName} />
            )}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;

// <Route
//                   path='/game'
//                   render={(props) => (
//                     <Game {...props} playerName={playerName} />
//                   )}
//                 />
