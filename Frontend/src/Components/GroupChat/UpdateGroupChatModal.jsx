import { EyeOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Spin, Tooltip, message } from "antd";
import React, { useContext, useState } from "react";
import { ChatContext } from "../../Providers/ChatProvider";
import axios from "../Common/axios";
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

  const handleRemoveUser = async (existingUser) => {
    if (selectedChat?.groupAdmin !== user.userId) {
      message.info("Only Admins can remove members");
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
        userId: existingUser._id,
      };
      const { data } = await axios.put(
        "https://v-chat-app-kpbs.onrender.com/api/chat/groupRemove",
        payload,
        config
      );
      existingUser._id === user.userId
        ? setSelectedChat()
        : setSelectedChat(data);

      setFetchAgain(!fetchAgain);
      setIsLoading(false);
    } catch (error) {
      message.error(error.message);
      setIsLoading(false);
    }
  };

  const handleRenameFunction = async () => {
    if (!groupChatName) return message.info("Please enter a new group name");
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
        "https://v-chat-app-kpbs.onrender.com/api/chat/rename",
        payload,
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setIsRenameLoading(false);
      setGroupChatName("");
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
        `https://v-chat-app-kpbs.onrender.com/api/user?search=${query}`,
        config
      );
      setIsLoading(false);
      setSearchResult(data);
    } catch (error) {
      setIsLoading(false);
      message.error("Failed to retrieve search results", error);
    }
  };

  const handleAddGroup = async (addUser) => {
    console.log(selectedChat.groupAdmin, user.userId);
    if (selectedChat.users.find((u) => u._id === addUser._id)) {
      message.info("User already in Group");
      return;
    }
    if (selectedChat.groupAdmin !== user.userId) {
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
        userId: addUser._id,
      };
      const { data } = await axios.put(
        "https://v-chat-app-kpbs.onrender.com/api/chat/groupAdd",
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
      <Tooltip placement="bottom" title="Group Info">
        <Button
          className="border-black"
          icon={<EyeOutlined />}
          onClick={() => setIsModalOpen(true)}
        ></Button>
      </Tooltip>

      <Modal
        title={
          <p className="font-semibold flex justify-center items-center italic">
            {selectedChat?.chatName}
          </p>
        }
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={false}
        width={500}
        destroyOnClose={true}
      >
        {selectedChat?.users?.map((u) => {
          return (
            <>
              <UserBadgeItem
                key={u._id}
                user={u}
                admin={selectedChat?.groupAdmin}
                handleFunction={() => handleRemoveUser(u)}
              />
            </>
          );
        })}
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            {isRenameLoading && <Spin />}
            <Input
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
              placeholder="Rename Group Name"
            />{" "}
            <span>
              <Button onClick={handleRenameFunction}>Update</Button>
            </span>
          </div>
          <Input
            placeholder="Add User eg: Jatin, Safal, etc..."
            onChange={(e) => handleChange(e.target.value)}
          />

          {/* {selectedUser &&
            selectedUser?.map((existingUser) => (
              <UserBadgeItem
                key={existingUser.id}
                user={existingUser}
                admin={selectedChat.groupAdmin}
                handleFunction={() => handleRemoveUser(existingUser)}
              />
            ))} */}
        </div>

        {isLoading ? (
          <Spin className="flex justify-center items-center mt-2" />
        ) : (
          searchResult?.slice(0, 4).map((newUser) => (
            <div className="flex flex-wrap">
              <UserListItem
                key={newUser._id}
                singleUser={newUser}
                handleUserAccess={() => handleAddGroup(newUser)}
              />
            </div>
          ))
        )}
        <div className="pt-3 pb-3">
          <Button
            className="float-right"
            danger
            onClick={() => {
              handleRemoveUser(user).then(() => {
                setSearchResult([]);
                setSelectedUser([]);
                setGroupChatName();
                setIsModalOpen(false);
              });
            }}
          >
            Leave Group
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
