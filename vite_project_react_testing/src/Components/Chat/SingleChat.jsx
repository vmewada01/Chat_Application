import { Input, message, Spin } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Lottie from "react-lottie";
import io from "socket.io-client";
import ChattingAnimationData from "../../Animation/ChattingAnimation.json";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import { ChatContext } from "../../Providers/ChatProvider";
import UpdateGroupChatModal from "../GroupChat/UpdateGroupChatModal";
import ProfileModal from "../Profile/ProfileModal";
import ScrollableChat from "./ScrollableChat";

const ENDPOINT = "http://localhost:5134";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = useContext(ChatContext);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [newMessage, setNewMessage] = useState();
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: ChattingAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => setIsSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const sendMessageFunction = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        setIsLoading(true);
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const payload = {
          chatId: selectedChat?._id,
          content: newMessage,
        };
        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:5134/api/messages",
          payload,
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        message.error("Error in sendeing message ");
        setNewMessage("");
        setIsLoading(false);
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setIsLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5134/api/messages/${selectedChat._id}`,

        config
      );
      setMessages(data);
      setIsLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
      message.error("Error in fetching messages");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecived.chat._id
      ) {
        /// give notifiication
      } else {
        console.log(1);
        setMessages([...messages, newMessageRecived]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    //////Typing indicator logic

    if (!isSocketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDifference = timeNow - lastTypingTime;

      if (timeDifference >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <div className="w-full h-full">
      {selectedChat ? (
        <>
          <div className="flex flex-col items-center content-center w-full h-full">
            {!selectedChat?.isGroupChat ? (
              <>
                {getSender(user, selectedChat?.users)}
                <ProfileModal user={getSenderFull(user, selectedChat?.users)} />
                <div className="flex flex-col justify-end p-3 bg-slate-400 rounded-lg overflow-hidden w-full h-full">
                  {isLoading ? (
                    <Spin />
                  ) : (
                    <div className="flex flex-col w-full h-full justify-between">
                      <div className="bg-yellow-200 h-full flex flex-col overflow-y-scroll">
                        <ScrollableChat messages={messages} />
                      </div>

                      {isTyping ? (
                        <div>
                          <Lottie
                            options={defaultOptions}
                            width={70}
                            style={{ marginBottom: 15, marginLeft: 0 }}
                          />
                        </div>
                      ) : (
                        <></>
                      )}

                      <Input
                        placeholder="Enter a message..."
                        required={true}
                        onKeyDown={sendMessageFunction}
                        onChange={typingHandler}
                        value={newMessage}
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex justify-between w-full">
                {selectedChat?.chatName?.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center items-center content-center h-full">
            <p className="text-2xl italic">Click on a user to start chatting</p>
          </div>
        </>
      )}
    </div>
  );
};

export default SingleChat;
