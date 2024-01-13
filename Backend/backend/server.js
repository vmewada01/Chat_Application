const express = require("express");
const chats = require("./data/data");
const dotenv = require("dotenv");
const cors = require("cors");
const dbConnection = require("./config/db");
const userRoute = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dbConnection();
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.get("/", (req, res) => {
  res.send("API IS RUNNING SUCESSFULLY");
});

app.get("/api/chat", (req, res) => {
  res.send(chats);
});

app.get("/api/chat/:id", (req, res) => {
  const singleRequest = chats.find((chat) => chat._id === req.params.id);
  console.log(singleRequest, "singleRequest");
  res.send(singleRequest);
});

app.use("/api/user", userRoute);
app.use(errorHandler);
app.use(notFound);

const PORT = process.env.PORT || "5000";

app.listen(PORT, console.log(`server started at port  ${PORT}`));
