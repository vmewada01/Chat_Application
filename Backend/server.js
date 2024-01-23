const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dbConnection = require("./backend/config/db");
const userRoute = require("./backend/routes/userRoutes");
const chatRoute = require("./backend/routes/chatRoute");
const messageRoute = require("./backend/routes/messageRoute");
const {
  notFound,
  errorHandler,
} = require("./backend/middleware/errorMiddleware");
const axios = require("axios");

dbConnection();
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.get("/", (req, res) => {
  res.send("API IS RUNNING SUCESSFULLY");
});

app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/messages", messageRoute);

app.use(errorHandler);
app.use(notFound);

function MakeRenderServerActiveFunction() {
  const apiUrl = "https://jsonplaceholder.typicode.com/todos/1";

  axios
    .get(apiUrl)
    .then((response) => {
      console.log("API Response:", response.data);
    })
    .catch((error) => {
      console.error("Error hitting API:", error.message);
    });
}

const apiCallInterval = 10000;
setInterval(MakeRenderServerActiveFunction, apiCallInterval);

MakeRenderServerActiveFunction();

const PORT = process.env.PORT || "5000";

const server = app.listen(PORT, console.log(`server started at port  ${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 600000,
  cors: {
    origin: "*",
  },
});

https: io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData.userId);
    socket.emit("connected");
  });

  socket.on("join chat", (chatEnvironment) => {
    socket.join(chatEnvironment);
    console.log("chat joined");
  });

  socket.on("typing", (chatEnvironment) =>
    socket.in(chatEnvironment).emit("typing")
  );
  socket.on("stop typing", (chatEnvironment) =>
    socket.in(chatEnvironment).emit("stop typing")
  );

  socket.on("new message", (newMessageRecived) => {
    var chat = newMessageRecived.chat;
    if (!chat.users) return;

    chat.users.forEach((user) => {
      if (user._id == newMessageRecived.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecived);
      console.log("chat joing with user id", user._id);
    });
  });

  socket.off("setup", (userData) => {
    console.log("user disconnected");
    socket.leave(userData.userId);
  });
});
