import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Join from "./pages/Join";
import Room from "./pages/Room";
import CreateRoom from "./pages/CreateRoom";

function App() {
  return (
    <Router>
      <div>
        <div className="nav">
        <nav>
          <ul>
            <li>
              <Link to="/">Join</Link>
            </li>
            <li>
              <Link to="/create">Create</Link>
            </li>
             <li>
              <Link to="/room">Room</Link>
            </li> 
          </ul>
        </nav>
        </div>
        <Switch>
          <Route exact path="/">
            <Join />
          </Route>
          <Route exact path="/create">
            <CreateRoom />
          </Route>
          <Route exact path="/room">
            <Room />
          </Route>
        </Switch>
      </div>
    </Router>
  );
          }

export default App;