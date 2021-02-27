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

io.on("connection", (socket) => {
  console.log(socket.id);
});

http.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});
