const app = require("express")();
const http = require("http").Server(app);
const cors = require("cors");
app.use(cors({}));
require("dotenv").config();

const io = require("socket.io")(http, {
  cors: {
    origin: process.env.ORIGIN,
    // origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
  },
});

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

let allUsers = 0;
let usersList = [];
io.on("connection", (socket) => {
  // console.log(socket.id);
  socket.on("connected", (data) => {
    allUsers++;
    console.log(data);
    socket.broadcast.emit("updatePublicPlayers", allUsers);
  });
  socket.on("disconnected", (data) => {
    allUsers--;
    console.log(data);
    socket.broadcast.emit("updatePublicPlayers", allUsers);
  });
});

http.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});
