const express = require("express");
const chats = require("./data/data");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.get("/", (req, res) => {
  res.send("API IS RUNNING SUCESSFULLY");
});

app.get("/api/chat", (req, res) => {
  res.send(chats);
});

app.get("api/chat/:id", (req, res) => {
  const singleRequest = chats.find((chat) => chat._id === req.params.id);
  console.log(singleRequest, "singleRequest");
  res.send(singleRequest);
});

const PORT = process.env.PORT || "5000";

app.listen(PORT, console.log(`server started at port  ${PORT}`));
