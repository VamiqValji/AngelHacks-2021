const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const router = require("express").Router();

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

// let dataListExample = {
//   roomName: "test1",
//   roomID: "test2",
//   users: [],
// }

let dataList = []; // users and rooms

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

app.post("/create", (req, res) => {
  console.log("create");
  // res.send("<h1>Create</h1>");
  let random = Math.random().toString(36).substring(7);

  for (let i = 0; i < dataList.length; i++) {
    if (
      dataList[i].roomID === random ||
      dataList[i].roomName === req.body.roomName
    ) {
      return res.status(400).json({ message: "Duplicate", redirect: false });
    }
  }

  dataList.push({
    roomName: req.body.roomName,
    roomID: random,
    users: [req.body.name],
  });

  return res
    .status(201)
    .json({ message: "Created Room.", roomID: random, redirect: true });
});

app.post("/join", (req, res) => {
  // res.send("<h1>Join</h1>");
  for (let i = 0; i < dataList.length; i++) {
    if (dataList[i].roomName === req.body.roomName) {
      return res
        .status(400)
        .json({ message: "Success ", /*roomID: random,*/ redirect: true });
    }
  }
  return res
    .status(404)
    .json({ message: "Room not found." /*, roomID: random, redirect: true*/ });
});

server.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});
