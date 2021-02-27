const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const dotenv = require("dotenv").config();

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

io.on("connection", (socket) => {
  console.log(socket.id);
});

http.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});
