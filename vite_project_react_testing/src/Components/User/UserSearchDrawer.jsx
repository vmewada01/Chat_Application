import { Button, Drawer, Input, Spin, message } from "antd";
import axios from "axios";
import React, { useContext, useState } from "react";
import { ChatContext } from "../../Providers/ChatProvider";
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
        `http://localhost:5134/api/user?search=${search}`,
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
        `http://localhost:5134/api/chat/`,
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
    >
      <div className="flex gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placement="search here....."
          onKeyDown={handleKeyDownFunction}
        />
        <Button onClick={handleSearchFunction}>Go</Button>
      </div>
      {isLoading && <Spin className="flex justify-center items-center p-3" />}
      {searchResult.length > 0 &&
        searchResult?.map((user, index) => {
          return (
            <UserListItem
              key={index}
              singleUser={user}
              handleUserAccess={() => accessChat(user._id)}
            />
          );
        })}
      {isLoadingChat && (
        <Spin className="flex justify-center items-center p-3" />
      )}
    </Drawer>
  );
};

export default UserSearchDrawer;
