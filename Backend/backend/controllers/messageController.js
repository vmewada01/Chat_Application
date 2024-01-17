const asyncHandler = require("express-async-handler");
const Message = require("../Models/MessageModel");
const User = require("../Models/UserModel");
const Chats = require("../Models/ChatModel");

const sendMessage = asyncHandler(async (req, res) => {
  console.log(req.body, "req body");
  const { chatId, content } = req.body;
  if (!chatId || !content) {
    console.log("ChatId param not sent with request");
    return res.sendStatus(400);
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  console.log(newMessage, "new user message");
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name picture");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name picture email",
    });
    await Chats.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    console.log(error, "error");
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name picture email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    console.log(error, "error");
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
