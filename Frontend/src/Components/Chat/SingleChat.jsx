import {
  ArrowLeftOutlined,
  ArrowUpOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Empty, Input, Spin, Tag, Tooltip, message } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import Lottie from "react-lottie";
import io from "socket.io-client";
import ChattingAnimationData from "../../Animation/ChattingAnimation.json";
import { ChatContext } from "../../Providers/ChatProvider";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import axios from "../Common/axios";
import UpdateGroupChatModal from "../GroupChat/UpdateGroupChatModal";
import ProfileModal from "../Profile/ProfileModal";
import ScrollableChat from "./ScrollableChat";

const ENDPOINT = "v-chat-app-kpbs.onrender.com/";

var socket;
var selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const inputRef = useRef(null);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: ChattingAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    useContext(ChatContext);

  const sendMessageFunction = async (e) => {
    if (e.key === "Enter" && newMessage) {
      const trimmedMessage = newMessage.trim();
      if (!trimmedMessage) return message.info("please enter a valid message");
      socket.emit("stop typing", selectedChat._id);
      try {
        setIsSendingMessage(true);
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
          "https://v-chat-app-kpbs.onrender.com/api/messages",
          payload,
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
        setIsSendingMessage(false);
      } catch (error) {
        message.error("Error in sendeing message ");
        setIsSendingMessage(false);
      }
    }
  };

  const sendMessageByButton = async () => {
    if (newMessage) {
      const trimmedMessage = newMessage.trim();
      if (!trimmedMessage) return message.info("please enter a valid message");

      socket.emit("stop typing", selectedChat._id);
      try {
        setIsSendingMessage(true);
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
          "https://v-chat-app-kpbs.onrender.com/api/messages",
          payload,
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
        setIsSendingMessage(false);
      } catch (error) {
        message.error("Error in sendeing message ");
        setIsSendingMessage(false);
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
        `https://v-chat-app-kpbs.onrender.com/api/messages/${selectedChat._id}`,

        config
      );

      setMessages(data);
      setIsLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      message.error("Error in fetching messages");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setIsSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecived.chat._id
      ) {
        if (!notification.includes(newMessageRecived)) {
          setNotification([newMessageRecived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecived]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
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
    <div className="w-full h-full flex flex-col  mt-3">
      {selectedChat ? (
        <>
          <div
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hhdCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D")`,
            }}
            className="flex flex-col items-center content-center w-full h-full"
          >
            {!selectedChat?.isGroupChat ? (
              <>
                <div
                  style={{
                    backgroundColor: "#B4D4FF",
                  }}
                  className="flex justify-between w-full p-2 rounded-md "
                >
                  <div className="font-semibold text-lg flex gap-1">
                    <Button
                      className="border-black"
                      icon={<ArrowLeftOutlined />}
                      onClick={() => setSelectedChat("")}
                    ></Button>
                    <Tag
                      style={{ backgroundColor: "#F8F8F8" }}
                      className="flex justify-center items-center"
                    >
                      {getSender(user, selectedChat?.users)}
                    </Tag>
                  </div>
                  <Tooltip placement="bottom" title="Profile">
                    <Button
                      className="border-black"
                      icon={<EyeOutlined />}
                      onClick={() => setIsModalOpen(true)}
                    ></Button>
                  </Tooltip>
                </div>

                <ProfileModal
                  isModalOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  handleOk={() => setIsModalOpen(false)}
                  user={getSenderFull(user, selectedChat?.users)}
                />
                <div className="flex flex-col justify-end p-3  rounded-lg overflow-hidden w-full h-full">
                  {isLoading ? (
                    <Spin className="flex justify-center items-center m-auto" />
                  ) : (
                    <div className="flex flex-col w-full h-full justify-between">
                      <div className="h-[90%] pb-2 flex flex-col">
                        <ScrollableChat
                          isSendingMessage={isSendingMessage}
                          messages={messages}
                        />
                      </div>

                      {isTyping ? (
                        <div className="flex justify-start">
                          <Lottie
                            options={defaultOptions}
                            width={70}
                            style={{ marginLeft: 0 }}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                      <div className="flex h-fit gap-1">
                        <Input
                          ref={inputRef}
                          autoFocus={true}
                          className="p-2 h-fit text-bold"
                          placeholder="Enter a message..."
                          required={true}
                          onKeyDown={sendMessageFunction}
                          onChange={typingHandler}
                          value={newMessage}
                        />
                        <Button
                          onClick={sendMessageByButton}
                          className="border-black"
                          icon={<ArrowUpOutlined />}
                        ></Button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div
                  style={{ backgroundColor: "#B4D4FF" }}
                  className="flex justify-between w-full p-2 rounded-md"
                >
                  <div className="font-semibold text-lg flex gap-1">
                    <Button
                      className="border-black"
                      icon={<ArrowLeftOutlined />}
                      onClick={() => setSelectedChat("")}
                    ></Button>
                    <Tag
                      style={{ backgroundColor: "#F8F8F8" }}
                      className="flex justify-center items-center"
                    >
                      {selectedChat?.chatName?.toUpperCase()}
                    </Tag>
                  </div>

                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                </div>

                <div className="flex flex-col justify-end p-3  rounded-lg overflow-hidden w-full h-full">
                  {isLoading ? (
                    <Spin className="flex justify-center items-center m-auto" />
                  ) : (
                    <div className="flex flex-col w-full h-full justify-between">
                      <div className="h-[90%] pb-2 flex flex-col">
                        <ScrollableChat messages={messages} />
                      </div>

                      {isTyping ? (
                        <div className="flex justify-start">
                          <Lottie
                            options={defaultOptions}
                            width={70}
                            style={{ marginLeft: 0 }}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                      <div className="flex h-fit gap-1">
                        <Input
                          autoFocus={true}
                          className="p-2 h-fit text-bold"
                          placeholder="Enter a message..."
                          required={true}
                          onKeyDown={sendMessageFunction}
                          onChange={typingHandler}
                          value={newMessage}
                        />
                        <Button
                          onClick={sendMessageByButton}
                          className="border-black"
                          icon={<ArrowUpOutlined />}
                        ></Button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center items-center content-center h-full">
            <Empty
              description={
                <p className="font-bold italic text-lg">
                  Click on a user to start chatting
                </p>
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SingleChat;
