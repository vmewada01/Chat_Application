import { InfoOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../Providers/ChatProvider";
import { getSender } from "../../config/ChatLogics";
import GroupChatModal from "../GroupChat/GroupChatModal";

const SiderComponent = ({ fetchAgain }) => {
  const [isGroupChatModal, setIsGroupChatModal] = useState(false);
  const [loggedUser, setLoggedUser] = useState([]);
  const { user, setSelectedChat, chats, setChats, selectedChat } =
    useContext(ChatContext);
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5134/api/chat`,
        config
      );

      setChats(data);
    } catch (error) {
      message.error("Failed to retrieve search results", error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <div
      style={{ backgroundColor: "#EEF5FF" }}
      className="w-1/3  rounded-lg p-2"
    >
      <div className="pb-3 px-3 text-lg flex justify-between items-center mt-2">
        <span className="font-bold text-lg italic">My Chats</span>
        <Button
          icon={<InfoOutlined />}
          onClick={() => setIsGroupChatModal(true)}
          className="border-black "
        >
          New Group Chat
        </Button>
      </div>

      <div className="flex flex-col overflow-hidden rounded-lg">
        {chats && (
          <>
            {chats.map((chat, index) => {
              return (
                <div
                  style={{
                    backgroundColor:
                      selectedChat === chat ? "#176B87" : "#B4D4FF",
                    color: selectedChat === chat ? "white" : "black",
                  }}
                  onClick={() => setSelectedChat(chat)}
                  className="cursor-pointer rounded-lg mt-1 mb-1"
                  key={index}
                >
                  <p className="p-3">
                    {!chat?.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </p>
                </div>
              );
            })}
          </>
        )}
      </div>
      <GroupChatModal
        isModalOpen={isGroupChatModal}
        onClose={() => setIsGroupChatModal(false)}
        handleOk={() => setIsGroupChatModal(false)}
      />
    </div>
  );
};

export default SiderComponent;
