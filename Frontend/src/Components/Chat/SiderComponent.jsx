import { InfoOutlined } from "@ant-design/icons";
import { Button, Image, Spin, message } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../Providers/ChatProvider";
import { getSender, getSenderImage } from "../../config/ChatLogics";
import axios from "../Common/axios";
import GroupChatModal from "../GroupChat/GroupChatModal";

const SiderComponent = ({ fetchAgain }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGroupChatModal, setIsGroupChatModal] = useState(false);
  const [loggedUser, setLoggedUser] = useState([]);
  const { user, setSelectedChat, chats, setChats, selectedChat } =
    useContext(ChatContext);
  const fetchChats = async () => {
    setIsLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `https://v-chat-app-kpbs.onrender.com/api/chat`,
        config
      );

      setChats(data);
      setIsLoading(false);
    } catch (error) {
      message.error("Failed to retrieve search results", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <div
      className={`min-h-full h-full bg-[#EEF5FF] md:block ${
        selectedChat ? "hidden" : "w-full"
      } lg:w-1/3 p-3`}
    >
      <div
        style={{ position: "sticky", top: 0 }}
        className="flex justify-between items-center p-2"
      >
        <p className="font-bold text-lg italic">My Chats</p>
        <Button
          icon={<InfoOutlined />}
          onClick={() => setIsGroupChatModal(true)}
          className="border-black"
        >
          Create Group
        </Button>
      </div>

      <div className="flex flex-col overflow-y-scroll h-[90%] rounded-lg">
        {isLoading && <Spin className="flex justify-center items-center" />}
        {chats && (
          <>
            {chats.map((chat, index) => {
              const imageUrl = !chat?.isGroupChat
                ? getSenderImage(loggedUser, chat.users)
                : "https://static.vecteezy.com/system/resources/previews/000/550/535/non_2x/user-icon-vector.jpg";

              return (
                <div
                  style={{
                    backgroundColor:
                      selectedChat === chat ? "#176B87" : "#B4D4FF",
                    color: selectedChat === chat ? "white" : "black",
                  }}
                  onClick={() => setSelectedChat(chat)}
                  className="cursor-pointer rounded-lg mt-1 mb-1  flex w-full  items-start"
                  key={index}
                >
                  {imageUrl && (
                    <Image
                      className="rounded-full object-cover ml-4 mt-1"
                      style={{ width: "30px", height: "40px" }}
                      src={imageUrl}
                      width={20}
                      alt="image"
                    />
                  )}

                  <p className="p-3 ml-4">
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
