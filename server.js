const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const router = require("express").Router();
const path = require("path");

app.use(express.json());

app.use(cors({}));

// const createRoute = require("./routes/createRoute");
// const joinRoute = require("./routes/joinRoute");

// app.use("/create", createRoute);
// app.use("/join", joinRoute);

// server static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//socketio
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.ORIGIN,
    // origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
  },
});

let allUsers = 0;

let dataList = []; // users and rooms
let currentUsers = [];

// dataList.push(
//   {
//     roomName: "test",
//     roomID: "test",
//     users: [],
//     queue: [],
//     duration: "",
//   },
//   {
//     roomName: "test2",
//     roomID: "test2",
//     users: [],
//     queue: [],
//     duration: "",
//   }
// );

// const joinRoom = (roomName = String, socket) => {
//   console.log(roomName);
//   socket.join(roomName);
// };

// const publicRoom = "PublicRoom";

io.on("connection", (socket) => {
  //if (socket.handshake.headers.referer.includes(`${process.env.ORIGIN}/room`)) {
  // private room
  let inPrivRoom = false;
  let roomID;
  socket.on("connected", (data) => {
    console.log("priv");
    // socket.join("priv");
    roomID = data.roomID;
    console.log(`${data.username} joined.`);

    // console.log("roomIDBEFORE", data);
    // console.log("roomID", roomID);

    for (let i = 0; i < dataList.length; i++) {
      // console.log(`COMPARE: (${dataList[i].roomID})(${roomID})`);
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
          duration: dataList[i].duration,
        });
        try {
          if (data.username.length > 0) {
            socket.to(roomID).broadcast.emit("userJoined", {
              username: data.username,
            });
          }
        } catch (err) {
          console.log(err);
        }

        dataList[i].users.push({
          userID: socket.id,
          username: data.username,
        });

        inPrivRoom = true;
      }
      // else {
      //   if (!inPrivRoom) {
      //     socket.emit("connectedResponse", {
      //       success: false,
      //     });
      //     inPrivRoom = false;
      //   }
      // }
    }

    currentUsers.push({
      userID: socket.id,
      username: data.username,
    });
  });

  // console.log(dataList);

  socket.on("canvas", (data) => {
    io.in(roomID).emit("changeCanvas", data);
  });
  socket.on("play", (data) => {
    console.log("play");
    socket.to(roomID).broadcast.emit("playClient", data);
  });
  socket.on("pause", (data) => {
    console.log("pause");
    socket.to(roomID).broadcast.emit("pauseClient", data);
  });
  socket.on("time", (data) => {
    console.log("changing time");

    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i].roomID === roomID) {
        dataList[i].duration = data.currentTime;
      }
    }

    // socket.to(roomID).broadcast.emit("changeTime", data);
    io.in(roomID).emit("changeTime", data);
  });
  socket.on("updateQueue", (data) => {
    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i].roomID === roomID) {
        dataList[i].queue = data.queue;
        // console.log("updateQueue", "CURRENT QUEUE:", dataList[i].queue);
      }
    }
    // console.log("updateQueue", data);
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
  socket.on("sendMessage", (data) => {
    console.log("sendMessage");
    socket.to(roomID).broadcast.emit("receiveMessage", data);
  });
  socket.on("sendEvent", (data) => {
    console.log(`sendEvent: ${data.event} from ${data.username}`);
    io.in(roomID).emit("receiveEvent", data);
  });

  allUsers++;
  // console.log(data);
  // socket.broadcast.emit("updatePublicPlayers", allUsers);

  const emitUserDisconnected = (name = String) => {
    if (name.length > 0) {
      socket.to(roomID).broadcast.emit("userDisconnected", {
        username: name,
        usersList: dataList.users,
      });
    }
  };

  socket.on("disconnect", (data) => {
    // for (let i = 0; i < dataList.length; i++) {
    //   try {
    //     if (dataList[i].roomID === roomID) {
    //       // if room id is correct
    //       for (let i = 0; d < dataList[i].users.length; d++) {
    //         if (dataList[i].users[d].userID === socketID) {
    //           // if correct player
    //           const index = dataList[i].users.indexOf(dataList[i].users[d]);
    //           if (index > -1) {
    //             dataList[i].users.splice(index, 1);
    //           }
    //         }
    //       }
    //     }
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }

    let name = "";
    for (let i = 0; i < currentUsers.length; i++) {
      if (currentUsers[i].userID === socket.id) {
        name = currentUsers[i].username;
      }
      // if (name.length > 0) {
      //   socket.emit("receiveEvent", {
      //     username: name,
      //     event: "disconnected",
      //   });
      // }
    }

    // let users = [];
    // for (let i = 0; i < dataList.users.length; i++) {
    //   users = dataList[i].users;
    //   if (user.usersID === socket.id) {
    //     const index = dataList.users.indexOf(user);
    //     if (index > -1) {
    //       dataList.users.splice(index, 1);
    //     }
    //   }
    // }

    allUsers--;
    console.log("disconnect", socket.id, name);
    emitUserDisconnected(name);

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

// app.get("/s/", (req, res) => {
//   res.send("<h1>Hello World</h1>");
// });

// app.get("/testing", (req, res) => {
//   res.send("<h1>test</h1>");
// });

app.post("/s/create", (req, res) => {
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

app.post("/s/join", (req, res) => {
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

server.listen(process.env.PORT || 3001, () => {
  console.log("listening on port " + process.env.PORT || 3001);
});
