import { EyeOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Spin, message } from "antd";
import axios from "axios";
import React, { useContext, useState } from "react";
import { ChatContext } from "../../Providers/ChatProvider";
import UserBadgeItem from "../User/UserBadgeItem";
import UserListItem from "../User/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, selectedChat, setSelectedChat } = useContext(ChatContext);
  const [selectedUser, setSelectedUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isRenameLoading, setIsRenameLoading] = useState(false);

  const handleRemoveUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      message.info("User already added");
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      message.info("Only Admins can add new members");
      return;
    }
    try {
      setIsLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const payload = {
        chatId: selectedChat?._id,
        userId: user1._id,
      };
      const { data } = await axios.put(
        "http://localhost:5134/api/chat/groupRemove",
        payload,
        config
      );
      user1._id = user._id ? setSelectedChat() : setSelectedChat(data);

      setFetchAgain(!fetchAgain);
      setIsLoading(false);
    } catch (error) {
      message.error(error.message);
      setIsLoading(false);
    }
  };

  const handleRenameFunction = async () => {
    if (!groupChatName) return message.info("enter new group name");
    try {
      setIsRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const payload = {
        chatId: selectedChat?._id,
        chatName: groupChatName,
      };
      const { data } = await axios.put(
        "http://localhost:5134/api/chat/rename",
        payload,
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setIsRenameLoading(false);
    } catch (error) {
      setIsRenameLoading(false);
      message.error("Failed to rename chat");
      setGroupChatName("");
    }
  };

  const handleChange = async (query) => {
    setSearch(query);
    if (!query) {
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
        `http://localhost:5134/api/user?search=${query}`,
        config
      );
      setIsLoading(false);
      setSearchResult(data);
    } catch (error) {
      setIsLoading(false);
      message.error("Failed to retrieve search results", error);
    }
  };

  const handleGroup = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      message.info("User already added");
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      message.info("Only Admins can add new members");
      return;
    }

    try {
      setIsLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const payload = {
        chatId: selectedChat?._id,
        userId: user1._id,
      };
      const { data } = await axios.put(
        "http://localhost:5134/api/chat/groupAdd",
        payload,
        config
      );

      setSelectedUser(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setIsLoading(false);
    } catch (error) {
      message.error(error.message);
      setIsLoading(false);
    }
  };
  return (
    <>
      <Button
        icon={<EyeOutlined />}
        onClick={() => setIsModalOpen(true)}
      ></Button>
      <Modal
        title={
          <p className="font-semibold flex justify-center items-center italic">
            {selectedChat?.chatName}
          </p>
        }
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        {selectedChat?.users?.map((u) => {
          return (
            <>
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleRemoveUser(u)}
              />
            </>
          );
        })}
        <div className="flex">
          <Input
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
            placeholder="Rename"
          />{" "}
          <span>
            <Button onClick={handleRenameFunction}>Update</Button>
          </span>
        </div>
        <Input
          placeholder="Add User eg: Jatin, Safal, etc..."
          onChange={(e) => handleChange(e.target.value)}
        />

        {selectedUser?.map((user) => (
          <UserBadgeItem
            key={user.id}
            user={user}
            handleFunction={() => handleDelete(user)}
          />
        ))}

        {isLoading ? (
          <Spin />
        ) : (
          searchResult?.slice(0, 4).map((user) => (
            <div className="flex flex-wrap">
              <UserListItem
                key={user._id}
                singleUser={user}
                handleUserAccess={() => handleGroup(user)}
              />
            </div>
          ))
        )}
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
