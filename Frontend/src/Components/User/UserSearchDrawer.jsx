import { SearchOutlined } from "@ant-design/icons";
import { Button, Drawer, Input, Spin, Tooltip, message } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../Providers/ChatProvider";
import axios from "../Common/axios";
import UserListItem from "./UserListItem";

const UserSearchDrawer = ({ onClose, onOpen }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [isLoadingChat, setIsloadingChat] = useState(false);

  const { user, chats, setChats, setSelectedChat } = useContext(ChatContext);

  const handleSearchFunction = async () => {
    if (!search) {
      return message.warning("Please enter somehting in the search area");
    }

    try {
      setIsloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `https://v-chat-app-kpbs.onrender.com/api/user?search=${search}`,
        config
      );

      setIsloading(false);
      setSearchResult(data);
    } catch (error) {
      setIsloading(false);
      message.error("Failed to retrieve search results", error);
    }
  };

  const accessChat = async (userId) => {
    try {
      setIsloadingChat(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `https://v-chat-app-kpbs.onrender.com/api/chat/`,
        {
          userId,
        },
        config
      );
      if (!chats.find((chat) => chat._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setIsloadingChat(false);
      onClose();
    } catch (error) {
      setIsloadingChat(false);
      message.error("Failed to retrieve search results", error);
    }
  };

  const handleKeyDownFunction = (event) => {
    if (event.key === "Enter") {
      handleSearchFunction();
    }
  };

  useEffect(() => {
    if (!onOpen) {
      setSearch("");
      setSearchResult([]);
    }
  }, [onOpen]);
  return (
    <Drawer
      title={
        <p className="italic font-semibold flex justify-center text-2xl">
          Search Users
        </p>
      }
      placement={"left"}
      width={300}
      onClose={() => {
        setSearchResult([]);
        setSearch("");
        onClose();
      }}
      open={onOpen}
      footer={false}
      destroyOnClose={true}
      className="overflow-y-scroll"
    >
      <div className="flex gap-2">
        <Input
          autoFocus={true}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placement="search here....."
          onKeyDown={handleKeyDownFunction}
        />
        <Tooltip placement="bottom" title={"Search"}>
          <Button
            onClick={handleSearchFunction}
            icon={<SearchOutlined />}
          ></Button>
        </Tooltip>
      </div>
      {isLoading && <Spin className="flex justify-center items-center p-3" />}
      {isLoadingChat && (
        <Spin className="flex justify-center items-center p-3" />
      )}
      {searchResult.length > 0 &&
        searchResult?.map((user, index) => {
          return (
            <UserListItem
              key={index}
              singleUser={user}
              handleUserAccess={() => accessChat(user?._id)}
            />
          );
        })}
    </Drawer>
  );
};

export default UserSearchDrawer;
