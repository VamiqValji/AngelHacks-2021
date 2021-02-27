const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());

app.use(cors({}));

// const createRoute = require("./routes/createRoute");
// const joinRoute = require("./routes/joinRoute");

// app.use("/create", createRoute);
// app.use("/join", joinRoute);

//socketio
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.ORIGIN, // origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
  },
});

let allUsers = 0;
let usersList = [];
const publicRoom = "PublicRoom";
io.on("connection", (socket) => {
  if (socket.handshake.headers.referer.includes(`${process.env.ORIGIN}/room`)) {
    // private room
    socket.on("connected", (data) => {
      socket.join("priv");
      allUsers++;
      console.log(data);
      socket.broadcast.emit("updatePublicPlayers", allUsers);
    });
    socket.on("disconnected", (data) => {
      allUsers--;
      console.log(data);
      socket.broadcast.emit("updatePublicPlayers", allUsers);
    });
  }
  // if (socket.handshake.headers.referer.includes(`${process.env.ORIGIN}`))
  else {
    // public
    socket.on("connected", (data) => {
      socket.join(publicRoom);
      allUsers++;
      console.log(data);
      socket.broadcast.emit("updatePublicPlayers", allUsers);
    });
    socket.on("disconnected", (data) => {
      allUsers--;
      console.log(data);
      socket.broadcast.emit("updatePublicPlayers", allUsers);
    });
    socket.on("t", (data) => {
      allUsers--;
      console.log("dd");
      socket.broadcast.emit("updatePublicPlayers", allUsers);
    });
  }
});

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.get("/create", (req, res) => {
  res.send("<h1>Create</h1>");
});

app.get("/join", (req, res) => {
  res.send("<h1>Join</h1>");
});

server.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});
