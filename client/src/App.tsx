import React, { useEffect, useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from "./pages/Home";
import Join from "./pages/Join";
import Room from "./pages/Room";
import CreateRoom from "./pages/CreateRoom";

import io from "socket.io-client";

// let socket;

function App() {

  const [allUsersNumber, setAllUsersNumber] = useState(0);

  // const ENDPOINT = "http://localhost:3001";

  // useEffect(() => {
  //   socket = io(ENDPOINT);
  //   socket.emit("connected", "connect");
  //   // effect

  //   socket.on("updatePublicPlayers", (allUsers) => {
  //     console.log(allUsers);
  //     setAllUsersNumber(allUsers);
  //   })

  //   return () => {
  //     socket.emit("disconnected", "disconnected");
  //     socket.disconnect();
  //     socket.off();
  //   }
  // }, [ENDPOINT])

  return (
    <Router>
      <div>
        <div className="nav">
        <nav>
          <ul>
          <li>
              <Link to="/">Home</Link>
            </li>
            {/* <li>
              <Link to="/join/:roomID">Join</Link>
            </li> */}
            <li>
              <Link to="/create">Create</Link>
            </li>
             <li>
              <Link to="/room/">Room</Link>
            </li>
            {allUsersNumber ? <div className="usersOnline">People Online: {allUsersNumber}</div> : ""}
          </ul>
        </nav>
        </div>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/create">
            <CreateRoom /* socket={socket} */ /> 
          </Route>
          <Route path="/room/:roomID">
            <Room />
          </Route>
          {/* <Route path="/join/:roomID">
            <Join />
          </Route> */}
        </Switch>
      </div>
    </Router>
  );
          }

export default App;