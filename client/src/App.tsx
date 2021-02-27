import React, { useEffect, useState } from 'react';
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

import io from "socket.io-client";

let socket;

function App() {

  const [allUsersNumber, setAllUsersNumber] = useState(0);

  const ENDPOINT = "http://localhost:3001";

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("connected", "connect");
    // effect

    socket.on("updatePublicPlayers", (allUsers) => {
      console.log(allUsers);
      setAllUsersNumber(allUsers);
    })

    return () => {
      socket.emit("disconnected", "disconnected");
      socket.disconnect();
      socket.off();
    }
  }, [ENDPOINT])

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
            {allUsersNumber ? <div className="usersOnline">People Online: {allUsersNumber}</div> : ""}
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