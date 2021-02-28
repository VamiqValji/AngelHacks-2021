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

let dataList = []; // users and rooms

dataList.push(
  {
    roomName: "test",
    roomID: "test",
    users: [],
    queue: [],
    duration: "",
  },
  {
    roomName: "test2",
    roomID: "test2",
    users: [],
    queue: [],
    duration: "",
  }
);

const joinRoom = (roomName = String, socket) => {
  console.log(roomName);
  socket.join(roomName);
};
const publicRoom = "PublicRoom";
io.on("connection", (socket) => {
  //if (socket.handshake.headers.referer.includes(`${process.env.ORIGIN}/room`)) {
  // private room
  let inPrivRoom = false;
  let roomID;
  socket.on("connected", (data) => {
    console.log("priv");
    // socket.join("priv");
    roomID = data;

    console.log("roomIDBEFORE", data);
    console.log("roomID", roomID);

    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i].roomID === roomID) {
        // if room id is correct
        socket.join(roomID);
        console.log("correct id");
        // dataList[i].queue = data.queue;
        socket.emit("connectedResponse", {
          success: true,
          roomID: roomID,
          roomName: dataList[i].roomName,
          dataList: dataList[i],
        });

        dataList[i].users.push({
          userID: socket.id,
          username: "test",
        });
        inPrivRoom = true;
      } else {
        if (!inPrivRoom) {
          socket.emit("connectedResponse", {
            success: false,
          });
          inPrivRoom = false;
        }
      }
    }
  });

  console.log(dataList);

  socket.on("play", (data) => {
    console.log("play");
    socket.to(roomID).broadcast.emit("playClient", data);
  });
  socket.on("pause", (data) => {
    console.log("pause");
    socket.to(roomID).broadcast.emit("pauseClient", data);
  });
  socket.on("time", (data =>{
    console.log("changing time");
    socket.to(roomID).broadcast.emit("changeTime", data)
  }))
  socket.on("updateQueue", (data) => {
    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i].roomID === roomID) {
        dataList[i].queue = data.queue;
        console.log("updateQueue", "CURRENT QUEUE:", dataList[i].queue);
      }
    }
    console.log("updateQueue", data);
    socket.to(roomID).broadcast.emit("updateQueueClient", data);
  });
  socket.on("nextVideo", (data) => {
    console.log("nextVideo");

    let temps = data.queue;

    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i].roomID === roomID) {
        // console.log("BEFORE", dataList[i].queue, "AFTER", temps);
        dataList[i].queue = temps;
        // socket.to(roomID).broadcast.emit("nextVideoClient", {
        //   username: data.username,
        //   queue: temps,
        // });
        io.in(roomID).emit("nextVideoClient", {
          username: data.username,
          queue: temps,
        });
      }
    }
  });

  allUsers++;
  // console.log(data);
  // socket.broadcast.emit("updatePublicPlayers", allUsers);
  socket.on("disconnected", (data) => {
    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i].roomID === roomID) {
        // if room id is correct
        const index = dataList[i].users.indexOf(socket.id);
        if (index > -1) {
          dataList[i].users.splice(index, 1);
        }
      }
    }
    allUsers--;
    console.log(data);
    // socket.broadcast.emit("updatePublicPlayers", allUsers);
  });
  //}
  // if (socket.handshake.headers.referer.includes(`${process.env.ORIGIN}`))
  /*
  else {
    // public
    console.log("pub");
    socket.on("connected", (data) => {
      socket.join(publicRoom);
      allUsers++;
      console.log(data);
      // socket.broadcast.emit("updatePublicPlayers", allUsers);
    });
    socket.on("disconnected", (data) => {
      allUsers--;
      console.log(data);
      // socket.broadcast.emit("updatePublicPlayers", allUsers);
    });
    socket.on("t", (data) => {
      allUsers--;
      console.log("dd");
      // socket.broadcast.emit("updatePublicPlayers", allUsers);
    });
  } */
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
    queue: [],
    duration: "",
  });

  return res
    .status(201)
    .json({ message: "Created Room.", roomID: random, redirect: true });
});

app.post("/join", (req, res) => {
  // res.send("<h1>Join</h1>");
  console.log("joining");
  for (let i = 0; i < dataList.length; i++) {
    // if room name is correct
    if (dataList[i].roomName === req.body.roomName) {
      console.log("correct body name");
      return res
        .status(200)
        .json({ message: "Success", /*roomID: random,*/ redirect: true });
    } else if (dataList[i].roomID === req.body.roomID) {
      // if room id is correct
      console.log("correct id");
      return res
        .status(200)
        .json({ message: "Success", /*roomID: random,*/ redirect: true });
    }
  }
  return res
    .status(404)
    .json({ message: "Room not found." /*, roomID: random, redirect: true*/ });
});

server.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});
