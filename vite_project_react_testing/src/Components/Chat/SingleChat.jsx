import { Input, message, Spin } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import { ChatContext } from "../../Providers/ChatProvider";
import UpdateGroupChatModal from "../GroupChat/UpdateGroupChatModal";
import ProfileModal from "../Profile/ProfileModal";
import ScrollableChat from "./ScrollableChat";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = useContext(ChatContext);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [newMessage, setNewMessage] = useState();

  const sendMessageFunction = async (e) => {
    if (e.key === "Enter" && newMessage) {
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
      console.log("messages", data);
      setMessages(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      message.error("Error in fetching messages");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    //////Typing indicator logic
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
                  {/* Message will be displayed here */}
                  {isLoading ? (
                    <Spin />
                  ) : (
                    <div className="flex flex-col w-full h-full justify-between">
                      <div className="bg-yellow-200 h-full flex flex-col overflow-y-scroll">
                        {/* ///messages will be displayed here */}
                        <ScrollableChat messages={messages} />
                      </div>

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
