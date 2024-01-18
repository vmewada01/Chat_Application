const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dbConnection = require("./config/db");
const userRoute = require("./routes/userRoutes");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

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

const PORT = process.env.PORT || "5000";

const server = app.listen(PORT, console.log(`server started at port  ${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 600000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData.userId);
    socket.emit("connection");
  });

  socket.on("join chat", (chatEnvironment) => {
    socket.join(chatEnvironment);
    console.log("user joined chat", chatEnvironment);
  });

  socket.on("typing", (chatEnvironment) =>
    socket.in(chatEnvironment).emit("typing")
  );
  socket.on("stop typing", (chatEnvironment) =>
    socket.in(chatEnvironment).emit("stop typing")
  );

  socket.on("new message", (newMessageRecived) => {
    var chat = newMessageRecived.chat;
    if (!chat.users) return console.log("Chat user is not defined ");
    console.log(newMessageRecived, "chat", chat);
    chat.users.forEach((user) => {
      if (user._id === newMessageRecived.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecived);
    });
  });

  socket.off("setup", () => {
    console.log("user disconnected");
    socket.leave(userData._id);
  });
});
