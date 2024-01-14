const asyncHandler = require("express-async-handler");
const Chats = require("../Models/ChatModel");
const User = require("../Models/UserModel");
const accessChat = asyncHandler(async (req, res) => {
  console.log(req.body, "req body");
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }
  console.log("-1");
  var isChat = await Chats.find({
    isGroupChat: false,
    $and: [
      {
        users: { $elemMatch: { $eq: req.user._id } },
      },
      {
        users: { $elemMatch: { $eq: userId } },
      },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  console.log("-2");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name picture email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      console.log("1");
      const createdChat = await Chats.create(chatData);
      console.log("2");
      const fullChat = await Chats.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      console.log("3");
      res.status(200).send(fullChat);
    } catch (err) {
      res.status(400).send("Something went wrong");
    }
  }
});

module.exports = { accessChat };
